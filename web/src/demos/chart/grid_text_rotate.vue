<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

const axis = [{
        x : {
            type : "block",
            domain : [ "2012", "2013", "2014", "2015", "2016", "2017" ],
            textRotate : -30
        },
        y : {
            type : "range",
            domain : [ 0, 100 ],
            step : 5,
            textRotate : 20,
            line : "dashed rect" // 'solid' or true
        }
    }]
const style = {
        gridTickBorderSize : 7,
        gridTickPadding : 10
    }

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :axis="axis" :style="style" />
</template>
