<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

var data = [{
    id: "KR",
    value: 50220000
}, {
    id: "CN",
    value: 1357000000
}, {
    id: "US",
    value: 318900000
}, {
    id: "FR",
    value: 66030000
}, {
    id: "BR",
    value: 200400000
}, {
    id: "AU",
    value: 23130000
}, {
    id: "JP",
    value: 127300000
}, {
    id: "IN",
    value: 1252000000
}, {
    id: "RU",
    value: 143500000
}, {
    id: "GB",
    value: 64100000
}];

const padding = 0
const axis = [{
        map : {
            path : "../../lib/jui/img/map/world-1040x660.svg",
            width : 1040,
            height : 630,
            scale : 1.5
        },
        data : data
    }]
const brush = [{
        type : "map.bubble",
        min : 5,
        max : 50,
        colors : function(d) {
            if(d.value > 1000000000) {
                return "linear(top) #ff686c,0.9 #fa5559";
            } else if(d.value > 100000000) {
                return "linear(top) #ff9d46,0.9 #ff7800";
            } else if(d.value > 50000000) {
                return "linear(top) #b76fef,0.9 #9228e4";
            }

            return "linear(top) #9694e0,0.9 #7977C2";
        }
    }, {
        type : "map.selector",
        activeEvent : "map.click"
    }]
const widget = [{
        type : "map.control",
        align : "start",
        orient : "top",
        dx : 10,
        dy : 10
    }, {
        type : "map.tooltip",
        format : function(obj) {
            if(obj.data.id == "south korea") {
                return "Korea";
            }

            return obj.data.id;
        }
    }]
const style = {
        mapPathBorderWidth: 0.5
    }

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :padding="padding" :axis="axis" :brush="brush" :widget="widget" :style="style" />
</template>
