<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

var data = [
    { quarter : "1Q", sales : 12323000000, profit : 335 },
    { quarter : "2Q", sales : 20042340000, profit : 2 },
    { quarter : "3Q", sales : 1003300, profit : 10022343 },
    { quarter : "4Q", sales : 10322200, profit : 1123213200 }
];

const padding = { left : 100 }
const axis = [{
        x : {
            type : "block",
            domain : "quarter",
            line : true
        },
        y : {
            type : "log",
            domain : function(data) {
                return Math.max(data.sales, data.profit);
            } ,
            step : 10,
            base : 10,
            nice : true,
            line : true
        },
        data : data
    }]
const brush = {
        type : "column",
        target : [ "sales", "profit" ]
    }

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :padding="padding" :axis="axis" :brush="brush" />
</template>
