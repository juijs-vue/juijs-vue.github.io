<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

var data = [
    { quarter : "1Q", sales : 50, profit : 35 },
    { quarter : "2Q", sales : -20, profit : -30 },
    { quarter : "3Q", sales : 10, profit : -5 },
    { quarter : "4Q", sales : 30, profit : 25 }
];

const width = 100
const height = 50
const padding = "empty"
const axis = {
        x : {
            type : "range",
            domain : "sales",
            step : 10,
            hide : true
        },
        y : {
            type : "block",
            domain : "quarter",
            line : true,
            hide : true
        },
        data : data
    }
const brush = {
        type : "bar",
        target : [ "sales", "profit" ]
    }

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :width="width" :height="height" :padding="padding" :axis="axis" :brush="brush" />
</template>
