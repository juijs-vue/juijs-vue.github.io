<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const CounterPanel = {
    props: ["text"],
    setup(props) {
        const count = ref(0)
        function increment() {
            count.value++
        }
        return { count, increment }
    },
    template: `
        <div>
            <h3>{{ text }}</h3>
            <p>이 탭은 자기만의 로컬 상태(count)를 가진 별도 컴포넌트다.</p>
            <button class="btn small" @click="increment">Count: {{ count }}</button>
        </div>
    `
}

// 이 컴포넌트는 자기만의 v-model(note)을 갖는다 - 마찬가지로 탭마다 독립적이다.
const NotePanel = {
    props: ["text"],
    setup() {
        const note = ref("")
        return { note }
    },
    template: `
        <div>
            <h3>{{ text }}</h3>
            <p>이 탭은 자기만의 v-model(note)을 가진 별도 컴포넌트다.</p>
            <input class="input small" v-model="note" placeholder="메모 입력" />
            <p>입력한 값: {{ note || "(없음)" }}</p>
        </div>
    `
}

// tab_1/tab_2처럼 미리 아는 정적 탭은 slot(#panel-{value})으로 붙인다 - content를
// 안 주면 Tab.vue가 자동으로 슬롯 쪽으로 폴백한다.
function makeSlotItem(text, value) {
    return { text, value }
}

// Append/Prepend/Insert로 "런타임에" 추가되는 탭은 매번 다른 컴포넌트를 붙일 수
// 있다는 걸 보여준다 - 슬롯 하나를 재사용하는 게 아니라 진짜 서로 다른(그리고 각자
// 독립된 로컬 상태를 갖는) 컴포넌트가 매번 새로 꽂힌다.
function makeDynamicItem(text, value, component) {
    return { text, value, content: component, contentProps: { text } }
}

const items = ref([
    makeSlotItem("Tab1", "tab1"),
    makeSlotItem("Tab2", "tab2"),
    makeSlotItem("Tab3", "tab3")
])
const activeIndex = ref(0)
let count = 3
const tabRef = ref(null)

function handleAppend() {
    count += 1
    tabRef.value?.append(makeDynamicItem("Tab" + count, "tab" + count, CounterPanel))
}

function handlePrepend() {
    count += 1
    tabRef.value?.prepend(makeDynamicItem("Tab" + count, "tab" + count, NotePanel))
}

function handleInsert() {
    count += 1
    const component = count % 2 === 0 ? CounterPanel : NotePanel
    tabRef.value?.insert(2, makeDynamicItem("Tab" + count, "tab" + count, component))
}

function handleRemove() {
    tabRef.value?.remove(0)
}

function handleMove() {
    tabRef.value?.move(0, 2)
}
</script>

<template>
<div class="group">
    <button class="btn small" @click="handleAppend">Append</button> <button class="btn small" @click="handlePrepend">Prepend</button> <button class="btn small" @click="handleInsert">Insert</button> <button class="btn small" @click="handleRemove">Remove</button> <button class="btn small" @click="handleMove">Move</button>
</div>

<div class="row" style="padding-top: 15px;">
    <Tab ref="tabRef" v-model="activeIndex" v-model:items="items" position="top" :content-style="{ background: '#dcdcdc' }">
        <template v-for="item in items" :key="item.value" #[`panel-${item.value}`]="{ item: slotItem }">
            <h3>{{ slotItem.text }}</h3>
            <p>이 탭은 Append/Prepend/Insert로 런타임에 추가됐을 수도 있는데, 슬롯도 그때그때 같이 생긴다.</p>
            <ul>
                <li>value: {{ slotItem.value }}</li>
            </ul>
        </template>
    </Tab>
</div>
</template>
