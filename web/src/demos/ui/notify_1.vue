<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const notify1 = ref(null)
const notify2 = ref(null)
const notify3 = ref(null)

function notifyTopSubmit(type, color) {
    const data = {
        title: "Caution message Send!!!",
        message: "Feb 15, 2013-12-24 02:24:19",
        color: color
    }

    const refs = { 1: notify1, 2: notify2, 3: notify3 }
    if (refs[type]?.value) {
        refs[type].value.add(data)
    }
}
</script>

<template>
<div class="group">
    <button class="btn small" @click="notifyTopSubmit(1, '')">Top-Right</button> <button class="btn small" @click="notifyTopSubmit(2, 'danger')">Top-Left</button> <button class="btn small" @click="notifyTopSubmit(3, 'warning')">Top</button>
</div>

<Notify ref="notify1" position="top-right" @show="(d) => console.log('show : ' + JSON.stringify(d))" @hide="(d) => console.log('hide : ' + JSON.stringify(d))" @select="(d) => console.log('click : ' + JSON.stringify(d))" />
<Notify ref="notify2" position="top-left" :timeout="0" @show="(d) => console.log('show : ' + JSON.stringify(d))" @hide="(d) => console.log('hide : ' + JSON.stringify(d))" @select="(d) => console.log('click : ' + JSON.stringify(d))" />
<Notify ref="notify3" position="top" :timeout="2000" :padding="{ top: 100 }" @show="(d) => console.log('show : ' + JSON.stringify(d))" @hide="(d) => console.log('hide : ' + JSON.stringify(d))" @select="(d) => console.log('click : ' + JSON.stringify(d))" />
</template>
