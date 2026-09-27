<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

// `jui.include("util.time")`(레거시 유틸)는 새 아키텍처의 샌드박스 import map에
// "vue"/"jui-chart-vue"만 있고 이 유틸은 없어 그대로 재사용할 수 없다 - jui-graph-ts의
// util/time.ts와 동일한 알고리즘을 데모 안에 그대로 인라인한다.
const time = {
    MINUTE: 60000,
    HOUR: 3600000,
    DAY: 86400000,
    years: "years",
    months: "months",
    days: "days",
    hours: "hours",
    minutes: "minutes",
    seconds: "seconds",
    milliseconds: "milliseconds",
    weeks: "weeks",
    add(date, ...args) {
        if (args.length <= 1) return date
        const d = new Date(+date)
        for (let i = 0; i < args.length; i += 2) {
            const unit = args[i]
            const amount = args[i + 1]
            if (unit === "years") d.setFullYear(d.getFullYear() + amount)
            else if (unit === "months") d.setMonth(d.getMonth() + amount)
            else if (unit === "days") d.setDate(d.getDate() + amount)
            else if (unit === "hours") d.setHours(d.getHours() + amount)
            else if (unit === "minutes") d.setMinutes(d.getMinutes() + amount)
            else if (unit === "seconds") d.setSeconds(d.getSeconds() + amount)
            else if (unit === "milliseconds") d.setMilliseconds(d.getMilliseconds() + amount)
            else if (unit === "weeks") d.setDate(d.getDate() + amount * 7)
        }
        return d
    }
}

// `getTodayData()`는 레거시 셸(play/chart/chart.js)이 모든 데모 스크립트와 전역 스코프를 공유할
// 때 제공하던 헬퍼다 - 새 아키텍처의 각 데모는 독립된 모듈이라 더 이상 공유되지 않으므로 그대로
// 인라인한다.
function getTodayData() {
    var start = new Date(2014, 10, 7),
        end = time.add(start, time.hours, 23);

    var data = [],
        value = 240;

    for(var i = 0; i < 60 * 23; i++) {
        if(value < 60 * 8) {
            value += 1;
        }

        data.push({ time: time.add(start, time.minutes, i), value: value })
    }

    return {
        start: start,
        end: end,
        data: data
    };
}

var today = getTodayData();

const axis = {
        x : {
            type : "date",
            domain : [ today.start, today.end ],
            interval : 1000 * 60 * 60, // 1hours
            format : "HH",
            key: "time"
        },
        y : {
            type : "range",
            step : 10,
            domain : function(d) {
                return 600;
            }
        },
        data : today.data,
        buffer : today.data.length
    }
const brush = [{
        type : "splitline",
        target : "value",
        split : 500
    }, {
        type : "pin",
        split : 500
    }]
const widget = [{
        type : "title",
        text : "Line Sample"
    }]

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :axis="axis" :brush="brush" :widget="widget" />
</template>
