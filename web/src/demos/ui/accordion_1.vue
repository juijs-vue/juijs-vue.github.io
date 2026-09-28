<script setup lang="ts">
// @ts-nocheck
import { reactive, ref } from "vue"

const LOREM = "The style components provide various options in addition to the basic functionality. In addition, script components can be added, which facilitate the development of more diverse UI components."

const items = [
    { title: "Group Item #1", value: "a", text: LOREM },
    { title: "Group Item #2", value: "b", text: LOREM },
    { title: "Group Item #3", value: "c", text: LOREM }
]

const open = ref(1)
const icons = reactive(["icon-arrow1", "icon-arrow3", "icon-arrow1"])

function onOpen(index) {
    icons[0] = "icon-arrow1"
    icons[1] = "icon-arrow1"
    icons[2] = "icon-arrow1"
    icons[index] = "icon-arrow3"
}
</script>

<template>
<Accordion v-model="open" :items="items" @open="onOpen">
    <template v-for="item in items" :key="item.value" #[`content-${item.value}`]>
        {{ item.text }}
    </template>
    <template #icon="{ index }"><i :class="icons[index]"></i></template>
</Accordion>
</template>
