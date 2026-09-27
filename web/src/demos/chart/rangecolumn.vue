<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

var data = [
    { quarter : "1Q", sales : [0,20], profit : [0,30] },
    { quarter : "2Q", sales : [10,40], profit : [5,35] },
    { quarter : "3Q", sales : [20,35], profit : [25,70] },
    { quarter : "4Q", sales : [60,80], profit : [50,95] }
];

const axis = {
        x : {
            type : "block",
            domain : "quarter",
            line : true
        },
        y : {
            type : "range",
            domain : [ 0, 100 ],
            step : 10,
            line : true,
            orient : "right"
        },
        data : data
    }
const brush = {
        type : "rangecolumn",
        target : [ "sales", "profit" ],
        outerPadding : 20
    }
const widget = [
    	{ type : "title", text : "Column Sample" },
        { type : "tooltip" },
    	{ type : "legend" }
    ]

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :axis="axis" :brush="brush" :widget="widget" />
</template>
