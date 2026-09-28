<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

const axis = [{
        x : {
            domain : [ "1 year ago", "1 month ago", "Yesterday", "Today" ],
            line : true
        },
        y : {
            type : "range",
            domain : function(d) {
                return Math.max(d.normal, d.warning, d.fatal);
            },
            step : 5,
            line : true
        },
        data : [
            { normal : 5, warning : 15, fatal : 5 },
            { normal : 25, warning : 8, fatal : 5 },
            { normal : 12, warning : 4, fatal : 10 },
            { normal : 18, warning : 5, fatal : 7 }
        ]
    }]
const brush = [{
        type : "equalizercolumn",
        target : [ "normal", "warning", "fatal" ],
        unit : 10
    }]
const widget = [
        {
            type : "title",
            text : "Equalizer Sample"
        }, {
            type : "legend",
            format : function(key) {
                if(key == "normal") return "Default";
                else if(key == "warning") return "Warning";
                else return "Critical";
            }
        }, {
            type : "tooltip",
            all : true
        }
    ]

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :axis="axis" :brush="brush" :widget="widget" />
</template>
