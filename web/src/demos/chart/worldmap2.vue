<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

var data = [{
    id: "KR",
    airport: "large"
}, {
    id: "GB",
    airport: "large",
    routes: [ "KR", "IE", "SE", "LT", "PT", "ES", "IT", "UA" ]
}, {
    id: "IE",
    airport: "small"
}, {
    id: "PT",
    airport: "small"
}, {
    id: "ES",
    airport: "small"
}, {
    id: "FR",
    airport: "small"
}, {
    id: "SE",
    airport: "small"
}, {
    id: "UA",
    airport: "small"
}, {
    id: "IT",
    airport: "small"
}, {
    id: "IE",
    airport: "small"
}, {
    id: "NO",
    airport: "small"
}, {
    id: "GR",
    airport: "small"
}, {
    id: "LT",
    airport: "large"
}];

const padding = 0
const axis = [{
        map : {
            path : "../../lib/jui/img/map/world-1040x660.svg",
            width : 1040,
            height : 630,
            scale : 2.5,
            viewX : -800,
            viewY : -150
        },
        data : data
    }]
const brush = [{
        type : "map.flightroute"
    }]
const widget = [{
        type : "map.control",
        align : "start",
        orient : "top",
        dx : 10,
        dy : 10,
        min : 1,
        max : 3
    }]
const style = {
        mapPathBackgroundColor : "#FFCC00",
        mapPathBackgroundOpacity : 0.4,
        mapControlButtonColor : "#FFCC00"
    }

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :padding="padding" :axis="axis" :brush="brush" :widget="widget" :style="style" />
</template>
