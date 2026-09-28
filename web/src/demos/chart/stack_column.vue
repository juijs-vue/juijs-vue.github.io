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
// 안 됨 - stack_bar.js 참고). legend 텍스트가 "Samsung/LG/SONY" 대신 원시 키로 표시되는 정도의
// 차이만 있고, 색상은 target 순서대로 자동 배정되어 원본과 동일하다.

const axis = {
        x : {
            domain : "quarter",
            line : true
        },
        y : {
            type : "range",
            domain : function(data) {
                return data.samsung + data.lg + data.sony;
            },
            line : true,
            orient : "right"
        },
        data : data
    }
const brush = {
        type : "stackcolumn",
        target : [ "samsung", "lg", "sony" ]
    }
const widget = [
        { type : "title", text : "Column Sample" },
        { type : "legend", filter : true }
    ]

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :axis="axis" :brush="brush" :widget="widget" />
</template>
