<script setup lang="ts">
// @ts-nocheck
import { onMounted, onUnmounted, ref } from "vue"
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

function getTPSData(count) {
    var data = [];

    for(var i = 0; i < count; i++) {
        data.push({ tps: Math.floor(Math.random() * 5) + 50 });
    }

    return data;
}

function getTimeToIndex() {
    var now = new Date();
    return now.getHours() * 60 + now.getMinutes();
}

function getMemoryData(count) {
    var data = [];

    for(var i = 0; i < count; i++) {
        data.push({ memory: (Math.floor(Math.random() * 60) == 1) ? 700 : 300 });
    }

    return data;
}

const height = 600

// `axis`/`brush`는 realtime 갱신 도중 배열 원소를 직접 mutate(shift/push, split 재대입)하므로
// <Chart>가 변경을 감지하도록 ref()로 감싼다(레거시 코드의 `this.axis[i]...`가 Vue Options API의
// 반응형 data() 프록시였던 것과 동일한 이유) - widget은 절대 변경되지 않아 plain const로 둔다.
const axis = ref([{
    x : {
        type : "dateblock",
        domain : [ new Date("2016/01/01"), new Date("2016/01/02") ],
        interval : time.HOUR, // Only milliseconds
        format : function(d, i) {
            return i;
        }
    },
    y : {
        type : "range",
        domain : [ 0, 100 ],
        step : 4
    },
    area : {
        height: "40%"
    },
    data : getTPSData(1440)
}, {
    x : {
        type : "dateblock",
        realtime : "minutes",
        interval : 1, // But number for the real-time basis
        format : "HH:mm"
    },
    y : {
        type : "range",
        domain : [ 0, 1024 ],
        step : 4,
        line : "solid"
    },
    area : {
        y : "60%",
        height : "40%"
    },
    data : getMemoryData(300)
}])
const brush = ref([{
    type : "splitarea",
    target : [ "tps" ],
    split : getTimeToIndex(),
    axis : 0
}, {
    type : "pin",
    split : getTimeToIndex(),
    axis : 0,
    format : function(d) {
        return time.format(d, "HH:mm");
    }
}, {
    type : "line",
    target : [ "memory" ],
    axis : 1
}])
const widget = [{
    type : "title",
    text : "Today's TPS",
    align : "end"
}, {
    type : "cross",
    xFormat : function(d) {
        return time.format(d, "HH:mm");
    },
    yFormat : function(d) {
        return Math.round(d);
    },
    axis : 0
}, {
    type : "cross",
    yFormat : function(d) {
        return Math.round(d);
    },
    axis : 1
}, {
    type : "title",
    text : "Memory Usage (MB)",
    align : "end",
    dy : 300
}]

function updateTPS() {
    var now = new Date();

    if(now.getSeconds() == 0) {
        var index = getTimeToIndex();

        if(axis.value[0].data.length == 1440) {
            axis.value[0].data.shift();
            axis.value[0].data.push(getTPSData(1)[0]);
        }

        brush.value[0].split = index;
        brush.value[1].split = index;
    }
}

function updateMemory() {
    if(axis.value[1].data.length == 300) {
        axis.value[1].data.shift();
        axis.value[1].data.push(getMemoryData(1)[0]);
    }

    axis.value[1].x.domain = [ new Date() - time.MINUTE * 5, new Date() ];
}

const chartRef = ref(null)
let timer = null
onMounted(() => {
    timer = setInterval(() => {
        updateTPS();
        updateMemory();
    }, 1000);
})
onUnmounted(() => {
    clearInterval(timer);
})
</script>

<template>
<Chart ref="chartRef" :height="height" :axis="axis" :brush="brush" :widget="widget" />
</template>
