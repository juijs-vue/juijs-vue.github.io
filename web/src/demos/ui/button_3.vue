<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const items = [
    { text: "A", value: "a" },
    { text: "B", value: "b" },
    { text: "C", value: "c" },
    { value: "home", icon: "home", iconExtra: "icon-white" },
    { value: "gear", icon: "gear", iconExtra: "icon-white" },
    { value: "help", icon: "help", iconExtra: "icon-white" }
]
const selected = ref("a")
const group = ref(null)

function runSetValue() {
    group.value?.setValue("gear")
}

function onChange({ value }) {
    const index = items.findIndex((item) => item.value === value)
    alert("index(" + index + "), value(" + value + ")")
}
</script>

<template>
<ButtonGroup ref="group" v-model="selected" :items="items" type="radio" size="mini" @change="onChange" /> <button class="btn mini" @click="runSetValue">
    <i class="icon-play"></i> Run
</button>
</template>
