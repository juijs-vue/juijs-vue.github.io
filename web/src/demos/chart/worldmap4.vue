<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

const padding = 0
const axis = [{
        map : {
            path : "../../lib/jui/img/map/world-1040x660.svg",
            width : 1040,
            height : 630
        },
        data : [{
            title: "2014",
            value: 2.6
        }, {
            title: "2013",
            value: 2.3
        }]
    }]
const brush = [{
        type : "map.comparebubble",
        size : 150,
        colors : [ "#ffc000", "#fffc00" ],
        format : function(value) {
            return "$" + value + " Billion";
        }
    }]
const widget = [{
        type : "title",
        size : "50px",
        color : "white",
        text : "15.8%",
        dy : 130
    }]
const style = {
        backgroundColor: "#814fd5",
        mapPathBackgroundColor: "rgb(149,107,220)",
        mapPathBorderColor: "#814fd5",
        mapPathBorderWidth: 0.5
    }

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :padding="padding" :axis="axis" :brush="brush" :widget="widget" :style="style" />
</template>
