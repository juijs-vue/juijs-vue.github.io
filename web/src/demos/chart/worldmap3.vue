<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

var data = [{
    id: "US",
    flag: true
}, {
    id: "GB"
}, {
    id: "ES",
    flag: true
}, {
    id: "FR"
}, {
    id: "UA",
    flag: true
}, {
    id: "IT",
    flag: true
}, {
    id: "IE"
}, {
    id: "norway",
    flag: true
}, {
    id: "NO",
    flag: true
}, {
    id: "LT"
}];

const padding = 0
const axis = [{
        map : {
            path : "../../lib/jui/img/map/world-1040x660.svg",
            width : 1040,
            height : 630
        },
        data : data
    }]
const brush = [{
        type : "map.marker",
        width : 16,
        height : 16,
        html : function(d) {
            if(d.flag) {
                return "<img src='resource/flag.png' width='16' height='16' />";
            }
        },
        svg : function(d) {
            if(d.id == "GB") {
                return "<circle fill='#7977C2' r='6'></circle>"
            }
        }
    }]
const widget = [{
        type : "map.control",
        align : "start",
        orient : "top",
        dx : 10,
        dy : 10,
        min : 1,
        max : 2
    }]
const style = {
        mapPathBackgroundColor : "#15A892",
        mapPathBackgroundOpacity : 0.6,
        mapControlButtonColor : "#15A892"
    }

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :padding="padding" :axis="axis" :brush="brush" :widget="widget" :style="style" />
</template>
