<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const notify4 = ref(null)
const notify5 = ref(null)
const notify6 = ref(null)

function notifyBottomSubmit(type, color) {
    const data = {
        title: "Caution message Send!!!",
        message: "Feb 15, 2013-12-24 02:24:19",
        color: color
    }

    const refs = { 4: notify4, 5: notify5, 6: notify6 }
    if (refs[type]?.value) {
        refs[type].value.add(data)
    }
}
</script>

<template>
<div class="group">
    <button class="btn small" @click="notifyBottomSubmit(4, 'success')">Bottom</button> <button class="btn small" @click="notifyBottomSubmit(5, 'info')">Bottom-Left</button> <button class="btn small" @click="notifyBottomSubmit(6, 'warning')">Bottom-Right</button>
</div>

<div id="notify_target" style="margin-top: 10px; width: 100%; height: 500px; background: #dcdcdc; position: relative;">
    <Notify ref="notify4" position="bottom" :timeout="0" :distance="30" @show="(d) => console.log('show : ' + JSON.stringify(d))" @hide="(d) => console.log('hide : ' + JSON.stringify(d))" @select="(d) => console.log('click : ' + JSON.stringify(d))" />
    <Notify ref="notify5" position="bottom-left" :show-duration="1000" :hide-duration="1000" />
    <Notify ref="notify6" position="bottom-right" show-easing="linear" />
</div>
</template>
