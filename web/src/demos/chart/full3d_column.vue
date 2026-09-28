<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

const padding = 100
const axis = {
        x : {
            type : "block",
            domain : [ "Q1", "Q2", "Q3", "Q4" ],
            line : true,
            orient : "bottom"
        },
        y : {
            type : "range",
            domain : "total",
            step : 5,
            hide : true
        },
        z : {
            type : "block",
            domain : [ "sales", "profit", "total" ],
            line: true
        },
        data : [
            { sales: 0, profit: 15, total: 20 },
            { sales: 15, profit: 6, total: 20 },
            { sales: 8, profit: 10, total: 20 },
            { sales: 18, profit: 5, total: 20 }
        ],
        depth: 300,
        degree: {
            x: 30,
            y: 20,
            z: 0
        },
        perspective: 0.6
    }
const brush = {
        type: "polygon.column3d",
        target : [ "sales", "profit", "total" ]
    }
const widget = [{
        type : "polygon.rotate3d"
    }, {
        type : "tooltip"
    }]
const style = {
        gridXAxisBorderWidth: 1,
        gridYAxisBorderWidth: 1,
        gridZAxisBorderWidth: 1
    }

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :padding="padding" :axis="axis" :brush="brush" :widget="widget" :style="style" />
</template>
