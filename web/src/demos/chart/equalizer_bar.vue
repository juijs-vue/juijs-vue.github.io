<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

const padding = {
        left: 75
    }
const axis = [{
        x : {
            type : "range",
            domain : function(d) {
                return Math.max(d.normal, d.warning, d.fatal);
            },
            step : 5,
            line : true
        },
        y : {
            domain : [ "1 year ago", "1 month ago", "Yesterday", "Today" ],
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
        type : "equalizerbar",
        target : [ "normal", "warning", "fatal" ],
        unit : 10
    }]
const widget = [{
        type : "title",
        text : "Equalizer Sample",
        align: "end"
    }, {
        type : "tooltip"
    }, {
        type : "legend"
    }]

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :padding="padding" :axis="axis" :brush="brush" :widget="widget" />
</template>
