<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

var names = {
    KR: "Korea",
    CN: "China",
    JP: "Japan"
}

var data = [{
    id: "KR",
    value: 50220000,
    texts: [
        "50.22 million people in 2013",
        "47.01 million people in 2000",
        "45.95 million people in 1997"
    ]
}, {
    id: "CN",
    value: 1357000000,
    texts: [
        "13.57 billion people in 2013",
        "12.63 billion people in 2000",
        "12.3 billion people in 1997"
    ]
}, {
    id: "JP",
    value: 127300000,
    texts: [
        "1.273 billion people in 2013",
        "1.269 billion people in 2000",
        "1.261 billion people in 1997"
    ]
}];

const padding = 0
const axis = [{
        map : {
            path : "../../lib/jui/img/map/world-1040x660.svg",
            width : 1040,
            height : 630,
            scale : 3,
            viewX : -300,
            viewY : 100
        },
        data : data
    }]
const brush = [{
        type : "map.selector",
        active : [ "KR", "JP", "CN" ]
    }, {
        type : "map.note",
        active : [ "KR" ],
        activeEvent : "map.mouseover",
        format : function(data) {
            return names[data.id];
        }
    }]
const widget = [{
        type : "map.control",
        align : "start",
        orient : "top",
        dx : 10,
        dy : 10
    }]
const style = {
        fontFamily: "noto sans, sans-serif",
        backgroundColor: "#ffcb2b",
        mapPathBackgroundColor: "rgb(255,229,149)",
        mapPathBorderColor: "#ffcb2b",
        mapPathBorderWidth: 0.5,
        mapControlButtonColor: "#ffcb2b",
        mapSelectorHoverColor: "rgb(255,255,255)",
        mapSelectorActiveColor: "rgb(242,140,8)",
        tooltipBorderColor: "#a9a9a9"
    }

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :padding="padding" :axis="axis" :brush="brush" :widget="widget" :style="style" />
</template>
