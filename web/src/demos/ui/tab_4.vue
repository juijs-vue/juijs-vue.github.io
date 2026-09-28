<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const items = ref([
    { text: "Home", value: "home" },
    { text: "CSS", value: "css" },
    { text: "Script", value: "script" }
])
const activeIndex = ref(0)

function handleUpdateItems(newItems) {
    items.value = newItems
}
</script>

<template>
<Tab v-model="activeIndex" :items="items" position="top" drag :content-style="{ background: '#dcdcdc' }" @update:items="handleUpdateItems">
    <template #panel-home>home</template>
    <template #panel-css>css</template>
    <template #panel-script>script</template>
</Tab>
</template>
