<script setup lang="ts">
import { ref } from "vue"
import { Dropdown } from "jui-ui-vue"

const DOWNLOAD_LINKS: Record<string, string> = {
    "1": "https://github.com/juijs-vue/jui-core-ts/archive/main.zip",
    "2": "https://github.com/juijs-vue/jui-ui-vue/archive/main.zip",
    "3": "https://github.com/juijs-vue/jui-grid-vue/archive/main.zip",
    "4": "https://github.com/juijs-vue/jui-chart-vue/archive/main.zip"
}

const items = [
    { value: "1", text: "Core" },
    { value: "2", text: "UI" },
    { value: "3", text: "Grid" },
    { value: "4", text: "Chart" }
]

const open = ref(false)
const dropdown = ref<InstanceType<typeof Dropdown> | null>(null)
const btnEl = ref<HTMLElement | null>(null)

// 원본(res/index.js)은 이 버튼의 클릭 핸들러가 `return false`로 끝나는데, jQuery에서 이건
// preventDefault()뿐 아니라 stopPropagation()까지 같이 한다 - Dropdown이 "바깥 클릭 시 자동
// 닫힘"을 document 레벨 클릭 리스너로 구현하기 때문에(원본/jui-ui-vue 둘 다 동일하게
// e.target.tagName만 얕게 검사), stopPropagation 없이 열면 정작 이 버튼(안의 아이콘 div가
// 실제 클릭 타깃이라 tagName이 A/BUTTON이 아님) 클릭 자체가 document까지 버블링돼 "바깥
// 클릭"으로 오인되어 연 직후 같은 이벤트 안에서 바로 닫혀버린다.
function onButtonClick() {
    if (!btnEl.value) return
    const rect = btnEl.value.getBoundingClientRect()
    dropdown.value?.show(rect.left + window.scrollX, rect.top + window.scrollY + rect.height)
}

function onChange(item: { value: string }) {
    window.open(DOWNLOAD_LINKS[item.value])
}
</script>

<template>
    <a ref="btnEl" @click.prevent.stop="onButtonClick"><div class="img img-download2"></div></a>
    <Dropdown ref="dropdown" v-model="open" :items="items" :width="135" size="large" anchor @change="onChange" />
</template>
