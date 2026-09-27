<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

var data = [
    { quarter : "1Q", sales : 50, profit : 45 },
    { quarter : "2Q", sales : 30, profit : 25 },
    { quarter : "3Q", sales : 15, profit : 10 },
    { quarter : "4Q", sales : 60, profit : 55 }
];

const axis = {
        x : {
            type : "range",
            domain : "sales",
            step : 10,
      		line : true
        },
        y : {
            type : "block",
            domain : "quarter",
            line : true
        },
        data : data
    }
const brush = [{
        type : "bar",
        target : "sales",
        colors : [ 0 ],
        outerPadding : 15
    }, {
        type : "bar",
        target : "profit",
        colors : [ 2 ],
        outerPadding : 30
    }]
const widget = [
        { type : "title", text : "Bar Sample" },
        { type : "tooltip", orient : "right", brush : [ 0, 1 ] },
        { type : "legend", brush : [ 0, 1 ] }
    ]

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :axis="axis" :brush="brush" :widget="widget" />
</template>
