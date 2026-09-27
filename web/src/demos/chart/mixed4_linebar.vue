<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

// jui-chart-vue's own default icon font path is an absolute `/lib/jui-chart-vue/...` URL baked in
// at ITS OWN build time (for the original Flask deployment) - wrong for this SPA's own
// `/jui-ui-vue/` base (real 404s otherwise). See `web/scripts/copy-legacy-static.mjs`'s matching
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

var columnData = [],
    lineData = [];

function generateChartData() {
    var firstDate = new Date();
    firstDate.setTime(firstDate.getTime() - 10 * 24 * 60 * 60 * 1000);

    for (var i = firstDate.getTime(); i < (firstDate.getTime() + 10 * 24 * 60 * 60 * 1000); i += 60 * 60 * 1000) {
        var newDate = new Date(i);

        // NOTE(원본 버그, 기록용): 원래는 `i == firstDate.getTime()`(맨 첫 반복)일 때만 랜덤
        // 시드값을 쓰고 그 외에는 항상 `lineData`의 마지막 원소를 참조했다 - 그런데 "10일 전"의
        // 시각이 정확히 12시(정오)면 첫 반복이 lineData가 아니라 columnData로 들어가서
        // lineData가 여전히 비어 있는 채로 두 번째 반복이 "else" 분기를 타 `lineData[-1].value`가
        // undefined 참조로 터진다(현재 서버 시각 기준으로 매일 정오 즈음 실제로 재현됨) - 실행
        // 시각에 좌우되던 잠재적 버그라 lineData가 비어 있을 때도 랜덤 시드값을 쓰도록 방어했다.
        if (lineData.length === 0) {
            var value1 = Math.round(Math.random() * 10) + 1;
        }
        else {
            var value1 = Math.round(lineData[lineData.length - 1].value / 100 * (90 + Math.round(Math.random() * 20)) * 100) / 100;
        }

        if (newDate.getHours() == 12) {
            // we set daily data on 12th hour only
            var value2 = Math.round(Math.random() * 12) + 1;
            columnData.push({
                date: newDate,
                value: value2
            });
        }
        else {
            lineData.push({
                date: newDate,
                value: value1
            });
        }
    }
}

generateChartData();

const axis = [{
        x : {
            type : "block",
            domain : "date",
            hide : true
        },
        y : {
            type : "range",
            domain : function(d) {
                return d.value + 10;
            },
            step : 5
        },
        data : columnData
    },
    {
        x : {
            type : "date",
            domain : [ lineData[0].date, lineData[lineData.length - 1].date ],
            interval : 1000 * 60 * 60 * 24, // 1day
            format : "MM-dd",
            textRotate : -20,
            key : "date",
            hide : false
        },
        y : {
            hide : true
        },
        data : lineData,
        extend : 0
    }]
const brush = [{
        type : "column",
        target : "value",
        axis : 0
    }, {
        type : "line",
        target : "value",
        axis : 1,
        colors : [ 2 ]
    }]

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :icon="icon" :axis="axis" :brush="brush" />
</template>
