<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

const width = 150
const height = 330
const padding = "empty"
const brush = {
        type : "fillgauge",
        shape : "custom", // default circle
        direction : "horizontal",
        value : 50,
        min : 0,
        max : 100,
        svg : "../res/doc/chart/resource/woman.svg"
    }

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :width="width" :height="height" :padding="padding" :brush="brush" />
</template>
