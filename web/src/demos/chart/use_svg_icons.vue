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

// The SVG icon of style components can be used in chart

const padding = 150
const axis = {
        data : [
            { ie : 70, ff : 11, chrome : 9, safari : 6, other : 4 }
        ]
    }
const brush = {
        type : "pie",
        format : function(k, v) {
            return names[k] + ": " + v;
        },
        showText : true
    }
const widget = [
    	{
            type : "title",
            text : "Pie Sample"
        }, {
            type : "tooltip",
            orient : "left",
            format : function(k, v) {
                return this.icon("label") + v;
            }
        }, {
            type : "legend",
            icon : "{chart}",
            format : function(k) {
                return names[k];
            }
        }
    ]

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :padding="padding" :axis="axis" :brush="brush" :widget="widget" />
</template>
