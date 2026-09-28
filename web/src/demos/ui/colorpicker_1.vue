<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const color = ref("#DCDCDC")
const visible = ref(false)

function onColorChange(newColor) {
    // Optional: handle change event if needed
}

function show() {
    visible.value = true
}

function hide() {
    visible.value = false
}
</script>

<template>
<input v-model="color" type="text" class="input" style="width: 118px;" /> <div class="group" style="margin-bottom: 3px;">
    <button class="btn" @click="show">Show</button> <button class="btn" @click="hide">Hide</button>
</div>

<div v-if="visible" class="colorpicker-wrap">
    <Colorpicker v-model="color" @change="onColorChange" />
</div>
</template>
