<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

const axis = {
        x : {
            domain : "quarter",
            line : true
        },
        y : {
            type : "range",
            domain : "sales",
            step : 10
        },
        data : [
            { quarter : "1Q", sales : 49, profit : 35 },
            { quarter : "2Q", sales : 38, profit : 30 },
            { quarter : "3Q", sales : 10, profit : 4 },
            { quarter : "4Q", sales : 30, profit : 24 }
        ]
    }
const brush = [
        { type : "column", target : "profit", colors : [ 0 ] },
        { type : "line", target : "sales", colors : [ 2 ], symbol: "curve" },
        { type : "scatter", target : "sales", colors : [ 2 ], size: 10 }
    ]
const widget = [
    	{ type : "title", text : "Combination Sample" },
    	{ type : "legend", brush : [ 0, 1 ] }
    ]

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :axis="axis" :brush="brush" :widget="widget" />
</template>
