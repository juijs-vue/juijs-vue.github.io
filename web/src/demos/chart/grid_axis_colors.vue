<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

// NOTE: 원본 레거시 파일에 이 데모 전용 `var data = [...]` 선언이 아예 빠져 있었다(다른 데모인
// mixed2_multi_axis.js와 완전히 동일한 axis 구성/데이터셋을 그대로 재사용하는 데모인데, 그 데이터
// 배열 선언만 복사하는 걸 빠뜨린 것으로 보인다 - 플레이그라운드에서 페이지를 새로고침하지 않고
// mixed2_multi_axis 데모를 먼저 본 뒤 이 데모로 전환하면 그때 남은 전역 `data`를 우연히 재사용해서
// "동작하는 것처럼" 보였을 뿐, 이 데모를 직접/새로고침 후 열면 원본도 `ReferenceError`가 났을
// 것이다). 이번 변환에서 원본 버그를 그대로 옮기는 대신 같은 데이터셋을 여기 직접 선언해서 이
// 데모가 단독으로도 정상 동작하게 고쳤다.
var data = [
    { month : "Jan", rainfall : 49.9, sealevel : 1016, temperature : 7.0},
    { month : "Feb", rainfall : 71.5, sealevel : 1016, temperature : 6.9 },
    { month : "Mar", rainfall : 106.49, sealevel : 1015.9, temperature : 9.5 },
    { month : "Apr", rainfall : 129.2, sealevel : 1015.5, temperature : 14.5 },
    { month : "May", rainfall : 144.0, sealevel : 1012.3, temperature : 18.2 },
    { month : "Jun", rainfall : 176.0, sealevel : 1009.5, temperature : 21.5 },
    { month : "Jul", rainfall : 135.6, sealevel : 1009.6, temperature : 25.2 },
    { month : "Aug", rainfall : 148.5, sealevel : 1010.2, temperature : 26.5 },
    { month :  "Sep", rainfall : 216.4, sealevel : 1013.1, temperature : 23.3 },
    { month :  "Oct", rainfall : 194.1, sealevel : 1016.9, temperature : 18.3 },
    { month :  "Nov", rainfall : 95.6, sealevel : 1018.2, temperature : 13.9},
    { month :  "Dec", rainfall : 54.4, sealevel : 1016.7, temperature : 9.6}
];

const padding = {
        right : 120
    }
const axis = [{
        x : {
            domain : "month",
            line : true
        },
        y : {
            type : "range",
            domain: [ 0, 300 ],
            step : 6,
            color : "#7cb5ec",
            format : function(value) {
                return value + " mm";
            }
        },
        data : data
    }, {
        x : {
            hide : true
        },
        y : {
            domain : [ 1008, 1020 ],
            dist : 50,
            color : "#434348",
            format : function(value) {
                return value + " mb";
            },
            orient : "right"
        },
        extend : 0
    }, {
        y : {
            domain: [ 5, 35 ],
            dist : 0,
            color: "#90ed7d",
            format: function (value) {
                return value + " ℃";
            }
        },
        extend : 1
    }]

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :padding="padding" :axis="axis" />
</template>
