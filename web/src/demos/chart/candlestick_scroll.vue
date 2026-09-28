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
var data = [
    { date: new Date(1994,2,1), l: 24.00, h: 25.00, o: 25.00, c: 24.875 },
    { date: new Date(1994,2,2), l: 23.625, h: 25.125, o: 24.00, c: 24.875 },
    { date: new Date(1994,2,3), l: 26.25, h: 28.25, o: 26.75, c: 27.00 },
    { date: new Date(1994,2,4), l: 26.50, h: 27.875, o: 26.875, c: 27.25 },
    { date: new Date(1994,2,7), l: 26.375, h: 27.50, o: 27.375, c: 26.75 },
    { date: new Date(1994,2,8), l: 25.75, h: 26.875, o: 26.75, c: 26.00 },
    { date: new Date(1994,2,9), l: 25.75, h: 26.75, o: 26.125, c: 26.25 },
    { date: new Date(1994,2,10), l: 25.75, h: 26.375, o: 26.375, c: 25.875 },
    { date: new Date(1994,2,11), l: 24.875, h: 26.125, o: 26.00, c: 25.375 },
    { date: new Date(1994,2,14), l: 25.125, h: 26.00, o: 25.625, c: 25.75 },
    { date: new Date(1994,2,15), l: 25.875, h: 26.625, o: 26.125, c: 26.375 },
    { date: new Date(1994,2,16), l: 26.25, h: 27.375, o: 26.25, c: 27.25 },
    { date: new Date(1994,2,17), l: 26.875, h: 27.25, o: 27.125, c: 26.875 },
    { date: new Date(1994,2,18), l: 26.375, h: 27.125, o: 27.00, c: 27.125 },
    { date: new Date(1994,2,21), l: 26.75, h: 27.875, o: 26.875, c: 27.75 },
    { date: new Date(1994,2,22), l: 26.75, h: 28.375, o: 27.50, c: 27.00 },
    { date: new Date(1994,2,23), l: 26.875, h: 28.125, o: 27.00, c: 28.00 },
    { date: new Date(1994,2,24), l: 26.25, h: 27.875, o: 27.75, c: 27.625 },
    { date: new Date(1994,2,25), l: 27.50, h: 28.75, o: 27.75, c: 28.00 },
    { date: new Date(1994,2,28), l: 25.75, h: 28.25, o: 28.00, c: 27.25 },
    { date: new Date(1994,2,29), l: 26.375, h: 27.50, o: 27.50, c: 26.875 },
    { date: new Date(1994,2,30), l: 25.75, h: 27.50, o: 26.375, c: 26.25 },
    { date: new Date(1994,2,31), l: 24.75, h: 27.00, o: 26.50, c: 25.25 }
];

const axis = {
        x : {
            type : "block",  // default type is block
            domain : "date",
            format: function(d) {
                return time.format(d, "MM-dd");
            },
            line: true
        },
        y : {
            type : "range",
            domain: [ 20, 30 ],
            step: 5,
            line : true
        },
        data : data,
        buffer : 10,
        keymap : {
            low : "l",
            high : "h",
            open : "o",
            close : "c"
        }
    }
const brush = {
        type : "candlestick"
    }
const widget = [{
        type : "scroll"
    }, {
        type : "tooltip",
        orient : "bottom"
    }]
const style = {
        gridTickPadding : 10
    }

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :axis="axis" :brush="brush" :widget="widget" :style="style" />
</template>
