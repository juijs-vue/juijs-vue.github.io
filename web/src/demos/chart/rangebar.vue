<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

var data = [
    { quarter : "1Q", sales : [10,50], profit : [10,35] },
    { quarter : "2Q", sales : [-20,5], profit : [-30,7] },
    { quarter : "3Q", sales : [10,30], profit : [0,30] },
    { quarter : "4Q", sales : [35,70], profit : [30,60] }
];

const axis = {
        x : {
            type : "range",
            domain : [ -40, 80 ],
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
const brush = {
        type : "rangebar",
        target : [ "sales", "profit" ],
        outerPadding : 20
    }
const widget = [
        { type : "title", text : "Bar Sample" },
        { type : "tooltip", orient: "right" },
        { type : "legend" }
    ]

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :axis="axis" :brush="brush" :widget="widget" />
</template>
