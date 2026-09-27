<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

var data = [
    { quarter : "1Q", samsung : 50, lg : 35, sony: 10 },
    { quarter : "2Q", samsung : 20, lg : 30, sony: 5 },
    { quarter : "3Q", samsung : 20, lg : 5, sony: 10 },
    { quarter : "4Q", samsung : 30, lg : 25, sony: 15 }
];

const axis = {
        x : {
            type : "block",
            domain : "quarter",
            line : true
        },
        y : {
            type : "range",
            domain : [ 0, 100 ],
            format : function(value) {
                return value + "%";
            },
            line : true,
            orient : "right"
        },
        data : data
    }
const brush = {
        type : "fullstackcolumn",
        target : [ "samsung", "lg", "sony" ],
        showText : true
    }
const widget = [
        { type : "title", text : "Column Sample" },
        { type : "legend", filter : true }
    ]

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :axis="axis" :brush="brush" :widget="widget" />
</template>
