<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const items = [
    { value: "check", icon: "check" },
    { value: "plus", icon: "plus" },
    { value: "edit", icon: "edit" },
    { value: "home", icon: "home" },
    { value: "gear", icon: "gear" }
]
const selected = ref([])
const group = ref(null)

function runSetIndex() {
    group.value?.setIndex([3, 4])
}

function onChange({ value }) {
    let result = ""
    for (const v of value) {
        const index = items.findIndex((item) => item.value === v)
        result += "index(" + index + "), value(" + v + ")" + "\n"
    }
    alert(result)
}
</script>

<template>
<ButtonGroup ref="group" v-model="selected" :items="items" type="check" size="normal" @change="onChange" /> <button class="btn" @click="runSetIndex">
    <i class="icon-play"></i> Run
</button>
</template>
