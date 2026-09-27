<script setup lang="ts">
// @ts-nocheck
// Native Vue3 port of gallery/admintool (legacy jQuery + jui.chart/jui.grid demo, still at
// gallery/admintool/index.html on `main`). Ported 1:1 in behavior: a dashboard with 4 summary
// cards, a marketing report combo chart, a visitor-status section (bar/gauge/line/bargauge
// mini-charts), a "Recent Order List" table, and a Theme selector (Jennifer/Dark) that restyles
// the WHOLE page - using <Chart> (jui-chart-vue) and <DataGrid> (jui-grid-vue, which already
// ships real classic/dark/jennifer CSS scoped under a `theme-<name>` class - see its own
// `theme` prop) instead of the legacy jQuery+jui stack.
//
// Theme scoping: jui-chart-vue's <Chart theme="..."> and jui-grid-vue's <DataGrid theme="...">
// both already support real per-instance theme switching (no page-wide CSS swap needed for
// either). This page's OWN chrome (cards/menu/header colors, ported from index-dark.css/
// index-jennifer.css) is restyled the same way <DataGrid> is - a `theme-<name>` class on this
// component's own root, matched by this component's own scoped <style> - never touching any
// global stylesheet, so switching themes here can't bleed into the site's own header/nav (unlike
// naively injecting a real, unscoped `.jui .foo{}` stylesheet would).
//
// jui-chart-vue has no "jennifer" theme at all (confirmed: only classic/dark/gradient/pastel are
// registered - same gap FacebookGroup's own conversion hit). None of this demo's 8 charts pass an
// explicit `theme` config in the original either (they only ever get themed via the LEGACY
// engine's runtime `setTheme()` call from the dropdown) - so here, "Jennifer" maps to jui-chart-
// vue's own default (no theme override, i.e. classic) for the CHARTS specifically, while the
// surrounding page chrome and the DataGrid still use a REAL jennifer theme. "Dark" is real for
// every layer (charts included - jui-chart-vue's dark theme IS registered).
import { ref, computed } from "vue"
import { Chart } from "jui-chart-vue"

const base = import.meta.env.BASE_URL
// The legacy demo hotlinks a 2015-era external blog image for the page's noise-texture
// background - substituted with the identical asset already vendored locally (res/img/
// light-noise.png, already used elsewhere on this site) rather than depending on a possibly-dead
// third-party URL.
const bgImage = `url(${base}res/img/light-noise.png)`

const theme = ref<"jennifer" | "dark">("jennifer")
const chartTheme = computed(() => (theme.value === "dark" ? "dark" : "classic"))
const gridTheme = computed(() => theme.value)

// --- Traffic (marketing report) combo chart -------------------------------------------------
const trafficData1 = [
    { date: "Apr", value1: 36, value2: 42 },
    { date: "May", value1: 30, value2: 24 },
    { date: "Jun", value1: 20, value2: 28 },
    { date: "Jul", value1: 41, value2: 36 },
    { date: "Aug", value1: 26, value2: 34 },
    { date: "Sept", value1: 21, value2: 28 }
]
const trafficData2 = [
    { mr: "MR 1", value1: 4470, value2: 3650 },
    { mr: "MR 2", value1: 6300, value2: 4000 },
    { mr: "MR 3", value1: 4590, value2: 5150 },
    { mr: "MR 4", value1: 4500, value2: 5150 },
    { mr: "MR 5", value1: 5550, value2: 3800 },
    { mr: "MR 6", value1: 6500, value2: 6100 },
    { mr: "MR 7", value1: 4775, value2: 6800 },
    { mr: "MR 8", value1: 4950, value2: 4000 },
    { mr: "MR 9", value1: 4400, value2: 4030 },
    { mr: "MR 10", value1: 4100, value2: 3100 },
    { mr: "MR 11", value1: 4800, value2: 2090 },
    { mr: "MR 12", value1: 5100, value2: 4100 }
]
const trafficAxis = [
    { x: { domain: "date", color: 0 }, y: { type: "range", domain: [0, 100], step: 5, color: 0 }, data: trafficData1 },
    {
        x: { domain: "mr", color: 1, orient: "top" },
        y: { type: "range", domain: [0, 8000], step: 5, color: 1, orient: "right", format: (d: unknown) => (typeof d === "number" ? `${d / 1000}K` : d) },
        data: trafficData2
    }
]
const trafficBrush = [
    { type: "column", target: ["value1", "value2"], colors: [0, 1], innerPadding: -20, outerPadding: 20 },
    { type: "line", target: ["value1", "value2"], axis: 1, colors: [1, 2], symbol: "curve" },
    { type: "scatter", target: ["value1", "value2"], axis: 1, colors: [1, 2] }
]
const trafficWidget = [
    { type: "title", text: "Marketing Report", dy: -10 },
    { type: "title", text: "Number of New Clients Acquired", align: "start", orient: "center", dx: -115, dy: -10 },
    { type: "title", text: "Marketing Dollars Spent", align: "end", orient: "center", dx: 115, dy: -10 },
    { type: "tooltip", format: (_k: string, v: unknown) => v, brush: [0, 2] }
]
const trafficStyle = { backgroundColor: "transparent", gridAxisBorderWidth: 2, titleFontSize: "11px", titleFontWeight: "bold" }

// --- Visitor status: bar (visit_chart) + gauge (donut) --------------------------------------
const visitData = [
    50, 50, 20, 10, 30, 44, 22, 21, 36, 56, 30, 32, 25, 25, 50, 25, 10, 25, 30, 30, 15, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 25, 25, 25, 25
].map((sales, i) => ({ quarter: String(i), sales }))
const visitAxis = {
    x: { type: "block", domain: "quarter", line: true, hide: true },
    y: { type: "range", domain: "sales", step: 10, line: true, hide: true },
    data: visitData
}
const visitBrush = { type: "column", target: "sales", active: 5, colors: [0] }
const visitStyle = { backgroundColor: "transparent", barBorderRadius: 0 }

const gaugeData = [
    { title: "Overall Visits", value: 192, max: 200, min: 0 },
    { title: "New Visits", value: 66, max: 100, min: 0 },
    { title: "Mobile Visits", value: 75, max: 100, min: 0 }
]
const gaugeAxis = { c: { type: "table", rows: 1, columns: 3 }, data: gaugeData }
const gaugeBrush = {
    type: "fullgauge",
    size: 10,
    titleY: 70,
    format: (value: number, index: number) => (index === 0 ? `${value}k` : `${value}%`)
}
const gaugeStyle = { backgroundColor: "transparent", fontFamily: "Open Sans" }

// --- Mini sparklines (apple/microsoft/oracle stock samples) ----------------------------------
const STOCKS = {
    apple: [50, 80.23, 81.23, 91.03, 90.77, 82.98, 79.35, 78.5, 79.34, 81.46, 73.7, 62.02, 55.03, 51.93, 55, 51.81, 52.29, 53.05, 45.61, 47.26, 47.57, 47.35, 47.99, 46.1, 43.83, 42.28, 40.89, 38.55, 33.03, 34.95, 34.18, 34.9, 35.47, 31.93, 27.8, 26.1].slice().reverse(),
    microsoft: [25.39, 25.31, 26.91, 28.06, 29.06, 27.61, 28.66, 27.34, 29.8, 30.02, 29.54, 27.3, 24, 23.65, 24.44, 22.84, 24.41, 24.99, 23.71, 22.81, 23.48, 23, 24.08, 24.97, 25.14, 22.75, 23.87, 21.92, 21.01, 22.98, 20.49, 22.97, 27.07, 25.96, 25.41, 24.86].slice().reverse(),
    oracle: [32.78, 31.48, 30.4, 30.71, 30.9, 29.48, 28.93, 25.79, 28.64, 28.35, 28.44, 27.43, 24.88, 30.41, 31.79, 27.82, 27.18, 29.61, 31.81, 33.07, 34.75, 32.25, 31.74, 30.9, 30.15, 26.05, 28.3, 25.81, 21, 22.73, 20.59, 21.65, 24.82, 24.62, 23.6, 22.08].slice().reverse()
}
const sparkStart = new Date("2010/01/01")
const sparkData = STOCKS.apple.map((_, i) => {
    const d = new Date(sparkStart)
    d.setMonth(d.getMonth() + i)
    return { date: d, apple: STOCKS.apple[i], microsoft: STOCKS.microsoft[i], oracle: STOCKS.oracle[i] }
})
const sparkEnd = new Date("2012/12/31")
function sparkAxis(key: string) {
    return {
        x: { type: "date", domain: [sparkStart, sparkEnd], interval: 1000 * 60 * 24 * 365, format: "yyyy", key: "date", hide: true },
        y: { type: "range", domain: key, step: 10, line: true, hide: true },
        data: sparkData
    }
}
function sparkBrush(key: string) {
    return { type: "line", target: [key] }
}
const sparkStyle = { backgroundColor: "transparent" }

// --- Bar gauges (browser share / mobile overview) ---------------------------------------------
const browserAxis = { data: [
    { title: "Chrome", value: 54.1 },
    { title: "Firefox", value: 26.6 },
    { title: "Safari", value: 10.2 },
    { title: "Internet Explorer", value: 5.7 },
    { title: "Opera", value: 3 }
] }
const mobileAxis = { data: [
    { title: "Desktop", value: 89 },
    { title: "Mobile", value: 6 },
    { title: "Tablet", value: 5 }
] }
const barGaugeBrush = { type: "bargauge", size: 25, format: (value: number) => `${value}%` }
const barGaugeStyle = { backgroundColor: "transparent" }

// --- Recent Order List (static sample rows, matches the legacy demo exactly) -------------------
const orderColumns = [
    { key: "from", label: "From" },
    { key: "contact", label: "Contact" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
    { key: "action", label: "" }
]
const ORDER_DOT_COLORS = ["red", "#fff860", "#fb32ff", "#68ff41", "#5d9cff"]
const orderRows = ORDER_DOT_COLORS.map((color, i) => ({
    id: i,
    data: { from: "Lion KC", contact: "Robin Van Persie", amount: "$245.00", status: "Paid", color }
}))
</script>

<template>
    <div class="admintool" :class="`theme-${theme}`">
        <div class="header">
            <div class="logo"><i class="icon-menu"></i></div>
            <div class="toolbar">
                <span>Theme</span>
                <span>
                    <select v-model="theme">
                        <option value="jennifer">Jennifer</option>
                        <option value="dark">Dark</option>
                    </select>
                </span>
                <span style="float: right">Sample <i class="icon-check"></i></span>
            </div>
        </div>

        <div class="container">
            <div class="menu">
                <div class="vmenu">
                    <a class="active"><i class="icon-monitoring"></i> Dashboard</a>
                    <a><i class="icon-realtime"></i> Realtime</a>
                    <a><i class="icon-profile"></i> Analysis</a>
                    <a><i class="icon-chart"></i> Statistics</a>
                    <a><i class="icon-document"></i> Document</a>
                    <a><i class="icon-gear"></i> Management</a>
                    <a><i class="icon-user"></i> User</a>
                </div>
            </div>
            <div class="content">
                <div class="content-list">
                    <div class="dashboard-first">
                        <div class="col col-3">
                            <div class="card">
                                <div class="title">Today's visitors</div>
                                <div class="value">3,352</div>
                            </div>
                        </div>
                        <div class="col col-3">
                            <div class="card">
                                <div class="title">Time of operation of call</div>
                                <div class="value">2,364,806</div>
                            </div>
                        </div>
                        <div class="col col-3">
                            <div class="card">
                                <div class="title">Time of operation Number of EVENT</div>
                                <div class="value">15,610</div>
                            </div>
                        </div>
                        <div class="col col-3">
                            <div class="card">
                                <div class="title">Peak Time</div>
                                <div class="value">10:00 ~ 11:00</div>
                            </div>
                        </div>
                    </div>

                    <div class="panel">
                        <div class="body">
                            <h2 class="title">User Traffic</h2>
                            <div class="view">
                                <Chart :theme="chartTheme" :height="400" :padding="{ left: 60, right: 80, top: 50, bottom: 30 }" :axis="trafficAxis" :brush="trafficBrush" :widget="trafficWidget" :style="trafficStyle" />
                            </div>
                        </div>
                    </div>

                    <div class="panel dashed">
                        <div class="body">
                            <h2 class="title">Visitor Status</h2>

                            <div class="row view" style="height: 150px">
                                <div class="col col-7">
                                    <Chart :theme="chartTheme" :padding="0" height="100%" :axis="visitAxis" :brush="visitBrush" :style="visitStyle" />
                                </div>
                                <div class="col col-5">
                                    <Chart :theme="chartTheme" :padding="{ left: 0, top: 10, right: 0, bottom: 20 }" height="100%" :axis="gaugeAxis" :brush="gaugeBrush" :style="gaugeStyle" />
                                </div>
                            </div>

                            <div class="row view info">
                                <div class="col col-7">
                                    <div class="title"><strong>1,452,587</strong> people visited this site</div>
                                    <div class="box">
                                        <div class="row visit_total">
                                            <div class="col col-4">
                                                <div class="title">Visits</div>
                                                <div class="number"><strong>3,352</strong></div>
                                                <div class="chart"><Chart :theme="chartTheme" :padding="0" width="100%" height="100%" :axis="sparkAxis('apple')" :brush="sparkBrush('apple')" :style="sparkStyle" /></div>
                                            </div>
                                            <div class="col col-4">
                                                <div class="title">Unique Visitors</div>
                                                <div class="number"><strong>1,672</strong></div>
                                                <div class="chart"><Chart :theme="chartTheme" :padding="0" width="100%" height="100%" :axis="sparkAxis('microsoft')" :brush="sparkBrush('microsoft')" :style="sparkStyle" /></div>
                                            </div>
                                            <div class="col col-4">
                                                <div class="title">Previews</div>
                                                <div class="number"><strong>6,048</strong></div>
                                                <div class="chart"><Chart :theme="chartTheme" :padding="0" width="100%" height="100%" :axis="sparkAxis('oracle')" :brush="sparkBrush('oracle')" :style="sparkStyle" /></div>
                                            </div>
                                        </div>
                                        <div class="row visit_total">
                                            <div class="col col-4">Pages per visit : <strong>1.78</strong></div>
                                            <div class="col col-8">Average Visit Duration : <strong>00:01:12</strong></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col col-5">
                                    <div class="row bargauge">
                                        <div class="col col-6">
                                            <div class="title">Visits by Browser</div>
                                            <div class="chart"><Chart :theme="chartTheme" :padding="{ left: 20, top: 0, bottom: 0, right: 0 }" width="100%" height="100%" :axis="browserAxis" :brush="barGaugeBrush" :style="barGaugeStyle" /></div>
                                        </div>
                                        <div class="col col-6">
                                            <div class="title">Mobile Overview</div>
                                            <div class="chart"><Chart :theme="chartTheme" :padding="{ left: 20, top: 0, bottom: 0, right: 0 }" width="100%" height="100%" :axis="mobileAxis" :brush="barGaugeBrush" :style="barGaugeStyle" /></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="panel dashed">
                        <div class="body">
                            <h2 class="title">Details</h2>
                            <div class="view">
                                <div class="panel">
                                    <div class="head">Recent Order List</div>
                                    <DataGrid :theme="gridTheme" :columns="orderColumns" :rows="orderRows" variant="simple">
                                        <template #cell-from="{ row }">
                                            <i class="icon-stop" style="font-size: 8.5px" :style="{ color: row.data.color }"></i>
                                            {{ row.data.from }}
                                        </template>
                                        <template #header-action><a class="btn btn-base">All Orders</a></template>
                                        <template #cell-action><i class="icon-search"></i> View</template>
                                    </DataGrid>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.admintool {
    background-color: #a5a5a5;
    background-image: v-bind(bgImage);
    background-repeat: repeat;
    font-family: "Open Sans", sans-serif;
    font-size: 14px;
    margin: -20px;
    padding: 20px;
}
.header {
    margin: 0 auto;
    height: 58px;
    background: #2d363e;
    color: white;
}
.header .logo {
    position: relative;
    float: left;
    width: 98px;
    height: 45px;
    font-size: 25px;
    text-align: center;
    padding-top: 13px;
}
.header .toolbar {
    position: relative;
    padding: 20px;
    padding-left: 120px;
}
.container {
    margin: 0 auto;
    position: relative;
}
.container::after {
    display: table;
    clear: both;
    content: "";
}
.vmenu {
    text-align: center;
}
.vmenu > a {
    display: block;
    text-align: center;
    padding: 20px 0;
    color: #2d363e;
    text-decoration: none;
}
.vmenu > a > i {
    display: block;
    font-size: 24px;
}
.container > .menu {
    position: relative;
    float: left;
    width: 98px;
}
.container > .content {
    padding: 0 0 0 98px;
}
.dashboard-first {
    overflow: auto;
}
.dashboard-first .col {
    text-align: center;
    float: left;
    width: 25%;
    box-sizing: border-box;
}
.card {
    height: 98px;
    position: relative;
    text-align: left;
    padding: 10px 10px 10px 30px;
    box-sizing: border-box;
}
.card .title {
    font-size: 12px;
}
.card .value {
    font-size: 28px;
    font-weight: bold;
    color: #6836c4;
    margin-top: 8px;
}
.panel {
    padding: 0 !important;
    margin: 0 !important;
    display: block !important;
}
.panel > .body {
    padding: 10px;
}
.panel > .body > .title {
    margin-left: 36px;
    margin-top: 48px;
}
.panel > .body .view {
    padding: 20px;
}
.view.info {
    margin-top: 10px;
    border-top: 1px dashed #dedede;
}
.view.info .title {
    font-weight: bold;
    margin-top: 10px;
    margin-bottom: 10px;
}
.view.info .title > strong {
    font-size: 25px;
    color: #255bff;
}
.view.info .box {
    border: 1px solid #b5defd;
    padding: 20px 20px 20px 40px;
}
.visit_total {
    font-size: 15px;
}
.visit_total .title {
    font-size: 15px;
    margin-bottom: 4px;
}
.visit_total .number {
    font-size: 20px;
}
.visit_total .chart {
    margin-top: 5px;
    height: 50px;
    width: 100px;
}
.bargauge {
    font-size: 15px;
}
.bargauge .title {
    padding: 16px;
}
.bargauge .chart {
    height: 150px;
    width: 80%;
}
.row::after {
    content: "";
    display: table;
    clear: both;
}
.col-3,
.col-4,
.col-5,
.col-6,
.col-7,
.col-8 {
    float: left;
    box-sizing: border-box;
    padding: 0 10px;
}
.col-4 {
    width: 33.33%;
}
.col-5 {
    width: 41.66%;
}
.col-6 {
    width: 50%;
}
.col-7 {
    width: 58.33%;
}
.col-8 {
    width: 66.66%;
}

/* Theme-scoped page chrome - ported from index-jennifer.css/index-dark.css. Scoped by this
   component's OWN root class (never a global stylesheet), so switching themes here can't affect
   anything outside this page - unlike a real, unscoped `.jui .foo{}` stylesheet injection would. */
.theme-jennifer .container > .content {
    background: #f3f3f3;
}
.theme-jennifer .content-list {
    border: 1px solid #e5e5e5;
}
.theme-jennifer .dashboard-first {
    border-bottom: 1px solid #ebebeb;
}
.theme-jennifer .card {
    border-right: 1px solid #ebebeb;
    background: linear-gradient(to bottom, #fff 0, #f7f7f7 100%);
}
.theme-jennifer .card .title {
    color: #333;
}
.theme-jennifer .dashed {
    border-top: 1px dashed #e5e5e5;
}

.theme-dark {
    color: #d5d5d5;
}
.theme-dark .container > .content {
    background: #1a1a1a;
}
.theme-dark .content-list {
    border: 1px solid #404040;
}
.theme-dark .dashboard-first {
    border-bottom: 1px solid #404040;
}
.theme-dark .card {
    border-right: 1px solid #404040;
    background: linear-gradient(to bottom, #232323 0, #1c1c1c 100%);
}
.theme-dark .card .title {
    color: #a9a9a9;
}
.theme-dark .dashed {
    border-top: 1px dashed #404040;
}
.theme-dark .view.info {
    border-top-color: #404040;
}
.theme-dark .head {
    background: #2d363e;
    padding: 8px 12px;
}
</style>
