<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

const brush = {
        type : 'gauge',
        value : 200,
        min : 10,
        max : 700,
        startAngle : -90,
        endAngle : 180,
        arrow : true,
        unitText : "feeds"
    }

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :brush="brush" />
</template>
