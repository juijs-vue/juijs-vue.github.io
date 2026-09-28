<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const items = [
    { text: "A", value: "a" },
    { text: "B", value: "b" },
    { text: "C", value: "c" },
    { text: "Home", value: "home", icon: "home" },
    { value: "gear", icon: "gear" },
    { value: "help", icon: "help" }
]
const selected = ref("a")
const group = ref(null)

function runSetIndex() {
    group.value?.setIndex(3)
}

function onChange({ value }) {
    const index = items.findIndex((item) => item.value === value)
    alert("index(" + index + "), value(" + value + ")")
}
</script>

<template>
<ButtonGroup ref="group" v-model="selected" :items="items" type="radio" size="mini" @change="onChange" /> <button class="btn mini" @click="runSetIndex">
    <i class="icon-play"></i> Run
</button>
</template>
