<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const dd2 = ref(false)

function onDd2Change(data) {
    alert(data.value + ", " + data.text)
}
</script>

<template>
<div class="group">
    <button class="btn" @click="dd2 = true">Show</button> <button class="btn" @click="dd2 = false">Hide</button>
</div>

<Dropdown v-model="dd2" size="large" :close="false" anchor :width="150" style="margin-top: 10px;" @change="onDd2Change">
    <li value="1">Dropdown 1</li>
    <li class="divider"></li>
    <li value="2">Dropdown 2</li>
    <li value="3">Dropdown 3</li>
    <li value="4">Dropdown 4</li>
</Dropdown>
</template>
