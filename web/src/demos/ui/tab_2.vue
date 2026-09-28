<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const items = [
    { text: "Home", value: "home" },
    { text: "CSS", value: "css" },
    { text: "Script", value: "script" }
]
const activeIndex = ref(1)

function handleChange(data) {
    alert(data.item.text)
}
</script>

<template>
<Tab v-model="activeIndex" :items="items" variant="pill" position="bottom" :content-style="{ background: '#dcdcdc' }" @change="handleChange">
    <template #panel-home>
        <h3>Home</h3>
        <p>pill 스타일 + bottom 위치에서도 슬롯 콘텐츠는 동일하게 여러 요소를 담을 수 있다.</p>
    </template>
    <template #panel-css>
        <h3>CSS</h3>
        <ul>
            <li>color</li>
            <li>background</li>
            <li>border</li>
        </ul>
    </template>
    <template #panel-script>
        <h3>Script</h3>
        <p>Home/CSS 탭과 다르게 이미지나 다른 컴포넌트를 넣어도 무방하다.</p>
    </template>
</Tab>
</template>
