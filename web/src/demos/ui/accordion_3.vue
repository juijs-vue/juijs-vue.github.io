<script setup lang="ts">
// @ts-nocheck
import { reactive, ref } from "vue"

const items = [
    { title: "Group Item #1", value: "a", text: "First Accordion" },
    { title: "Group Item #2", value: "b", text: "Second Accordion" },
    { title: "Group Item #3", value: "c", text: "Three Accordion" }
]

const open = ref([0])
const icons = reactive(["icon-arrow3", "icon-arrow1", "icon-arrow1"])

function onOpen(index) {
    icons[index] = "icon-arrow3"
}

function onFold(index) {
    icons[index] = "icon-arrow1"
}

function onInit() {
    console.log("accordian initialized.")
}
</script>

<template>
<Accordion v-model="open" :items="items" variant="simple" multipanel autoFold @open="onOpen" @fold="onFold" @init="onInit">
    <template v-for="item in items" :key="item.value" #[`content-${item.value}`]>
        {{ item.text }}
    </template>
    <template #icon="{ index }"><i :class="icons[index]"></i></template>
</Accordion>
</template>
