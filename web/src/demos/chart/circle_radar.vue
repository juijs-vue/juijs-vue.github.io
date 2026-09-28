<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

var data = [
    { type : "STR", warrior : 100, wizard : 30, archer : 35 },
    { type : "VIT", warrior : 80, wizard : 50, archer : 70 },
    { type : "DEX", warrior : 50, wizard : 70, archer : 95 },
    { type : "AGI", warrior : 70, wizard : 60, archer : 75 },
    { type : "INT", warrior : 30, wizard : 100, archer : 30 },
    { type : "WIS", warrior : 50, wizard : 90, archer : 40 }
];

const axis = {
        c : {
            type : "radar",
            shape : "circle",
            domain : "type"
        },
        data : data
    }
const brush = {
        type : "path",
        target : [ "warrior", "wizard", "archer" ]
    }

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :axis="axis" :brush="brush" />
</template>
