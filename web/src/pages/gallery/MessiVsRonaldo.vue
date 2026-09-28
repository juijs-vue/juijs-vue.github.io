<script setup lang="ts">
// @ts-nocheck
// Native Vue3 port of gallery/messi-vs-ronaldo (legacy jQuery + jui.chart/jui.grid/jui.ui demo,
// still at gallery/messi-vs-ronaldo/index.html on `main`). Ported 1:1: three static charts
// (Offense Point, All Time Stats, Overall) plus a Season History grid whose rows are switched by
// a <Combo> (Messi/Ronaldo) - using <Chart>/<DataGrid>/<Combo> instead of the legacy
// jui.chart.builder/grid.xtable/ui.combo stack. Literal stats data ported unchanged from data.js.
import { computed, ref } from "vue"
import { Chart } from "jui-chart-vue"
import data from "./messi/data"

const NAMES: Record<string, string> = { messi: "Messi", ronaldo: "Ronaldo" }

// --- Offense Point ------------------------------------------------------------------------------
const offensePointAxis = [
    {
        x: { type: "block", domain: "season", line: true },
        y: { type: "range", domain: [0, 100], step: 4 },
        area: {},
        data: data.offensePoint
    },
    {
        x: { hide: true, type: "fullblock" },
        y: { type: "range", domain: [0, 50], orient: "right", step: 2 },
        extend: 0
    }
]
const offensePointBrush = [
    {
        type: "column",
        display: "all",
        axis: 0,
        target: ["messiGoal", "ronaldoGoal"],
        size: 30,
        colors: ["#77B0A8", "#E96359", "#EEBF6E", "#F2EFC6"]
    },
    {
        type: "line",
        axis: 1,
        target: ["messiAssist", "ronaldoAssist"],
        colors: ["#EEBF6E", "#F2EFC6"]
    }
]
const offensePointWidget = [
    {
        type: "legend",
        format: (v: string) => {
            if (v === "messiGoal") return "Messi Goal"
            else if (v === "ronaldoGoal") return "Ronaldo Goal"
            else if (v === "messiAssist") return "Messi Assist"
            else if (v === "ronaldoAssist") return "Ronaldo Assist"
        }
    },
    { type: "tooltip", brush: [0, 1] },
    { type: "title", text: "Offense Point", align: "start", orient: "center", dx: -60 }
]

// --- All Time Stats -------------------------------------------------------------------------
const allTimeStatsAxis = [
    {
        x: { type: "range", domain: [0, 850], step: 10, line: true, reverse: true },
        y: { type: "block", domain: "type" },
        data: data.allTimeStats,
        area: { x: 0, y: 0, width: "50%", height: "100%" }
    },
    {
        x: { reverse: false },
        y: { orient: "right" },
        area: { x: "50%", y: 0, width: "50%", height: "100%" },
        extend: 0
    }
]
const allTimeStatsBrush = [
    { type: "bar", target: "messi", display: "all", axis: 0, colors: ["#77B0A8"] },
    { type: "bar", target: "ronaldo", display: "all", axis: 1, colors: ["#E96359"] }
]
const allTimeStatsWidget = [
    { type: "legend", brush: [0, 1], format: (k: string) => NAMES[k] },
    {
        type: "tooltip",
        brush: [0, 1],
        format: (d: Record<string, unknown>, k: string) => ({ key: NAMES[k], value: d[k] })
    }
]

// --- Overall ---------------------------------------------------------------------------------
const overallAxis = [
    { area: { width: "20%" }, data: [{ Messi: 5, Ronaldo: 2 }] },
    {
        area: { width: "42%", x: "28%" },
        x: { type: "fullblock", domain: "season" },
        y: { type: "range", domain: [5, 10], step: 5, line: true },
        data: data.averageRating
    },
    { area: { x: "78%", width: "20%" }, data: [{ Messi: 174, Ronaldo: 106 }] }
]
const overallBrush = [
    {
        type: "donut",
        showText: "outer",
        format: (_k: string, v: number) => `${v} times`,
        size: 30,
        axis: 0,
        colors: ["#77B0A8", "#E96359", "#EEBF6E", "#F2EFC6"]
    },
    {
        type: "line",
        target: ["messi", "ronaldo"],
        symbol: "curve",
        axis: 1,
        animate: true,
        colors: ["#77B0A8", "#E96359", "#EEBF6E", "#F2EFC6"]
    },
    {
        type: "scatter",
        size: 8,
        axis: 1,
        target: ["messi", "ronaldo"],
        colors: ["#77B0A8", "#E96359", "#EEBF6E", "#F2EFC6"]
    },
    {
        type: "donut",
        showText: "outer",
        format: (_k: string, v: number) => `${v} times`,
        size: 30,
        axis: 2,
        colors: ["#77B0A8", "#E96359", "#EEBF6E", "#F2EFC6"]
    }
]
const overallWidget = [
    { type: "title", text: "Ballon d'Or", orient: "bottom", dy: 50, axis: 0 },
    { type: "title", text: "Average Rating", align: "start", orient: "center", dx: -85, axis: 1 },
    { type: "legend" },
    { type: "title", text: "Man of the Match", orient: "bottom", dy: 50, axis: 2 }
]

// --- Season History grid + player switch -----------------------------------------------------
const HISTORY_COLUMNS = [
    { key: "seasonName", label: "Season" },
    { key: "teamName", label: "Team" },
    { key: "tournamentName", label: "Tournament", width: 190 },
    { key: "apps", label: "Apps", align: "right" as const },
    { key: "minsPlayed", label: "Mins", align: "right" as const },
    { key: "goal", label: "Goals", align: "right" as const },
    { key: "assistTotal", label: "Assists", align: "right" as const },
    { key: "yellowCard", label: "Yel", align: "right" as const },
    { key: "redCard", label: "Red", align: "right" as const },
    { key: "shotsPerGame", label: "SpG", align: "right" as const },
    { key: "passSuccess", label: "PS%", align: "right" as const },
    { key: "aerialWonPerGame", label: "AerialsWon", align: "right" as const },
    { key: "manOfTheMatch", label: "MotM", align: "right" as const },
    { key: "rating", label: "Rating", align: "right" as const }
]

function formatFloats(row: Record<string, unknown>) {
    const out: Record<string, unknown> = {}
    for (const key in row) {
        const v = row[key]
        out[key] = typeof v === "number" && !Number.isInteger(v) ? v.toFixed(2) : v
    }
    return out
}

const selectedPlayer = ref("messi")
const comboItems = [
    { text: "Messi", value: "messi" },
    { text: "Ronaldo", value: "ronaldo" }
]
const historyRows = computed(() =>
    (data.history[selectedPlayer.value] as Record<string, unknown>[]).map((d, i) => ({ id: i, data: formatFloats(d) }))
)
</script>

<template>
    <div class="row">
        <div class="panel">
            <div class="head"><strong>Offense Point</strong></div>
            <div class="body">
                <Chart width="100%" :height="200" :padding="{ left: 55, right: 25, top: 15, bottom: 50 }" :axis="offensePointAxis" :brush="offensePointBrush" :widget="offensePointWidget" />
            </div>
        </div>
    </div>

    <div class="row">
        <div class="panel">
            <div class="head"><strong>All Time Stats</strong></div>
            <div class="body">
                <Chart width="100%" :height="170" :padding="{ left: 100, right: 100, top: 15, bottom: 50 }" :axis="allTimeStatsAxis" :brush="allTimeStatsBrush" :widget="allTimeStatsWidget" />
            </div>
        </div>
    </div>

    <div class="row">
        <div class="panel">
            <div class="head"><strong>Overall</strong></div>
            <div class="body">
                <Chart width="100%" :height="220" :padding="{ left: 20, top: 30, bottom: 60 }" :axis="overallAxis" :brush="overallBrush" :widget="overallWidget" />
            </div>
        </div>
    </div>

    <div class="row">
        <div class="panel" style="height: 200px">
            <div class="head">
                <strong>Season History</strong>
                <div style="float: right">
                    <Combo v-model="selectedPlayer" :items="comboItems" :index="0" :width="150" />
                </div>
            </div>
            <div class="body">
                <DataGrid :columns="HISTORY_COLUMNS" :rows="historyRows" sortable resizable :scroll-height="130" />
            </div>
        </div>
    </div>
</template>
