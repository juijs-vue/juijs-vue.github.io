<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const items = [
    { text: "CSS", value: "css" },
    { text: "Script", value: "script" }
]
const activeIndex = ref(1)
const menu = [
    { text: "Dropdown 1", value: "1" },
    { divider: true },
    { text: "Dropdown 2", value: "2" },
    { text: "Dropdown 3", value: "3" },
    { text: "Dropdown 4", value: "4" }
]

function handleChangeMenu(data) {
    alert(data.text)
}
</script>

<template>
<Tab v-model="activeIndex" :items="items" position="top" :menu="menu" :content-style="{ background: '#dcdcdc' }" @changemenu="handleChangeMenu">
    <template #panel-css>css</template>
    <template #panel-script>script</template>
</Tab>
</template>
