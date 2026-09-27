<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

var data = [
    { apple : 26.1, microsoft : 24.86, oracle : 22.08 },
    { apple : 43.83, microsoft : 27.14, oracle : 30.15 },
    { apple : 55.03, microsoft : 24, oracle : 36.88 },
    { apple : 72.95, microsoft : 25.39, oracle : 32.78 }
];

const axis = {
        x : {
            type : "fullblock",
            domain : [ "2010", "2011", "2012", "2013" ],
            line : true
        },
        y : {
            type : "range",
            domain : function(d) {
                return Math.max(d.apple, d.microsoft, d.oracle);
            },
            step : 10
        },
        data : data
    }
const brush = {
        type : "scatter",
        display : "max",
        activeEvent : "click"
    }
const widget = [
    	{ type : "title", text : "Scatter Sample" },
    	{ type : "legend" }
    ]

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :axis="axis" :brush="brush" :widget="widget" />
</template>
