<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const items = [
    { text: "On", value: "true" },
    { text: "Off", value: "false" }
]
const selected = ref("false")

function runGetValue() {
    alert(selected.value)
}
</script>

<template>
<ButtonGroup v-model="selected" :items="items" type="radio" size="small" /> <button class="btn small" @click="runGetValue">
    <i class="icon-play"></i> Run
</button>
</template>
