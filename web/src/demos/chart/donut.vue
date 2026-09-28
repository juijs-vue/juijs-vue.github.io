<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

var names = {
    ie: "IE",
    ff: "Fire Fox",
    chrome: "Chrome",
    safari: "Safari",
    other: "Others"
};

const padding = 150
const axis = {
        data : [
            { ie : 70, ff : 11, chrome : 9, safari : 6, other : 4 }
        ]
    }
const brush = {
        type : "donut",
        showText : "inside",
        format : function(k, v) {
            return v + "%";
        }
    }
const widget = [{
        type : "title",
        text : "Donut Sample"
    }, {
        type : "tooltip",
        orient : "left",
        format : function(data, k) {
            return {
                key: names[k],
                value: data[k]
            }
        }
    }, {
        type : "legend",
        format : function(k) {
            return names[k];
        }
    }]

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :padding="padding" :axis="axis" :brush="brush" :widget="widget" />
</template>
