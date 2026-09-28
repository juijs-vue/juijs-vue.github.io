<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

const axis = {
        x : {
            type : "block",
            domain : "quarter",
            line : true
        },
        y : {
            type : "range",
            domain : function(d) { return [d.sales, d.profit ]; },
            step : 10,
            line : true,
            orient : "right"
        },
        data : [
            { quarter : "1Q", sales : 50, profit : 35 },
            { quarter : "2Q", sales : -20, profit : -30 },
            { quarter : "3Q", sales : 10, profit : -5 },
            { quarter : "4Q", sales : 30, profit : 25 }
        ]
    }
const brush = {
        type : "column",
        target : [ "sales", "profit" ]
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
