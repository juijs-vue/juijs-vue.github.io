<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

const axis = {
        y : {
           type : "range",
           domain : [0, 100],
           step : 10,
           dist : -150
        }
    }
const brush = {
        type : "fillgauge",
        value : 70,
        min : 0,
        max : 100
    }

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :axis="axis" :brush="brush" />
</template>
