<script setup lang="ts">
// @ts-nocheck
// Native Vue3 port of gallery/gps (legacy jQuery-free, pure jui.chart demo, still at
// gallery/gps/index.html on `main`). Ported 1:1 in behavior: a full-screen "GPS radar" dashboard -
// a world-map radar sweep (map.flightroute brush + a custom "radar" widget's rotating sweep +
// map.minimap widget), a compass gauge (custom "compass" widget), real-time wind/TPS/flight-status
// mini-charts, and a continuously-rotating 3D F16 model (canvas.model3d) - using <Chart>
// (jui-chart-vue) instead of the legacy jui.chart stack.
//
// The two custom widgets ("radar"/"compass") are demo-specific low-level SVG code (not part of
// jui-chart-vue's own shared registry, per explicit decision - see gps/radarWidget.ts's own header
// comment) - registered locally, right here, the same way jui-chart-vue's own register/widget/*.ts
// files register the built-in ones, just living in this repo instead.
import { ref, onMounted, onBeforeUnmount } from "vue"
import { Chart } from "jui-chart-vue"
import { colorUtil } from "jui-graph-ts"
import "./gps/radarWidget"
import "./gps/compassWidget"
import { stopRadarSweep } from "./gps/radarWidget"
import {
    getRadarDomain,
    getCompassData,
    getWindData,
    getTPSData,
    getKNOTDataForFlight,
    getFTDataForFlight,
    setRadarClip
} from "./gps/util"

const base = import.meta.env.BASE_URL
const mapPath = `${base}lib/jui/img/map/world-1040x660.svg`
const img = (name: string) => `${base}gallery/gps/resources/image/${name}`

const radarStyle = {
    backgroundColor: "transparent",
    gridAxisBorderColor: "rgba(255, 255, 255, 0.4)",
    gridBorderColor: "rgba(255, 255, 255, 0.4)",
    gridBorderWidth: 1,
    gridCFontColor: "transparent",
    mapPathBackgroundColor: "#fff",
    mapPathBackgroundOpacity: 0.15,
    mapPathBorderColor: "#eee",
    mapPathBorderWidth: 0.1,
    mapControlButtonColor: "#ffcb2b",
    mapMinimapPathBackgroundColor: "#fff",
    mapMinimapPathBackgroundOpacity: 0.5,
    mapMinimapDragBackgroundColor: "white",
    mapMinimapDragBorderColor: "transparent",
    mapMinimapBorderWidth: 0.5,
    mapMinimapPathBorderWidth: 0.1
}
const normalStyle = {
    backgroundColor: "transparent",
    titleFontColor: "#fff",
    titleFontSize: 11,
    gridTickBorderSize: 0,
    gridXFontColor: "#dcdcdc",
    gridXFontSize: 10,
    gridYFontColor: "#dcdcdc",
    gridYFontSize: 10,
    gridXAxisBorderWidth: 1,
    gridYAxisBorderWidth: 1,
    gridBorderWidth: 0.5,
    legendFontSize: 10,
    legendFontColor: "#fff"
}

// --- Radar (world map + rotating sweep) --------------------------------------------------------
const radarAxis = [
    { map: { path: mapPath, width: 1040, height: 660, scale: 4, viewX: -700, viewY: 100 }, data: [{ id: "KR", airport: "small" }] },
    { c: { type: "radar", shape: "circle", domain: getRadarDomain(), line: true } }
]
const radarBrush = [{ type: "map.flightroute", colors: colorUtil.map.jet(2) }]
const radarWidget = [
    { type: "radar", render: true },
    { type: "map.minimap", scale: 0.2, align: "end", orient: "top", dx: -65, dy: 38 }
]
// A plain `function` (NOT an arrow function) - jui-graph-ts's own `Core.emit()` invokes event
// callbacks via `callback.apply(this, args)` with `this` bound to the Builder itself (matching
// the legacy demo's own `event: { render: function() { setRadarClip(this) } }` exactly) - an arrow
// function would ignore that binding and read the wrong (lexical, `undefined` here) `this`.
function onRadarRender(this: any) {
    setRadarClip(this)
}

// --- Compass ------------------------------------------------------------------------------------
const compassData = getCompassData()

// --- Wind ---------------------------------------------------------------------------------------
const windAxis = [{
    x: { type: "range", domain: [0, 25], step: 5, key: "second" },
    y: { type: "range", domain: [0, 20], step: 2, line: "solid" },
    data: getWindData()
}]
const windBrush = { type: "line", target: "speed", colors: ["#fff"] }
const windWidget = [
    { type: "title", text: "REAL-TIME WIND SPEED", align: "start", dx: -30, dy: 0 },
    { type: "title", text: "DYNAMIC (100ms)", align: "center", dy: 30 },
    { type: "title", text: "SECONDS", align: "center", orient: "bottom", dy: 10 }
]

// --- TPS (today's departures) ---------------------------------------------------------------
function getTimeToIndexSplit() {
    return new Date().getHours() * 6
}
const tpsAxis = [{
    x: {
        type: "dateblock",
        domain: [new Date("2016/01/01"), new Date("2016/01/02")],
        interval: 1000 * 60 * 60,
        format: (_d: unknown, i: number) => (i % 2 ? "" : i)
    },
    y: { type: "range", domain: [0, 100], step: 2, format: (d: number) => `${d}%` },
    data: getTPSData()
}]
const tpsBrush = [
    { type: "splitarea", target: ["tps"], colors: ["#fff"], split: getTimeToIndexSplit() },
    { type: "pin", format: (d: Date) => `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`, split: getTimeToIndexSplit() }
]
const tpsWidget = [{ type: "title", text: "TODAY'S DEPARTURE", align: "start", dx: -30, dy: 0 }]

// --- 3D flight model (continuously rotating) ---------------------------------------------------
const flightModelAxis = {
    x: { type: "range", domain: [-5, 18], hide: true },
    y: { type: "range", domain: [-2, 3], hide: true },
    z: { type: "range", domain: [-7, 7], hide: true },
    degree: { x: 0, y: 0, z: 0 },
    depth: 240,
    perspective: 0.8
}
const flightModelBrush = [{ type: "canvas.model3d", model: "f16", colors: ["#fff"] }]
const flightModelWidget = [{ type: "title", text: "AIRCRAFT INFORMATION", align: "start", dx: 10 }]

const flightModelRef = ref()
let f16Y = 0
let f16Timer: ReturnType<typeof setInterval> | null = null

// --- Flight status (speed / altitude) ----------------------------------------------------------
const flightStatusAxis = [
    {
        x: { type: "dateblock", domain: [new Date(Date.now() - 5 * 60 * 1000), new Date()], interval: 1000 * 60, format: "hh:mm" },
        y: { type: "range", domain: [0, 25000], step: 2 },
        padding: { top: 40, bottom: 30, left: 40, right: 40 },
        data: getKNOTDataForFlight()
    },
    { extend: 0, x: { hide: true }, y: { domain: [0, 500], orient: "right" }, data: getFTDataForFlight() }
]
const flightStatusBrush = [
    { type: "line", target: ["KNOT"], colors: ["#fff"], axis: 0 },
    { type: "line", target: ["FT"], colors: ["#ff484c"], axis: 1 }
]
const flightStatusWidget = [
    { type: "title", text: "GS(KNOT) / ALTITUDE(FT)", align: "start", dx: 10, dy: -10 },
    { type: "legend", orient: "top", align: "end", brush: [0, 1] }
]

// --- Clock (real-time, replaces the legacy's own moment().format("LL") + setInterval) ----------
const dateText = ref("")
const timeText = ref("")
const dateFormatter = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" })
let clockTimer: ReturnType<typeof setInterval> | null = null
function renderClock() {
    const d = new Date()
    dateText.value = dateFormatter.format(d)
    timeText.value = [d.getHours(), d.getMinutes(), d.getSeconds()].map((n) => String(n).padStart(2, "0")).join(":")
}

onMounted(() => {
    renderClock()
    clockTimer = setInterval(renderClock, 200)

    f16Timer = setInterval(() => {
        f16Y += 10
        if (f16Y > 360) f16Y = 0
        const builder = flightModelRef.value?.getBuilder?.()
        if (!builder) return
        builder.axis(0).set("degree", { y: f16Y })
    }, 200)
})
onBeforeUnmount(() => {
    if (clockTimer) clearInterval(clockTimer)
    if (f16Timer) clearInterval(f16Timer)
    stopRadarSweep()
})
</script>

<template>
    <div class="gps">
        <div class="background"></div>

        <div class="left-1 layer">
            <div class="city">Paju <img :src="img('icon-weather.svg')" class="weather" /></div>
            <div class="location">Kyeongki-Do, South Korea</div>
            <div class="temp">20<sup>&#8451;</sup></div>
        </div>
        <div class="left-2 layer card">
            <div class="sunrise"><img :src="img('icon-sunrise.svg')" /> <span>06:19</span></div>
            <div class="sunset"><img :src="img('icon-sunset.svg')" /> <span>17:23</span></div>
            <div class="drop"><img :src="img('icon-drop.svg')" /> <span>56%</span></div>
        </div>
        <div class="left-3 layer card">
            <Chart :width="300" :height="273" :padding="0" :widget="compassData" :style="radarStyle" />
        </div>
        <div class="left-4 layer card">
            <Chart :width="300" :height="201" :padding="{ top: 60, bottom: 40, left: 40, right: 20 }" :axis="windAxis" :brush="windBrush" :widget="windWidget" :style="normalStyle" />
        </div>

        <div class="title">
            <div class="date">{{ dateText }}</div>
            <div class="time">{{ timeText }}</div>
        </div>
        <Chart
            width="100%"
            :height="830"
            :padding="{ top: 180, bottom: 60, left: 0, right: 0 }"
            :axis="radarAxis"
            :brush="radarBrush"
            :widget="radarWidget"
            :style="radarStyle"
            :render="false"
            :event="{ render: onRadarRender }"
        />

        <div class="right-1 layer card"></div>
        <div class="right-2 layer card">
            <Chart :width="300" :height="138" :padding="{ top: 40, bottom: 20, left: 40, right: 20 }" :axis="tpsAxis" :brush="tpsBrush" :widget="tpsWidget" :style="normalStyle" />
        </div>
        <div class="right-3 layer card">
            <Chart ref="flightModelRef" :width="300" :height="190" :padding="{ top: 50, left: 0, right: 0, bottom: 10 }" :axis="flightModelAxis" :brush="flightModelBrush" :widget="flightModelWidget" :style="normalStyle" canvas />
            <div id="flight_name">CX105</div>
            <Chart :width="300" :height="160" :padding="0" :axis="flightStatusAxis" :brush="flightStatusBrush" :widget="flightStatusWidget" :style="normalStyle" />

            <div class="info">
                <div><span class="type">SPEED</span> <span class="value">486Km/h</span></div>
                <div class="line"></div>
                <div><span class="type">ALTITUDE(FT)</span> <span class="value">11582 ft</span></div>
                <div class="line"></div>
                <div><span class="type">DESTINATION</span> <span class="value">Honolulu</span></div>
            </div>
        </div>

        <div class="copyright">&copy; Carlos A. Aviles on flickr</div>
    </div>
</template>

<style scoped>
/* 1:1 port of gallery/gps/index.css - the demo's own absolute-positioned "dashboard card" layout. */
.gps {
    position: relative;
    /* The legacy demo's own height came from the OLD gallery iframe embed's fixed height
       (package.json's "height": "835px") - this component isn't in an iframe anymore, but every
       child here is position:absolute against this root, so it still needs an explicit height. */
    height: 835px;
    background-color: black;
    text-align: center;
    color: #fff;
    overflow: hidden;
}
.background {
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0) 40%),
        linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0) 40%),
        v-bind("`url(${img('bg.jpg')})`");
    background-repeat: no-repeat;
    background-size: cover;
    opacity: 0.5;
    z-index: 1;
}
#radar {
    margin-top: -60px;
    z-index: 3;
    position: relative;
}
.title {
    position: absolute;
    inset: 0;
    z-index: 2;
    color: #fff;
    padding-top: 60px;
}
.title .date {
    font-size: 16px;
    opacity: 0.5;
}
.title .time {
    font-size: 60px;
    font-weight: 100;
    margin-top: -10px;
}
.copyright {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 20px;
    z-index: 2;
    color: #888;
    font-size: 12px;
}
.card {
    background: rgba(255, 255, 255, 0.05);
}
.layer {
    position: absolute;
    width: 300px;
    z-index: 2;
    text-align: left;
    color: #fff;
}
.left-1 {
    left: 20px;
    top: 60px;
    height: 254px;
    padding-left: 20px;
}
.left-1 .city {
    font-size: 32px;
    font-weight: 100;
}
.left-1 .weather {
    width: 24px;
    height: 24px;
    margin-top: 5px;
}
.left-1 .location {
    font-size: 14px;
    opacity: 0.5;
    margin-top: 5px;
}
.left-1 .temp {
    font-size: 60px;
    font-weight: 100;
    margin-top: 30px;
}
.left-1 .temp sup {
    font-size: 36px;
}
.left-2 {
    position: relative;
    left: 20px;
    top: 270px;
    height: 57px;
}
.left-2 > div {
    position: absolute;
    top: 18px;
}
.left-2 > div img {
    width: 23px;
    height: 23px;
    margin-bottom: -5px;
}
.left-2 > div span {
    font-size: 14px;
    margin-top: -10px;
}
.left-2 .sunrise {
    left: 20px;
}
.left-2 .sunset {
    left: 122px;
}
.left-2 .drop {
    left: 226px;
}
.left-3 {
    left: 20px;
    top: 334px;
    height: 273px;
}
.left-4 {
    left: 20px;
    top: 614px;
    height: 201px;
}
.right-1 {
    right: 20px;
    height: 168px;
    top: 20px;
}
.right-2 {
    right: 20px;
    height: 138px;
    top: 195px;
}
.right-3 {
    right: 20px;
    height: 474px;
    top: 341px;
}
#flight_name {
    position: absolute;
    font-size: 24px;
    left: 10px;
    top: 25px;
}
.right-3 .info {
    padding-left: 20px;
    padding-right: 20px;
}
.right-3 .info > div {
    margin: 7px 0;
}
.right-3 .info > div.line {
    height: 1px;
    background: #fff;
    opacity: 0.2;
}
.right-3 .info > div .type {
    font-size: 12px;
}
.right-3 .info > div .value {
    float: right;
    font-size: 14px;
    font-weight: bold;
}
</style>
