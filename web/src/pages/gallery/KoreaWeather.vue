<script setup lang="ts">
// @ts-nocheck
// Native Vue3 port of gallery/koreaweather (legacy jQuery + jui.chart/jui.ui demo, still at
// gallery/koreaweather/index.html on `main`). Ported 1:1 in behavior from index.html: the Korea
// map with a weather "card" per province (map.weather brush), a province temperature bar chart, a
// (non-functional in the original too - "Select..." combo with no wired onchange) province combo,
// a 3-day forecast table, a temperature/precipitation detail line chart, and a realtime (1s
// interval) air-quality line chart.
//
// All of the "data" here is randomly generated on each load/tick in the ORIGINAL demo too (there's
// no real weather API involved) - kept exactly that way, not replaced with anything real.
import { ref, onMounted, onBeforeUnmount } from "vue"
import { Chart } from "jui-chart-vue"

const base = import.meta.env.BASE_URL
const mapPath = `${base}lib/jui/img/map/korea-500x650.svg`

const weatherMapData = [
    { id: "서울", temperature: 25, weather: "cloudy", dx: 10 },
    { id: "인천", temperature: 28, weather: "sunny", dx: -50, dy: -25 },
    { id: "강원", temperature: 25, weather: "rain" },
    { id: "충북", temperature: 26, weather: "rain", dx: 15 },
    { id: "충남", temperature: 22, weather: "sunny" },
    { id: "전북", temperature: 26, weather: "murky" },
    { id: "전남", temperature: 25, weather: "cloudy", dx: -20 },
    { id: "경북", temperature: 25, weather: "sunny" },
    { id: "경남", temperature: 26, weather: "cloudy" },
    { id: "제주", temperature: 24, weather: "murky", dx: -30, dy: -30 },
    { id: "울릉", temperature: 25, weather: "murky", dx: -40, dy: -20 }
]

const englishProvincesData: Record<string, string> = {
    서울: "Seoul",
    인천: "Incheon",
    강원: "Gangwon",
    충북: "North Chungcheong",
    충남: "South Chungcheong",
    전북: "North Jeolla",
    전남: "South Jeolla",
    경북: "North Gyeongsang",
    경남: "South Gyeongsang",
    제주: "Jeju",
    울릉: "Ulleung"
}

const mapAxis = { map: { path: mapPath, width: 500, height: 650, viewX: -20, viewY: -20 }, data: weatherMapData }
const mapBrush = { type: "map.weather", format: (id: string) => englishProvincesData[id] }
const mapStyle = { mapPathBackgroundColor: "white", mapPathBorderColor: "#a9a9a9" }

// --- Province temperature bar chart (random per load, matches the legacy demo's own Math.random) -
function generateProvincesTemperature() {
    return Object.values(englishProvincesData).map((name) => ({
        name,
        Average: Math.floor(Math.random() * 5) + 30,
        Maximum: Math.floor(Math.random() * 10) + 35
    }))
}
const barAxis = {
    x: { type: "block", domain: "name", line: true, textRotate: -10 },
    y: { type: "range", domain: [30, 50], step: 2, line: true, min: 0, orient: "right" },
    data: generateProvincesTemperature()
}
const barBrush = { type: "column", target: ["Average", "Maximum"], colors: [4, 5] }
const barWidget = [
    { type: "tooltip", all: true },
    { type: "legend", filter: true }
]

// --- Province combo (decorative in the original too - no onChange side effect was ever wired) ---
// Still needs a local v-model: Combo.vue only displays the picked item's text INSTEAD OF the
// static "Select..." placeholder when its `modelValue` prop is actually bound back to the
// selection - without it, the button's own label never updates after a click even though the
// legacy jQuery ui.combo widget (self-managing its own DOM) always did.
const comboItems = Object.values(englishProvincesData).map((text, i) => ({ value: i, text }))
const selectedProvince = ref<number | undefined>(undefined)

// --- 3-day forecast table --------------------------------------------------------------------
const DESCRIPTIONS = ["Rainy", "Sunny", "Snowy", "Windy", "Foggy", "Mostly Sunny", "PM Light Rain", "AM Shower", "Cloudy", "Snow"]
function getDateFromToday(numOfAddDate = 0) {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    return new Date(today.getTime() + 1000 * 60 * 60 * 24 * numOfAddDate)
}
function getDateString(numOfAddDate = 0) {
    const date = getDateFromToday(numOfAddDate)
    const parsed = `${date.getMonth() + 1}/${date.getDate()}`
    return numOfAddDate === 0 ? `${parsed} (Today)` : parsed
}
const forecastRows = ref<{ day: string; highLow: string; description: string; precip: string }[]>([])
function buildForecastRows() {
    const rows = []
    for (let i = 0; i < 3; i++) {
        rows.push({
            day: getDateString(i),
            highLow: `${Math.floor(Math.random() * 5) + 30}°C / ${Math.floor(Math.random() * 10) + 35}°C`,
            description: DESCRIPTIONS[Math.floor(Math.random() * DESCRIPTIONS.length)],
            precip: `${Math.floor(Math.random() * 100)}%`
        })
    }
    return rows
}

// --- Temperature & precipitation detail line chart (static after initial random generation) -----
function generateDetailChartData(startDate: Date, endDate: Date, interval: number, valueStart: number, valueEnd: number) {
    const data = []
    for (let t = startDate.getTime(); t <= endDate.getTime(); t += interval) {
        data.push({ date: t, value: Math.floor(Math.random() * (valueEnd - valueStart)) + valueStart })
    }
    return data
}
const detailStart = getDateFromToday(0)
const detailEnd = getDateFromToday(2)
const detailInterval = 1000 * 60 * 60 * 4
const temperatureAxis = [
    {
        x: { type: "date", domain: [detailStart, detailEnd], interval: 1000 * 60 * 60 * 8, format: "dd HH:mm", key: "date" },
        y: { type: "range", domain: [20, 50], step: 3, line: true },
        data: generateDetailChartData(detailStart, detailEnd, detailInterval, 30, 45),
        area: { width: "47%" }
    },
    {
        extend: 0,
        area: { width: "47%", x: "53%" },
        y: { type: "range", domain: [0, 100], step: 3, orient: "right" },
        data: generateDetailChartData(detailStart, detailEnd, detailInterval, 0, 100)
    }
]
const temperatureBrush = [
    { type: "line", target: "value", animate: true, colors: [2] },
    { type: "line", target: "value", animate: true, colors: [2], axis: 1 },
    { type: "scatter", target: "value", hide: true, colors: [2] },
    { type: "scatter", target: "value", hide: true, colors: [2], axis: 1 }
]
const temperatureWidget = [{ type: "tooltip", brush: [2, 3], orient: "bottom" }]

// --- Realtime air quality line chart (updates every second, exactly like the legacy setInterval) -
function generateAirQualityData() {
    const currentTime = Date.now()
    const startTime = currentTime - 1000 * 60 * 5
    const data = []
    for (let t = startTime; t <= currentTime; t += 1000) {
        data.push({ date: t, value: Math.floor(Math.random() * 40) })
    }
    return data
}
function updateAirQualityData(currentData: { date: number; value: number }[]) {
    currentData.shift()
    const latestDate = currentData[currentData.length - 1].date
    currentData.push({ date: latestDate + 1000, value: Math.floor(Math.random() * 40) })
    return currentData
}
const airQualityAxis = {
    x: { type: "date", domain: [new Date(Date.now() - 1000 * 60 * 5), new Date()], interval: 1, realtime: "minutes", format: "hh:mm", key: "date", line: true },
    y: { type: "range", domain: [0, 100], step: 4, line: true },
    data: generateAirQualityData(),
    area: { width: "100%" }
}
const airQualityBrush = [
    { type: "line", target: ["value"], colors: [3] },
    { type: "scatter", target: ["value"], colors: [3], hide: true }
]
const airQualityWidget = [{ type: "tooltip", brush: 1 }]
const airQualityChartRef = ref<InstanceType<typeof Chart> | null>(null)
let airQualityTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
    forecastRows.value = buildForecastRows()
    airQualityTimer = setInterval(() => {
        const builder = airQualityChartRef.value?.getBuilder?.()
        if (!builder) return
        const axis = builder.axis(0)
        // `:render="false"` on this <Chart> + one explicit `builder.render()` at the end batches
        // the grid-domain swap and the data update into a single render - without it, updateGrid's
        // own immediate render (Axis.set()'s `if (this.chart.isRender()) this.chart.render()`)
        // would fire BEFORE axis.update() swaps in the new data, briefly rendering with a shifted
        // x-domain against the still-old data array (see play/chart/json/update_axis_grid.js's
        // fix for the same underlying issue).
        axis.updateGrid("x", { domain: [new Date(Date.now() - 1000 * 60 * 5), new Date()] })
        axis.update(updateAirQualityData(axis.data))
        builder.render()
    }, 1000)
})
onBeforeUnmount(() => {
    if (airQualityTimer) clearInterval(airQualityTimer)
})
</script>

<template>
    <div class="row">
        <div class="col left">
            <div class="panel">
                <div class="head"><strong>Korea Weather Map</strong></div>
                <div class="body">
                    <Chart :height="670" :padding="0" :axis="[mapAxis]" :brush="[mapBrush]" :style="mapStyle" />
                </div>
            </div>
        </div>
        <div class="right">
            <div class="row">
                <div class="panel">
                    <div class="head"><strong>Temperature in each province</strong></div>
                    <div class="body">
                        <Chart
                            :height="120"
                            :padding="{ left: 0, right: 25, top: 20, bottom: 50 }"
                            :axis="barAxis"
                            :brush="barBrush"
                            :widget="barWidget"
                        />
                    </div>
                </div>
            </div>
            <div class="panel">
                <div class="head">
                    <strong>Detailed weather information</strong>
                    <div style="float: right">
                        <Combo v-model="selectedProvince" :items="comboItems" :index="-1" :width="150" />
                    </div>
                </div>
                <div class="body">
                    <section>
                        <span class="h6">3 Day Forecast</span>
                        <table class="table classic">
                            <thead>
                                <tr>
                                    <th>Day</th>
                                    <th>High / Low</th>
                                    <th>Description</th>
                                    <th>PRECIP</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="row in forecastRows" :key="row.day">
                                    <td>{{ row.day }}</td>
                                    <td>{{ row.highLow }}</td>
                                    <td>{{ row.description }}</td>
                                    <td>{{ row.precip }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                    <section>
                        <span class="h6">Temperature &amp; Precipitation</span>
                        <Chart
                            :height="130"
                            :padding="{ left: 30, right: 30, top: 10, bottom: 20 }"
                            :axis="temperatureAxis"
                            :brush="temperatureBrush"
                            :widget="temperatureWidget"
                        />
                    </section>
                    <section>
                        <span class="h6">Realtime Air Quality</span>
                        <Chart
                            ref="airQualityChartRef"
                            :height="130"
                            :padding="{ left: 30, right: 20, top: 10, bottom: 20 }"
                            :axis="airQualityAxis"
                            :brush="airQualityBrush"
                            :widget="airQualityWidget"
                            :render="false"
                        />
                    </section>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.left {
    width: 550px !important;
}
.right {
    left: 2%;
    width: auto;
    overflow: hidden;
    padding-left: 10px;
}
.right > .row:first-child {
    margin-bottom: 7px;
}
.right > .panel:last-child > .body {
    height: 472px;
    overflow: hidden;
}
span.h6 {
    font-weight: bold !important;
    margin: 20px 0px 6px 0px;
}
section:first-child span.h6 {
    margin-top: 0px !important;
}
</style>
