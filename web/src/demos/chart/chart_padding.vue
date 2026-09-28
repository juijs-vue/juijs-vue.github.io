<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

const padding = {
        top : 100,
        left : 100
        //right : 50,
        //bottom : 50
    }
const axis = [{
        x : {
            type : "block",
            domain : "quarter",
            line : true
        },
        y : {
            type : "range",
            domain : "sales",
            step : 10,
            line : true
        },
        data : [
            { quarter : "1Q", sales : 50 },
            { quarter : "2Q", sales : -20 },
            { quarter : "3Q", sales : 10 },
            { quarter : "4Q", sales : 30 }
        ]
    }]
const brush = [{
        type : "bubble",
        target : "sales"
    }]
const widget = [{
        type : "title",
        text : "Set chart padding",
        orient : "top",
        align : "start"
    }]

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :padding="padding" :axis="axis" :brush="brush" :widget="widget" />
</template>
