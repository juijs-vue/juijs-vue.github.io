<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

var dataSource = [
    { date : "J", profit1 : 48000, profit2 : 110 },
    { date : "F", profit1 : 31000, profit2 : 58 },
    { date : "M", profit1 : 62000, profit2 : 104 },
    { date : "A", profit1 : 40500, profit2 : 357 },
    { date : "M", profit1 : 44550, profit2 : 294 },
    { date : "J", profit1 : 29500, profit2 : 367 },
    { date : "J", profit1 : 46000, profit2 : 285 },
    { date : "A", profit1 : 70050, profit2 : 340 },
    { date : "S", profit1 : 39500, profit2 : 397 },
    { date : "O", profit1 : 45800, profit2 : 425 },
    { date : "N", profit1 : 29000, profit2 : 254 },
    { date : "D", profit1 : 15000, profit2 : 187 }
];

var dataSource2 = [
    { unit1 : 16, unit2 : 21, unit3 : 15, unit4 : 18, unit5 : 20 }
]

// 레거시 Builder는 top-level `format`을 axis.y.format이 따로 없을 때의 기본 포맷터로 썼다.
// jui-chart-vue의 <Chart>는 top-level `format` 옵션 자체를 forward하지 않으므로(Chart.vue의
// defineProps에 없음), 대신 이 값이 필요한 각 axis의 y에 직접 넣어서 동일한 동작을 재현한다.
function defaultFormat(v) {
    if(typeof(v) == "number") {
        return ((v > 1000) ? Math.floor(v / 1000) + "k" : v);
    }

    return v;
}

var dataSource3 = [
    { date: "Jan", sales1: 31000, sales2: 11500, sales3: 21500 },
    { date: "Feb", sales1: 39500, sales2: 36750, sales3: 29550 },
    { date: "Mar", sales1: 24300, sales2: 7000, sales3: 14500 },
    { date: "Apr", sales1: 36000, sales2: 44500, sales3: 16500 },
    { date: "May", sales1: 38000, sales2: 11500, sales3: 28450 },
    { date: "Jun", sales1: 45500, sales2: 28450, sales3: 35600 },
    { date: "Jul", sales1: 28500, sales2: 42900, sales3: 21550 },
    { date: "Aug", sales1: 38000, sales2: 26750, sales3: 18750 },
    { date: "Sep", sales1: 21000, sales2: 13050, sales3: 11600 },
    { date: "Oct", sales1: 17000, sales2: 32600, sales3: 7500 },
    { date: "Nov", sales1: 24000, sales2: 12500, sales3: 14750 },
    { date: "Dec", sales1: 17500, sales2: 14300, sales3: 16000 }
];

const padding = {
        left : 60
    }
const height = 400
const axis = [{
        data : dataSource,
        x : {
            type : "block",
            domain : "date"
        },
        y : {
            type : "range",
            domain : [ 0, 100000 ],
            step : 4,
            line : true,
            format : defaultFormat
        },
        area : {
            width : "65%",
            height : "40%"
        }
    }, {
        x : {
            hide : true
        },
        y : {
            domain : [ 0, 500 ],
            orient : "right",
            format : defaultFormat
        },
        area : {
            width : "65%",
            height : "40%"
        },
        extend : 0
    }, {
        data : dataSource2,
        area : {
            x : "70%",
            width : "40%",
            height : "40%"
        }
    }, {
        data : dataSource3,
        y : {
            domain : [ 0, 50000 ],
            format : defaultFormat
        },
        area : {
            width : "100%",
            height : "40%",
            y : "60%"
        },
        extend : 0
    }]
const brush = [{
        type : "column",
        target : "profit1",
        axis : 0,
        colors : [ 0 ],
        animate : true
    }, {
        type : "line",
        target : "profit2",
        axis : 1,
        colors : [ 2 ],
        animate : true
    }, {
        type : "scatter",
        target : "profit2",
        size : 10,
        axis : 1,
        colors : [ 2 ]
    }, {
        type : "pie",
        showText : true,
        format : function(k, v) {
            return v;
        },
        axis : 2
    }, {
        type : "column",
        target : [ "sales1", "sales2", "sales3" ],
        outerPadding : 10,
        innerPadding : 3,
        axis : 3,
        animate : true
    }]
const widget = [{
        type : "title",
        text : "Sales Overview",
        align : "start"
    }, {
        type : "title",
        text : "Net Profit",
        align : "start",
        orient : "center",
        dx : -55,
        dy : -90
    }, {
        type : "title",
        text : "Sales by Employee",
        align : "start",
        orient : "center",
        dx : -80,
        dy : 90
    }, {
        type : "tooltip",
        format : function(k, v) {
            return v;
        },
        brush : [ 0, 2, 3, 4 ]
    }]
const style = {
        scatterBorderWidth : 1.5,
        titleFontSize : "11px",
        titleFontWeight : "bold"
    }

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :padding="padding" :height="height" :axis="axis" :brush="brush" :widget="widget" :style="style" />
</template>
