<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

const axis = [{
        x : {
            type : "block",
            domain : [ "2012", "2013", "2014", "2015", "2016", "2017" ]
        },
        y : {
            type : "range",
            domain : [ 0, 100 ],
            step : 5
        },
        data : [
            { value : 50 },
            { value : 60 },
            { value : 70 },
            { value : 80 },
            { value : 90 },
            { value : 100 }
        ]
    }]
const brush = [{
        type : "column",
        outerPadding : 20,
        target : "value"
    }]

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :axis="axis" :brush="brush" />
</template>
