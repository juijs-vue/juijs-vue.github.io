<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const from = ref(0.5)

function format(d) {
    return d.toFixed(1)
}
</script>

<template>
<div style="height: 200px;">
    <Slider v-model:from="from" orient="vertical" :min="0" :max="1" :step="0.1" :format="format" />
</div>
</template>
