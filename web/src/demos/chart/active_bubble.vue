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
            domain : [ 0, 50 ],
            step : 10,
            line : true
        },
        data : [
            { quarter : "1Q", sales : 40, profit : 35 },
            { quarter : "2Q", sales : 10, profit : 5 },
            { quarter : "3Q", sales : 15, profit : 10 },
            { quarter : "4Q", sales : 30, profit : 25 }
        ]
    }
const brush = {
        type : "bubble",
        min : 30,
        max : 50,
        active : 1,
        activeEvent : "click",
        scaleKey : "profit",
        target : "sales",
        showText : true,
        colors : [ "#ff0000" ]
    }
const event = {
        click : function(data) {
            console.log(data);
        }
    }

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :axis="axis" :brush="brush" :event="event" />
</template>
