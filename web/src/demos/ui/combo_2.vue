<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const items = [
    { value: "1", text: "New" },
    { value: "2", text: "Open" },
    { value: "3", text: "Save" },
    { value: "4", text: "Close" },
    { value: "5", text: "Restart" },
    { divider: true },
    { value: "6", text: "Print" },
    { divider: true },
    { value: "7", text: "Exit" }
]
const combo2Ref = ref(null)
const combo2Value = ref(undefined)

function onCombo2Change(data) {
    alert("text(" + data.text + "), value(" + data.value + ")")
}

function combo2Run() {
    combo2Ref.value.setIndex(1)
}
</script>

<template>
<Combo
    ref="combo2Ref"
    v-model="combo2Value"
    :items="items"
    :index="3"
    :width="200"
    :keydown="true"
    @change="onCombo2Change"
/> <button class="btn" @click="combo2Run">
    <i class="icon-play"></i> Run
</button>
</template>
