<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

const padding = 0
const axis = {
        data : [
            { title : "OPTION 1", value : 75 },
            { title : "OPTION 2", value : 68 },
            { title : "OPTION 3", value : 60 },
            { title : "OPTION 4", value : 70 },
            { title : "OPTION 5", value : 20 },
            { title : "OPTION 6", value : 20 },
        ]
    }
const brush = {
        type: "bargauge",
        size: 18,
        format: function(value) {
            return value + "%";
        }
    }

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :padding="padding" :axis="axis" :brush="brush" />
</template>
