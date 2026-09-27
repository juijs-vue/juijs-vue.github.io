<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

const axis = {
        data : [{
            value : 50,
            min : 0,
            max : 100
        }]
    }
const brush = {
        type : "circlegauge"
    }
const widget = {
        type : "tooltip"
    }

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :axis="axis" :brush="brush" :widget="widget" />
</template>
