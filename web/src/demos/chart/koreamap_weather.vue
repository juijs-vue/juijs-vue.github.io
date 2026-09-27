<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

// jui-chart-vue's own default icon font path is an absolute `/lib/jui-chart-vue/...` URL baked in
// at ITS OWN build time (for the original Flask deployment) - wrong for this SPA's own
// `/` base (real 404s otherwise). See `web/scripts/copy-legacy-static.mjs`'s matching
// font-copy entry.
const icon = {
    type: "classic",
    path: [
        "../../lib/jui-chart-vue/fonts/icomoon.eot",
        "../../lib/jui-chart-vue/fonts/icomoon.woff",
        "../../lib/jui-chart-vue/fonts/icomoon.ttf",
        "../../lib/jui-chart-vue/fonts/icomoon.svg"
    ]
}

var data = [{
    id: "서울",
    temperature: 25,
    weather: "cloudy",
    dx: 10
}, {
    id: "인천",
    temperature: 28,
    weather: "sunny",
    dx: -50,
    dy: -25
}, {
    id: "강원",
    temperature: 25,
    weather: "rain"
}, {
    id: "충북",
    temperature: 26,
    weather: "rain",
    dx: 15
}, {
    id: "충남",
    temperature: 22,
    weather: "sunny"
}, {
    id: "전북",
    temperature: 26,
    weather: "murky"
}, {
    id: "전남",
    temperature: 25,
    weather: "cloudy",
    dx: -20
}, {
    id: "경북",
    temperature: 25,
    weather: "sunny"
}, {
    id: "경남",
    temperature: 26,
    weather: "cloudy"
}, {
    id: "제주",
    temperature: 24,
    weather: "murky",
    dx: -30,
    dy: -30
}, {
    id: "울릉",
    temperature: 25,
    weather: "murky",
    dx: -40,
    dy: -20
}];

const padding = 0
const axis = [{
        map : {
            path : "../../lib/jui/img/map/korea-500x650.svg",
            width : 500,
            height : 650
        },
        data : data
    }]
const brush = [{
        type : "map.weather",
        format : function(id) {
            if(id == "서울") {
                return "서울/경기";
            } else if(id == "인천") {
                return "서해5도";
            }
        }
    }]
const style = {
        mapPathBackgroundColor : "white",
        mapPathBorderColor : "#a9a9a9"
    }

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :icon="icon" :padding="padding" :axis="axis" :brush="brush" :style="style" />
</template>
