<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const from = ref(50)
const to = ref(70)
const info = ref("")
const showInfo = ref(false)

function onSliderChange(data) {
    info.value = data.from + "~" + data.to
    showInfo.value = true
}
</script>

<template>
<div class="row">
    <div class="col col-8">
        <Slider type="double" v-model:from="from" v-model:to="to" :min="0" :max="100" :step="1" :tooltip="false" @change="onSliderChange" />
    </div>
    <div class="col col-4">
        <div class="label small" :style="{ display: showInfo ? 'inline-block' : 'none' }">{{ info }}</div>
    </div>
</div>
</template>
