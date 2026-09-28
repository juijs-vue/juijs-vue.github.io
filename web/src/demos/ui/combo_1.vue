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
const combo1Ref = ref(null)
const combo1Value = ref("3")

function onCombo1Change(data) {
    alert("text(" + data.text + "), value(" + data.value + ")")
}

function combo1Run() {
    alert(combo1Ref.value.getText())
}
</script>

<template>
<Combo
    ref="combo1Ref"
    v-model="combo1Value"
    :items="items"
    size="small"
    :text-style="{ width: '179px' }"
    @change="onCombo1Change"
/> <button class="btn small" @click="combo1Run">
    <i class="icon-play"></i> Run
</button>
</template>
