<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

const axis = {
        x : {
            type : "block",
            domain : [ "Q1", "Q2", "Q3", "Q4" ]
        },
        y : {
            type : "range",
            domain : function(d) {
                return d.sales + d.profit + d.total;
            }
        },
        c : {
            type : "grid3d"
        },
        data : [
            { sales: 12, profit: 10, total: 20 },
            { sales: 15, profit: 6, total: 20 },
            { sales: 8, profit: 10, total: 20 },
            { sales: 18, profit: 5, total: 20 }
        ],
        depth : 20,
        degree : 30
    }
const brush = {
        type : "stackcylinder3d",
        outerPadding : 10
    }
const widget = [{
        type : "tooltip"
    }, {
        type : "title",
        text : "3D Cylinder Sample"
    }]

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :axis="axis" :brush="brush" :widget="widget" />
</template>
