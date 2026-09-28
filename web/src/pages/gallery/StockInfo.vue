<script setup lang="ts">
// @ts-nocheck
// Native Vue3 port of gallery/stockinfo (legacy jQuery + jui.chart/jui.grid demo, still at
// gallery/stockinfo/index.html on `main`). Nasdaq 100 daily data (1985/11/01-2012/06/29, 6724
// rows) across 3 cross-filtering charts (Yearly Performance bubble chart -> click a year to filter
// the other 3; Summary Information: pie/donut/bar/column; Monthly Index Abs Move & Volume: 2 area
// series + a zoomscroll drag-to-zoom widget) plus a Daily Stock Table (DataGrid).
//
// `gallery/stockinfo/data.js` (1.2MB, ~6700 literal rows) is NOT ported into this component -
// per GALLERY_MIGRATION.md's own pre-existing plan, it stays exactly where it is and is loaded at
// runtime via a plain injected <script> tag (matching the legacy demo's own loading method - the
// file is real JS syntax, `var data = [...]`, not JSON). Since that load is genuinely
// asynchronous here (unlike the legacy's synchronous <script> ordering), every chart/the table
// only mounts once the data has finished loading and been processed (v-if="dataReady") - avoids
// needing any placeholder axis config that would need correcting again once data arrives.
import { nextTick, onMounted, reactive, ref } from "vue"
import { Chart, timeUtil } from "jui-chart-vue"
import {
    type StockRow,
    getDailyTableData,
    getDayOfWeekData,
    getFluctuationData,
    getLossAndGainData,
    getPerformanceData,
    getQuarterData,
    getYearIndexes
} from "./stockinfo/util"

const base = import.meta.env.BASE_URL
const dataReady = ref(false)
let stockData: StockRow[] = []

function loadLegacyDataScript(): Promise<{ date: string; open: number; close: number; volume: number }[]> {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script")
        script.src = `${base}gallery/stockinfo/data.js`
        script.onload = () => {
            const raw = (window as unknown as { data: { date: string; open: number; close: number; volume: number }[] }).data
            resolve(raw)
        }
        script.onerror = () => reject(new Error("Failed to load gallery/stockinfo/data.js"))
        document.body.appendChild(script)
    })
}

// --- Yearly Performance: bubble chart, click a bubble to filter the other 3 panels -------------
const performanceRef = ref<InstanceType<typeof Chart> | null>(null)
const performanceAxis = [
    { x: { type: "range", domain: [-2000, 2000], unit: 500, line: "solid", key: "absGain" }, y: { type: "range", domain: [-150, 150], unit: 50, format: (v: number) => `${v}%`, line: "solid" } }
]
const performanceBrush = [
    {
        type: "bubble",
        min: 15,
        max: 50,
        target: "percentageGain",
        scaleKey: "fluctuationPercentage",
        showText: true,
        activeEvent: "click",
        format: (d: Record<string, unknown>) => d.year,
        colors: (d: Record<string, number>) => {
            const gain = d.absGain
            if (gain < -1000) return "#AF0E12"
            if (gain < -500) return "#E68B8D"
            if (gain < -250) return "#F2B3AA"
            if (gain < 0) return "#E3EADF"
            if (gain < 250) return "#9AB9C8"
            if (gain < 500) return "#C3DBB3"
            return "#60AC2D"
        }
    }
]
const performanceWidget = [
    { type: "title", text: "Index Gain (%)", align: "start", orient: "center", dx: -75 },
    { type: "title", text: "Index Gain", orient: "bottom", dy: 12 }
]
const performanceStyle = { titleFontSize: 11, titleFontWeight: "bold", gridActiveFontColor: "#333", gridActiveBorderColor: "#ebebeb" }

const tooltip = reactive({ visible: false, x: 0, y: 0, year: "", fluctuation: 0, fluctuationPercentage: 0, count: 0 })
function onBubbleMouseover(obj: { data: Record<string, number> }, e: MouseEvent) {
    tooltip.year = String(obj.data.year)
    tooltip.fluctuation = Math.ceil(obj.data.fluctuation)
    tooltip.fluctuationPercentage = Math.ceil(obj.data.fluctuationPercentage)
    tooltip.count = Math.ceil(obj.data.count)
    tooltip.x = e.pageX - 115
    tooltip.y = e.pageY - 110
    tooltip.visible = true
}
function onBubbleMouseout() {
    tooltip.visible = false
}
function onBubbleClick(obj: { data: { year: number } }) {
    const { start, end } = getYearIndexes(stockData, obj.data.year)
    if (start == null) return
    updateSummaryChart(start, end)
    updateVolumeChart(start, end)
    updateDailyTable(start, end)
}
const performanceEvent = { click: onBubbleClick, mouseover: onBubbleMouseover, mouseout: onBubbleMouseout }

// --- Summary Information: 4-axis pie/donut/bar/column ------------------------------------------
const summaryRef = ref<InstanceType<typeof Chart> | null>(null)
const summaryAxis = [
    { area: { width: "20%" } },
    { area: { width: "20%", x: "18%" } },
    {
        area: { width: "20%", x: "40%" },
        x: { type: "range", domain: (d: Record<string, number>) => d.value * 1.2, step: 1, reverse: true, line: "solid" },
        y: { type: "block", domain: "dayStr", orient: "right", line: "solid" }
    },
    {
        area: { width: "32%", x: "68%" },
        x: { type: "range", domain: [-25, 25], key: "percent", step: 10, format: (v: number) => `${v}%` },
        y: { type: "range", domain: [0, 2500], step: 5, orient: "right", line: "solid" }
    }
]
const summaryBrush = [
    { type: "pie", showText: "inside", format: (k: string, v: number) => `${k === "loss" ? "Loss" : "Gain"} (${v}%)`, axis: 0 },
    { type: "donut", showText: "inside", format: (k: string) => `Q${k}`, axis: 1 },
    { type: "bar", target: ["value"], display: "max", axis: 2 },
    { type: "column", size: 5, target: ["count"], display: "max", axis: 3 }
]
const summaryWidget = [
    { type: "title", text: "Days by Gain/Loss", orient: "bottom", dy: 50, axis: 0 },
    { type: "title", text: "Quarters", orient: "bottom", dy: 50, axis: 1 },
    { type: "title", text: "Day of Week", orient: "bottom", dy: 50, axis: 2 },
    { type: "title", text: "Days by Fluctuation", orient: "bottom", dy: 50, axis: 3 },
    { type: "tooltip", orient: "right", brush: [0, 1, 2], format: (v: Record<string, unknown>, k: string) => v[k] },
    { type: "cross", xFormat: (d: number) => `${Math.ceil(d)}%`, yFormat: (d: number) => Math.ceil(d), axis: 3 }
]
const summaryStyle = { titleFontSize: 11, titleFontWeight: "bold", gridTickBorderSize: 0, gridActiveFontColor: "#333" }

// --- Monthly Index Abs Move & Volume: 2 area series + zoomscroll drag-to-zoom -------------------
const volumeRef = ref<InstanceType<typeof Chart> | null>(null)
let volumeAxis: Record<string, unknown>[] = []
const volumeBrush = [
    { type: "area", line: "solid", target: ["avg"], colors: [2], axis: 0 },
    { type: "area", line: "solid", target: ["total"], axis: 1 }
]
const volumeWidget = [{ type: "zoomscroll", key: "total", dy: 30, format: (d: Date) => timeUtil.format(d, "yyyy"), axis: 1 }]
const volumeStyle = { areaBackgroundOpacity: 0.75 }
function onZoomScrollDragEnd(start: number, end: number) {
    updatePerformanceChart(start, end)
    updateSummaryChart(start, end)
    updateVolumeChart(start, end)
    updateDailyTable(start, end)
}
const volumeEvent = { "zoomscroll.dragend": onZoomScrollDragEnd }

// --- Daily Stock Table ---------------------------------------------------------------------------
const tableColumns = [
    { key: "date", label: "Date" },
    { key: "open", label: "Open", align: "right" as const },
    { key: "close", label: "Close", align: "right" as const },
    { key: "change", label: "Change", align: "right" as const },
    { key: "volume", label: "Volume", align: "right" as const }
]
const tableRows = ref<{ id: number; data: Record<string, unknown> }[]>([])

// --- Update functions (mirror legacy's own update*Chart/Table functions exactly) ----------------
function updatePerformanceChart(start?: number, end?: number) {
    const s = start ?? 0
    const e = end ?? stockData.length - 1
    const builder = performanceRef.value?.getBuilder?.()
    if (!builder) return
    builder.axis(0).update(getPerformanceData(stockData, s, e))
    builder.render()
}
function updateSummaryChart(start?: number, end?: number) {
    const s = start ?? 0
    const e = end ?? stockData.length - 1
    const builder = summaryRef.value?.getBuilder?.()
    if (!builder) return
    builder.axis(0).update(getLossAndGainData(stockData, s, e))
    builder.axis(1).update(getQuarterData(stockData, s, e))
    builder.axis(2).update(getDayOfWeekData(stockData, s, e))
    builder.axis(3).update(getFluctuationData(stockData, s, e))
    builder.render()
}
function updateVolumeChart(start?: number, end?: number) {
    const builder = volumeRef.value?.getBuilder?.()
    if (!builder) return
    if (start !== undefined && end !== undefined) {
        const domain = { domain: [stockData[start].date, stockData[end].date] }
        builder.axis(0).set("x", domain)
        builder.axis(1).set("x", domain)
        builder.render()
    } else {
        builder.axis(0).update(stockData)
        builder.axis(1).update(stockData)
        builder.render(true)
    }
}
function updateDailyTable(start?: number, end?: number) {
    const s = start ?? 0
    const e = end ?? stockData.length - 1
    tableRows.value = getDailyTableData(stockData, s, e).map((d, i) => ({ id: i, data: d }))
}

onMounted(async () => {
    const raw = await loadLegacyDataScript()

    stockData = raw.map((d) => {
        const date = new Date(d.date)
        const total = (d.open + d.close) / 2
        const month = date.getMonth()
        const quarter = month <= 2 ? 1 : month <= 5 ? 2 : month <= 8 ? 3 : 4

        return { date, open: +d.open, close: +d.close, volume: d.volume, total, avg: total / 2, quarter, day: date.getDay() }
    })

    volumeAxis = [
        {
            x: { type: "date", domain: [stockData[0].date, stockData[stockData.length - 1].date], interval: timeUtil.DAY * 365, format: "yyyy", key: "date", line: "solid" },
            y: { type: "range", domain: [0, 3000], step: 4, line: false, color: 2 },
            data: stockData
        },
        {
            extend: 0,
            x: { hide: true },
            y: { type: "range", domain: [0, 7000], step: 7, line: false, orient: "right", color: 0 },
            data: stockData
        }
    ]

    dataReady.value = true
    // `v-if="dataReady"` gates the whole dashboard (mounted only once data is ready - see this
    // component's own header comment) - Vue batches the resulting DOM update, so `performanceRef`/
    // `summaryRef`/`volumeRef` are still null immediately after the line above; without this,
    // every call below silently no-ops (`getBuilder?.()` -> undefined -> early `return`), which is
    // exactly what happened before this fix: 3 of the 4 panels rendered as empty/flat shapes.
    await nextTick()

    updatePerformanceChart()
    updateSummaryChart()
    updateVolumeChart()
    updateDailyTable()
})
</script>

<template>
    <div v-if="dataReady">
        <div class="row">
            <div class="panel">
                <div class="head"><strong>Yearly Performance</strong></div>
                <div class="body">
                    <Chart ref="performanceRef" width="100%" :height="250" :padding="{ left: 65, right: 50, top: 25, bottom: 40 }" :axis="performanceAxis" :brush="performanceBrush" :widget="performanceWidget" :style="performanceStyle" :event="performanceEvent" :render="false" />
                </div>
            </div>
        </div>

        <div class="row">
            <div class="panel">
                <div class="head"><strong>Summary Information</strong></div>
                <div class="body">
                    <Chart ref="summaryRef" width="100%" :height="250" :padding="{ left: 0 }" :axis="summaryAxis" :brush="summaryBrush" :widget="summaryWidget" :style="summaryStyle" :render="false" />
                </div>
            </div>
        </div>

        <div class="row">
            <div class="panel">
                <div class="head"><strong>Monthly Index Abs Move &amp; Volume Chart</strong></div>
                <div class="body">
                    <Chart ref="volumeRef" width="100%" :height="300" :padding="{ top: 25, bottom: 90 }" :axis="volumeAxis" :brush="volumeBrush" :widget="volumeWidget" :style="volumeStyle" :event="volumeEvent" :render="false" />
                </div>
            </div>
        </div>

        <div class="row">
            <div class="panel">
                <div class="head"><strong>Daily Stock Table</strong></div>
                <DataGrid :columns="tableColumns" sortable resizable :scroll-height="400" :rows="tableRows" />
            </div>
        </div>

        <Teleport to="body">
            <div class="popover top stockinfo-tooltip" v-show="tooltip.visible" :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }">
                <div class="head">{{ tooltip.year }}</div>
                <div class="body">
                    <div class="message">
                        <div class="row">
                            <div class="col col-6"><strong>Fluctuation</strong></div>
                            <div class="col col-6 value">{{ tooltip.fluctuation }}</div>
                        </div>
                        <div class="row">
                            <div class="col col-6"><strong>Fluctuation (%)</strong></div>
                            <div class="col col-6 value">{{ tooltip.fluctuationPercentage }}</div>
                        </div>
                        <div class="row">
                            <div class="col col-6"><strong>Count</strong></div>
                            <div class="col col-6 value">{{ tooltip.count }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<style scoped>
.stockinfo-tooltip {
    position: absolute;
    z-index: 10001;
    width: 220px;
    pointer-events: none;
}
</style>
