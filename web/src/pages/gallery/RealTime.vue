<script setup lang="ts">
// @ts-nocheck
// Native Vue3 port of gallery/realtime (legacy jQuery + jui.chart demo, still at
// gallery/realtime/index.html on `main`). A 4-panel realtime monitoring dashboard: a 5-axis
// "dashboard_top" chart (active service equalizercolumn + response time/TPS lines + today's
// TPS/concurrent-users split areas), a 3-axis "dashboard_bottom" CANVAS-mode chart (hourly call
// count/visitor bars + a canvas.scatter "transaction view" with drag-select), a world-map bubble
// chart, and a 3-cell fullgauge "visitor type" chart - each populated/re-rendered on its own
// setInterval loop, exactly like the legacy `data.js`. `render: false` on every <Chart> here
// matches the legacy `render: false` builder option: nothing draws until each chart's own first
// interval tick calls `.render()` (a faithful, if literal, side effect: all 4 panels are blank for
// the first 1-3s after mount, same as the original).
//
// The legacy demo's "transaction view" panel supports drag-select (rubber-band a time range,
// see onDragSelectEnd below) via `chart.widget.canvas.dragselect` - now ported into jui-chart-vue
// itself (`register/widget/canvas/dragselect.ts`, that repo) as a real canvas-mode widget: a
// canvas-mode chart stacks its <canvas> elements ON TOP of the SVG layer, so the plain SVG
// "dragselect" widget's rubber-band rect would have rendered invisibly underneath it - the ported
// variant draws directly into the widget-only "sub" canvas layer instead (paints above everything,
// brush content included, and is cleared/redrawn on its own without touching the brushes' own
// "buffer" canvas). Event wiring/data-search logic is identical to the SVG version.
import { onBeforeUnmount, onMounted, ref } from "vue"
import { Chart } from "jui-chart-vue"
import { timeUtil } from "jui-graph-ts"
import {
    createTxDataStore,
    getDataForActiveService,
    getDataForHours,
    getDataForResponseTime,
    getDataForToday,
    getDataForTPS,
    getDataForVisitor,
    getDataForWorldMap,
    getTimeToIndex,
    pastTimeInterval
} from "./realtime/util"

const base = import.meta.env.BASE_URL
const mapPath = `${base}lib/jui/img/map/world-1040x660.svg`

const dashboardStyle = {
    colors: ["#38c3ff", "#00ceae", "#ff474c", "#ffb500", "#e8e8e8", "#1bbe64", "#98dc08", "#cf0073", "#cf0073", "#576f83"],
    backgroundColor: "#051220",
    axisBorderColor: "#1c2b3b",
    axisBorderWidth: 1,
    axisBorderRadius: 5,
    gridXFontColor: "#7b8b9c",
    gridYFontColor: "#7b8b9c",
    gridXAxisBorderColor: "#7b8b9c",
    gridYAxisBorderColor: "#7b8b9c",
    gridBorderColor: "#1c2b3b",
    titleFontSize: 11,
    titleFontColor: "#fff",
    tooltipPointFontColor: "#fff",
    tooltipPointFontWeight: "normal",
    mapPathBackgroundColor: "#1c2b3b",
    mapPathBorderColor: "#051220",
    mapSelectorHoverColor: "#253a50",
    mapSelectorActiveColor: "#768998",
    mapBubbleBackgroundOpacity: 0.1,
    mapBubbleBorderWidth: 2,
    mapBubbleFontColor: "#fff",
    mapControlButtonColor: "#00a78d",
    gaugeBackgroundColor: "#1c2b3b",
    gaugeFontSize: 36,
    gaugeFontWeight: "normal",
    gaugeTitleFontSize: 10,
    gaugeTitleFontColor: null,
    focusBackgroundColor: "#ffb500",
    focusBorderColor: "#ffb500",
    pinBorderColor: "#ffb500",
    pinFontColor: "#ffb500"
}
// `_.extend({axisBorderWidth:0}, dashboardStyle, true)` (legacy) - jui's own 3-arg `extend()` with
// `skip:true` only fills in keys the FIRST object doesn't already have, so `axisBorderWidth:0`
// (the map chart wants no axis border) wins over `dashboardStyle`'s own `axisBorderWidth:1`, and
// every other key still comes from `dashboardStyle`.
const mapStyle = { ...dashboardStyle, axisBorderWidth: 0 }

// --- dashboard_top: active service / response time / TPS / today's TPS + concurrent users -------
const topAxis = [
    {
        x: { type: "block", domain: "server", line: true },
        y: { type: "range", domain: [0, 40], step: 2, line: true },
        padding: { left: 50, top: 35, right: 20, bottom: 20 },
        area: { height: "32%" }
    },
    {
        extend: 0,
        x: { type: "dateblock", domain: pastTimeInterval(5), interval: 1, realtime: "minutes", format: "hh:mm", line: false },
        y: { type: "range", domain: [0, 10000], step: 2 },
        area: { y: "34%", width: "49%" }
    },
    {
        extend: 1,
        y: { type: "range", domain: [0, 100], step: 2, format: (d: number) => `${d}%` },
        area: { x: "50%", width: "50%" }
    },
    {
        extend: 2,
        x: {
            type: "dateblock",
            domain: [new Date("2016/01/01"), new Date("2016/01/02")],
            interval: timeUtil.HOUR,
            format: (d: number, i: number) => (i % 2 ? "" : d),
            realtime: false
        },
        y: { type: "range", domain: [0, 100], step: 2 },
        area: { x: "0%", y: "68%", width: "49%" }
    },
    {
        extend: 3,
        y: { domain: (d: Record<string, number>) => d.user * 1.3, format: null },
        area: { x: "50%", width: "50%" }
    }
]
const topBrush = [
    { type: "equalizercolumn", target: ["normal", "warning", "fatal"], innerPadding: 1, outerPadding: 20, unit: 20, colors: [0, 1, 4], axis: 0 },
    { type: "line", target: ["w1", "w2", "w3", "w4", "w5"], axis: 1 },
    { type: "line", target: ["w1", "w2", "w3", "w4", "w5"], axis: 2 },
    { type: "splitarea", target: ["tps"], axis: 3 },
    { type: "pin", axis: 3, format: (d: Date) => timeUtil.format(d, "HH:mm") },
    { type: "splitarea", target: ["user"], axis: 4 },
    { type: "pin", axis: 4, format: (d: Date) => timeUtil.format(d, "HH:mm") }
]
const topWidget = [
    { type: "title", text: "ACTIVE SERVICE", dx: -10, dy: -7, axis: 0, align: "start" },
    { type: "title", text: "RESPONSE TIME", dx: -10, dy: -7, axis: 1, align: "start" },
    { type: "title", text: "TPS", dx: -10, dy: -7, axis: 2, align: "start" },
    { type: "title", text: "TODAY'S TPS", dx: -10, dy: -7, axis: 3, align: "start" },
    { type: "title", text: "TODAY'S CONCURRENT USERS", dx: -10, dy: -7, axis: 4, align: "start" },
    { type: "tooltip", brush: [1, 2] },
    { type: "cross", xFormat: (d: Date) => timeUtil.format(d, "hh:mm"), yFormat: (d: number) => Math.ceil(d), axis: 1 },
    { type: "cross", xFormat: (d: Date) => timeUtil.format(d, "hh:mm"), yFormat: (d: number) => Math.ceil(d), axis: 2 }
]

// --- dashboard_bottom: hourly call count / visitor + transaction view (canvas) ------------------
const bottomAxis = [
    {
        x: { type: "block", domain: "hours", format: (d: number) => ([3, 9, 15, 21].includes(d) ? d : "") },
        y: { type: "range", domain: (d: Record<string, number>) => d.callcount * 1.3, format: (d: number) => `${Math.ceil(d / 1000)}K`, step: 2 },
        padding: { left: 50, top: 35, right: 20, bottom: 20 },
        area: { width: "49%", height: "48%", x: "0%" }
    },
    { extend: 0, y: { domain: (d: Record<string, number>) => d.visitor * 1.3 }, area: { y: "51%" } },
    {
        extend: 1,
        x: { type: "date", domain: pastTimeInterval(10), interval: 2, realtime: "minutes", format: "hh:mm", key: "time" },
        y: { type: "range", domain: [0, 10000], step: 4, format: null },
        buffer: 100000,
        area: { x: "50%", y: "0%", width: "50%", height: "99%" }
    }
]
const bottomBrush = [
    { type: "column", target: ["callcount"], display: "max", colors: (d: Record<string, boolean>) => (d.today ? 0 : "#1c2b3b"), axis: 0 },
    { type: "focus", start: 0, end: 0, axis: 0 },
    { type: "column", target: ["visitor"], display: "max", colors: (d: Record<string, boolean>) => (d.today ? 0 : "#1c2b3b"), axis: 1 },
    { type: "focus", start: 0, end: 0, axis: 1 },
    {
        type: "canvas.scatter",
        symbol: "cross",
        target: ["delay"],
        size: 5,
        colors: (d: Record<string, string>) => {
            if (d.level === "fatal") return 2
            if (d.level === "warning") return 3
            return 0
        },
        axis: 2
    }
]
const bottomWidget = [
    { type: "title", text: "HOURLY CALL COUNT", dx: -10, dy: -7, axis: 0, align: "start" },
    { type: "title", text: "HOURLY VISITOR", dx: -10, dy: -7, axis: 1, align: "start" },
    { type: "title", text: "TRANSACTION VIEW", dx: -10, dy: -7, axis: 2, align: "start" },
    { type: "canvas.dragselect", brush: [4] },
    { type: "cross", xFormat: (d: unknown) => d, axis: 0 },
    { type: "cross", xFormat: (d: unknown) => d, axis: 1 }
]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onDragSelectEnd(data: any[]) {
    alert(data.length)
    console.log(data)
}

// --- visitor_map: world-map bubble chart ---------------------------------------------------------
const mapAxis = [{ map: { path: mapPath, width: 1040, height: 630, scale: 1.5 } }]
const mapBrush = [
    {
        type: "map.bubble",
        min: 5,
        max: 50,
        showText: true,
        colors: (d: Record<string, number>) => {
            if (d.value > 5000) return 2
            if (d.value > 3000) return 1
            return 0
        }
    },
    { type: "map.selector", activeEvent: "map.click", active: ["RU"] }
]
const mapWidget = [{ type: "map.control", align: "start", orient: "top", dx: 10, dy: 60 }]

// --- visitor_type: 3-cell fullgauge ---------------------------------------------------------------
const statusAxis = [{ padding: { top: 35, bottom: 25 }, c: { type: "table", rows: 1, columns: 3, padding: 10 }, data: getDataForVisitor() }]
const statusBrush = [
    {
        type: "fullgauge",
        size: 7,
        titleY: 86,
        colors: [0, 1, 4],
        format: (value: number, index: number) => (index === 0 ? `${Math.round(value / 1000)}K` : `${value}%`)
    }
]
const statusWidget = [{ type: "title", text: "VISITOR TYPE", dx: 8, dy: -2, align: "start" }]

// --- Realtime update loops (mirrors legacy data.js's 3 setInterval calls exactly) ----------------
const topRef = ref<InstanceType<typeof Chart> | null>(null)
const bottomRef = ref<InstanceType<typeof Chart> | null>(null)
const mapRef = ref<InstanceType<typeof Chart> | null>(null)
const statusRef = ref<InstanceType<typeof Chart> | null>(null)

const txStore = createTxDataStore()
let topTimer: ReturnType<typeof setInterval> | null = null
let bottomTimer: ReturnType<typeof setInterval> | null = null
let sideTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
    topTimer = setInterval(() => {
        const builder = topRef.value?.getBuilder?.()
        if (!builder) return
        const domain = pastTimeInterval(5)

        builder.axis(0).update(getDataForActiveService())

        const responseTimeData = builder.axis(1).data
        builder.axis(1).set("x", { domain })
        if (responseTimeData.length === 0) {
            builder.axis(1).update(getDataForResponseTime(300))
        } else if (responseTimeData.length === 300) {
            responseTimeData.shift()
            responseTimeData.push(getDataForResponseTime(1)[0])
            builder.axis(1).update(responseTimeData)
        }

        const tpsData = builder.axis(2).data
        builder.axis(2).set("x", { domain })
        if (tpsData.length === 0) {
            builder.axis(2).update(getDataForTPS(300))
        } else if (tpsData.length === 300) {
            tpsData.shift()
            tpsData.push(getDataForTPS(1)[0])
            builder.axis(2).update(tpsData)
        }

        const todaysTpsData = builder.axis(3).data
        const todaysUserData = builder.axis(4).data
        const splitIndex = getTimeToIndex()

        if (todaysTpsData.length === 0) {
            builder.axis(3).update(getDataForToday(1440))
            builder.axis(4).update(getDataForToday(1440))
        } else if (todaysTpsData.length === 1440) {
            if (domain[1].getSeconds() === 0) {
                const data = getDataForToday(1)[0]
                todaysTpsData.shift()
                todaysTpsData.push(data)
                todaysUserData.shift()
                todaysUserData.push(data)
                builder.axis(3).update(todaysTpsData)
                builder.axis(4).update(todaysUserData)
            }
        }

        builder.updateBrush(3, { split: splitIndex })
        builder.updateBrush(4, { split: splitIndex })
        builder.updateBrush(5, { split: splitIndex })
        builder.updateBrush(6, { split: splitIndex })

        builder.render()
    }, 1000)

    bottomTimer = setInterval(() => {
        const builder = bottomRef.value?.getBuilder?.()
        if (!builder) return
        const domain = pastTimeInterval(10)

        if (builder.axis(0).data.length === 0 || domain[1].getMinutes() === 0) {
            const hoursData = getDataForHours()
            const focusIndex = { start: domain[1].getHours(), end: domain[1].getHours() }
            builder.updateBrush(1, focusIndex)
            builder.updateBrush(3, focusIndex)
            builder.axis(0).update(hoursData)
            builder.axis(1).update(hoursData)
        }

        if (txStore.data.length === 0) {
            txStore.init(domain)
        } else {
            txStore.add(domain)
        }
        builder.axis(2).update(txStore.data)
        builder.axis(2).set("x", { domain })

        builder.render()
    }, 2000)

    sideTimer = setInterval(() => {
        const mapBuilder = mapRef.value?.getBuilder?.()
        if (mapBuilder) {
            mapBuilder.axis(0).update(getDataForWorldMap())
            mapBuilder.render()
        }

        const statusBuilder = statusRef.value?.getBuilder?.()
        if (statusBuilder) {
            statusBuilder.axis(0).update(getDataForVisitor())
            statusBuilder.render()
        }
    }, 3000)
})
onBeforeUnmount(() => {
    if (topTimer) clearInterval(topTimer)
    if (bottomTimer) clearInterval(bottomTimer)
    if (sideTimer) clearInterval(sideTimer)
})
</script>

<template>
    <div class="realtime">
        <div class="header">
            REALTIME MONITORING DASHBOARD
            <i class="icon-menu"></i>
        </div>

        <div class="row">
            <div class="col left" style="width: 49%">
                <div class="left-inner">
                    <div class="dashboard-top">
                        <Chart ref="topRef" width="100%" :height="540" :padding="5" :axis="topAxis" :brush="topBrush" :widget="topWidget" :style="dashboardStyle" :render="false" />
                    </div>
                    <div class="dashboard-bottom">
                        <Chart
                            ref="bottomRef"
                            width="100%"
                            :height="360"
                            :padding="5"
                            canvas
                            :axis="bottomAxis"
                            :brush="bottomBrush"
                            :widget="bottomWidget"
                            :style="dashboardStyle"
                            :event="{ 'dragselect.end': onDragSelectEnd }"
                            :render="false"
                        />
                    </div>
                </div>
            </div>
            <div class="col right" style="width: 50%">
                <div class="card">
                    <strong>VISITOR LOCATION MAP</strong>
                    <div class="head"></div>
                    <div class="map-chart">
                        <Chart ref="mapRef" width="100%" :height="640" :padding="0" :axis="mapAxis" :brush="mapBrush" :widget="mapWidget" :style="mapStyle" :render="false" />
                    </div>
                </div>

                <div class="status-chart">
                    <Chart ref="statusRef" width="100%" :height="213" :padding="0" :axis="statusAxis" :brush="statusBrush" :widget="statusWidget" :style="dashboardStyle" :render="false" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.realtime {
    margin: -20px;
    padding: 0;
    background: #051220;
    font-family: arial, Tahoma, verdana, jennifer;
}
.header {
    height: 38px;
    background: #00a78d;
    color: #fff;
    font-size: 14px;
    font-weight: bold;
    padding-top: 22px;
    padding-left: 20px;
}
.header > i {
    float: right;
    font-size: 20px;
    margin-right: 18px;
    cursor: pointer;
}
.left-inner {
    height: 900px;
    padding: 20px;
}
.dashboard-top {
    width: 100%;
    height: 60%;
}
.dashboard-bottom {
    width: 100%;
    height: 40%;
}
.col.right {
    padding: 25px 20px 20px 0;
}
.card {
    position: relative;
    border: 1px solid #1c2b3b;
    border-radius: 5px;
    height: 650px;
}
.card > * {
    position: absolute;
}
.card > .head {
    width: 100%;
    height: 40px;
    background: #fff;
    opacity: 0.15;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    z-index: 1;
}
.card > .map-chart {
    top: 3px;
    height: 99%;
    width: 100%;
}
.card > strong {
    font-size: 11px;
    font-weight: bold;
    z-index: 2;
    color: #fff;
    top: 13px;
    left: 13px;
}
.status-chart {
    margin-top: 20px;
}
</style>
