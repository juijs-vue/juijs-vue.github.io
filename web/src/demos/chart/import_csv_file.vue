<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

const axis = {
        x : {
            type : "block",
            domain : "time",
            line : true,
            format : function(value, index) {
                return index;
            }
        },
        y : {
            type : "range",
            domain : function(data) {
                return 1000;
            },
            step : 10,
            line : true
        }
    }
const brush = [{
        type : "line",
        target : []
    }]
const widget = [{
        type : "title",
        text : "Import CSV File"
    }, {
        type : "legend"
    }, {
        type : "tooltip",
        brush : 0
    }, {
        type : "cross",
        xFormat : function(value) {
            return value;
        },
        yFormat : function(value) {
            return Math.ceil(value);
        }
    }]

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :axis="axis" :brush="brush" :widget="widget" />
</template>
