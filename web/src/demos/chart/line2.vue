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
    },
    format(date, fmt, utc) {
        const MMMM = ["\x00", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        const MMM = ["\x01", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const dddd = ["\x02", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        const ddd = ["\x03", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

        function ii(i, len) {
            let s = i + ""
            len = len || 2
            while (s.length < len) s = "0" + s
            return s
        }

        let result = fmt
        const y = utc ? date.getUTCFullYear() : date.getFullYear()
        result = result.replace(/(^|[^\\])yyyy+/g, "$1" + y)
        result = result.replace(/(^|[^\\])yy/g, "$1" + y.toString().substr(2, 2))
        result = result.replace(/(^|[^\\])y/g, "$1" + y)

        const M = (utc ? date.getUTCMonth() : date.getMonth()) + 1
        result = result.replace(/(^|[^\\])MMMM+/g, "$1" + MMMM[0])
        result = result.replace(/(^|[^\\])MMM/g, "$1" + MMM[0])
        result = result.replace(/(^|[^\\])MM/g, "$1" + ii(M))
        result = result.replace(/(^|[^\\])M/g, "$1" + M)

        const d = utc ? date.getUTCDate() : date.getDate()
        result = result.replace(/(^|[^\\])dddd+/g, "$1" + dddd[0])
        result = result.replace(/(^|[^\\])ddd/g, "$1" + ddd[0])
        result = result.replace(/(^|[^\\])dd/g, "$1" + ii(d))
        result = result.replace(/(^|[^\\])d/g, "$1" + d)

        const H = utc ? date.getUTCHours() : date.getHours()
        result = result.replace(/(^|[^\\])HH+/g, "$1" + ii(H))
        result = result.replace(/(^|[^\\])H/g, "$1" + H)

        const h = H > 12 ? H - 12 : H == 0 ? 12 : H
        result = result.replace(/(^|[^\\])hh+/g, "$1" + ii(h))
        result = result.replace(/(^|[^\\])h/g, "$1" + h)

        const m = utc ? date.getUTCMinutes() : date.getMinutes()
        result = result.replace(/(^|[^\\])mm+/g, "$1" + ii(m))
        result = result.replace(/(^|[^\\])m/g, "$1" + m)

        const s = utc ? date.getUTCSeconds() : date.getSeconds()
        result = result.replace(/(^|[^\\])ss+/g, "$1" + ii(s))
        result = result.replace(/(^|[^\\])s/g, "$1" + s)

        let f = utc ? date.getUTCMilliseconds() : date.getMilliseconds()
        result = result.replace(/(^|[^\\])fff+/g, "$1" + ii(f, 3))
        f = Math.round(f / 10)
        result = result.replace(/(^|[^\\])ff/g, "$1" + ii(f))
        f = Math.round(f / 10)
        result = result.replace(/(^|[^\\])f/g, "$1" + f)

        const T = H < 12 ? "AM" : "PM"
        result = result.replace(/(^|[^\\])TT+/g, "$1" + T)
        result = result.replace(/(^|[^\\])T/g, "$1" + T.charAt(0))

        const t = T.toLowerCase()
        result = result.replace(/(^|[^\\])tt+/g, "$1" + t)
        result = result.replace(/(^|[^\\])t/g, "$1" + t.charAt(0))

        let tz = -date.getTimezoneOffset()
        let K = utc || !tz ? "Z" : tz > 0 ? "+" : "-"
        if (!utc) {
            tz = Math.abs(tz)
            const tzHrs = Math.floor(tz / 60)
            const tzMin = tz % 60
            K += ii(tzHrs) + ":" + ii(tzMin)
        }
        result = result.replace(/(^|[^\\])K/g, "$1" + K)

        const day = (utc ? date.getUTCDay() : date.getDay()) + 1
        result = result.replace(new RegExp(dddd[0], "g"), dddd[day])
        result = result.replace(new RegExp(ddd[0], "g"), ddd[day])
        result = result.replace(new RegExp(MMMM[0], "g"), MMMM[M])
        result = result.replace(new RegExp(MMM[0], "g"), MMM[M])

        result = result.replace(/\\(.)/g, "$1")

        return result
    }
}
var stocks = {
    visitor : [ 47, 41, 38, 0, 0, 0, 3, 8, 14, 1, 2, 10, 32, 48 ],
    unique : [ 12, 7, 8, 0, 0, 0, 3, 2, 4, 1, 2, 3, 9, 14 ]
};
var start = new Date("2014/09/03"); // ~2012-12-31
var end = new Date("2014/09/16");

var data = [];
for(var i = 0; i < stocks.visitor.length; i++) {
    data.push({
        date: time.add(start, time.days, i),
        visitor: stocks.visitor[i],
        unique: stocks.unique[i]
    });
}

const axis = [{
        x : {
            type : "date",
            domain : [ start, end ],
            interval : 1000 * 60 * 60 * 24, // 1days
            format : "MM-dd",
            key : "date",
            line : true
        },
        y : {
            type : "range",
            domain : "visitor",
            step : 2,
            color : "#1db34f"
        },
        data : data
    }, {
        x : {
            hide : true
        },
        y : {
            type : "range",
            domain : "unique",
            step : 4,
            color : "#1d7fb3",
            orient : "right"
        },
        extend : 0
    }]
const brush = [{
        type : "line", target : "visitor", colors : [ "#1db34f" ]
    }, {
        type : "line", target : "unique", axis : 1, colors : [ "#1d7fb3" ]
    }, {
        type : "scatter", target : "visitor", colors : [ "#1db34f" ], symbol : "circle", size: 7
    }, {
        type : "scatter", target : "unique", axis : 1, colors : [ "#1d7fb3" ], symbol : "circle", size: 7
    }]
const widget = [
        { type : "title", text : "Line Sample" },
        { type : "legend", brush : [ 0, 1 ] },
        { type : "tooltip", brush : [ 2, 3 ] }
    ]

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :axis="axis" :brush="brush" :widget="widget" />
</template>
