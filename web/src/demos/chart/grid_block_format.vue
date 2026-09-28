<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

var data = [];

for(var i = 1; i <= 30; i++) {
    data.push({ date : i, value : Math.floor(Math.random() * 100) + 1 });
}

const axis = [{
        x : {
            type : "block",
            domain : "date",
            format : function(date, index) {
                if(index % 2 == 0) {
                    return "[" + date + "]";
                }
            }
        },
        y : {
            type : "range",
            domain : [ 0, 100 ],
            step : 5
        },
        data : data
    }]
const brush = [{
        type : "column",
        target : "value"
    }]

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :axis="axis" :brush="brush" />
</template>
