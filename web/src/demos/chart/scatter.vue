<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

const axis = {
        x : {
            type : "block",
            domain : [ "Q1", "Q2", "Q3", "Q4" ],
            line : true
        },
        y : {
            type : "range",
            domain : "total",
            step : 10
        },
        data : [
            { sales : 2, profit : 15, total : 20 },
            { sales : 15, profit : 6, total : 20 },
            { sales : 8, profit : 10, total : 20 },
            { sales : 18, profit : 5, total : 20 }
        ]
    }
const brush = {
        type : "scatter",
        symbol : function(k, v) {
            if(k == "sales") return "circle";
            else if(k =="profit") return "rectangle";
            return "triangle";
        },
        size: 10
    }
const widget = [
        { type : "title", text : "Scatter Sample"},
        { type : "tooltip" }
    ]

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :axis="axis" :brush="brush" :widget="widget" />
</template>
