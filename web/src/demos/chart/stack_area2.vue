<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

var data = [
    { sales : 2, profit : 6, sales2 : -10, profit2 : -5 },
    { sales : 5, profit : 6, sales2 : -8, profit2 : -4 },
    { sales : 8, profit : 4, sales2 : -5, profit2 : -6 },
    { sales : 10, profit : 5, sales2 : -2, profit2 : -6 }
];

const axis = {
        x : {
            type : "fullblock",
            domain : [ "Q1", "Q2", "Q3", "Q4" ],
            line : true
        },
        y : {
            type: "range",
            domain: [ -20, 20 ],
            step: 10
        },
        data : data
    }
const brush = [{
        type : "stackarea",
        startZero : true,
        target : [ "sales", "profit" ]
    }, {
        type : "stackarea",
        startZero : true,
        target : [ "sales2", "profit2" ],
        colors : [ 3, 4 ]
    }]
const widget = [{
        type : "title",
        text : "Area Sample"
    }, {
        type : "legend",
        brush : [ 0, 1 ]
    }]

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :axis="axis" :brush="brush" :widget="widget" />
</template>
