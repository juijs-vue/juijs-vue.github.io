<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

var data = [
    { quarter : "1Q", samsung : 50, lg : 35, sony: 10 },
    { quarter : "2Q", samsung : 20, lg : 30, sony: 5 },
    { quarter : "3Q", samsung : 20, lg : 5, sony: 10 },
    { quarter : "4Q", samsung : 30, lg : 25, sony: 15 }
];

// NOTE(엔진 한계, 기록용): 레거시 top-level `series`(target별 color/text 별칭, 특히 legend 위젯의
// 표시 텍스트) 옵션은 jui-chart-vue뿐 아니라 jui-graph-ts의 Builder 자체에 대응 기능이 없다(포팅
// 안 됨 - jui-graph-ts/src 어디에도 Builder가 top-level `series` 옵션을 읽는 코드가 없음). 색상은
// 브러시가 target 순서대로 테마 색상을 자동 배정하므로 원본과 동일하게 나오지만(0,1,2번 색상 =
// 원래 series에 지정했던 색상과 일치), legend 텍스트는 "Samsung/LG/SONY" 대신 원시 키
// "samsung/lg/sony"로 표시된다 - 이 저장소(www.jui-vue.io) 쪽에서 고칠 수 있는 부분이 아니다.

const axis = {
        x : {
            type : "range",
            domain : function(data) {
                return data.samsung + data.lg + data.sony;
            },
            step : 10,
            line : true
        },
        y : {
            type : "block",
            domain : "quarter",
            line : true
        },
        data : data
    }
const brush = {
        type : "stackbar",
        target : [ "samsung", "lg", "sony" ]
    }
const widget = [
        { type : "title", text : "Bar Sample" },
        { type : "legend", filter : true }
    ]

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :axis="axis" :brush="brush" :widget="widget" />
</template>
