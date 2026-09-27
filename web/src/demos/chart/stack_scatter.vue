<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

var data = [
    { sales : 2, profit : 6, dept : 7 },
    { sales : 5, profit : 6, dept : 2 },
    { sales : 8, profit : 4, dept : 5 },
    { sales : 10, profit : 5, dept : 12 }
];

const axis = {
        x : {
            type : "block",
            domain: [ "Q1", "Q2", "Q3", "Q4" ],
            line: true
        },
        y : {
            type: "range",
            domain: function(data) {
                return data.sales + data.profit + data.dept;
            },
            step: 10
        },
        data : data
    }
const brush = {
        type : "stackscatter",
        size : 10
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
