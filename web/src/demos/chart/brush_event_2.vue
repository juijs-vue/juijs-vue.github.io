<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

var data = [
    { quarter : "1Q", sales : 50, profit : 35 },
    { quarter : "2Q", sales : 20, profit : 30 },
    { quarter : "3Q", sales : 10, profit : 5 },
    { quarter : "4Q", sales : 30, profit : 25 }
];

// `tpl`(레거시 Builder의 자체 문자열 템플릿 옵션)은 jui-chart-vue의 <Chart>가 forward하지 않는
// 옵션이라(Chart.vue의 defineProps에 없음) 그대로 재사용할 수 없다 - 대신 같은 마크업을 만드는
// 평범한 함수로 대체한다.
function renderTooltip(data) {
    return (
        '<div id="chart_tooltip" class="popover popover-top">' +
            '<div class="head">Sales & Profit Tooltip</div>' +
            '<div class="body">' +
                '<div class="image"><i class="icon-caution"></i></div>' +
                '<div class="message"><b>Quarter</b>: ' + data.quarter + '&nbsp;&nbsp;<b>Sales</b>: ' + data.sales + '&nbsp;&nbsp;<b>Profit</b>: ' + data.profit + '</div>' +
            '</div>' +
        '</div>'
    );
}

const axis = [{
        x : {
            type : "block",
            domain : "quarter",
            line : true
        },
        y : {
            type : "range",
            domain : [ 0, 100 ],
            step : 5,
            line : true
        },
        data : data
    }]
const brush = [{
        type : "line",
        target : [ "sales", "profit" ]
    }, {
        type : "scatter",
        target : [ "sales", "profit" ]
    }]
const event = {
        mouseover : function(obj, e) {
            if(obj.brush.index == 1) {
                var $tooltip = $(renderTooltip(obj.data));
                $("body").append($tooltip);

                $tooltip.css({ "z-index": 10000, left: e.pageX - $tooltip.width() / 2, top: e.pageY - $tooltip.height() });
            }
        },
        mouseout : function(obj, e) {
            if(obj.brush.index == 1) {
                $("#chart_tooltip").remove();
            }
        }
    }

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :axis="axis" :brush="brush" :event="event" />
</template>
