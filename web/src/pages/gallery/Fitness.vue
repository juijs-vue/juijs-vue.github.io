<script setup lang="ts">
// @ts-nocheck
// Native Vue3 port of gallery/fitness (legacy jQuery + jui.chart demo, still at
// gallery/fitness/index.html on `main`). Purely static charts - no interactivity/state at all
// beyond what jui-chart-vue's own brushes provide out of the box (pie hover/click highlight,
// tooltip) - ported 1:1 from index.html + data.js.
import { Chart } from "jui-chart-vue"

const joiningData = [
    { x: 0, y: 0, value: 100 }, { x: 0, y: 1, value: 93 }, { x: 0, y: 2, value: 96 }, { x: 0, y: 3, value: 100 }, { x: 0, y: 4, value: 100 }, { x: 0, y: 5, value: 100 },
    { x: 1, y: 0, value: 85 }, { x: 1, y: 1, value: 86 }, { x: 1, y: 2, value: 84 }, { x: 1, y: 3, value: 86 }, { x: 1, y: 4, value: 100 }, { x: 1, y: 5, value: 100 },
    { x: 2, y: 0, value: 77 }, { x: 2, y: 1, value: 77 }, { x: 2, y: 2, value: 72 }, { x: 2, y: 3, value: 82 }, { x: 2, y: 4, value: 100 }, { x: 2, y: 5, value: 100 },
    { x: 3, y: 0, value: 74 }, { x: 3, y: 1, value: 68 }, { x: 3, y: 2, value: 64 }, { x: 3, y: 3, value: 72 }, { x: 3, y: 4, value: 100 },
    { x: 4, y: 0, value: 68 }, { x: 4, y: 1, value: 62 }, { x: 4, y: 2, value: 56 }, { x: 4, y: 3, value: 65 }, { x: 4, y: 4, value: 100 },
    { x: 5, y: 0, value: 54 }, { x: 5, y: 1, value: 57 }, { x: 5, y: 2, value: 52 }, { x: 5, y: 3, value: 62 }, { x: 5, y: 4, value: 100 },
    { x: 6, y: 0, value: 48 }, { x: 6, y: 1, value: 55 }, { x: 6, y: 2, value: 52 }, { x: 6, y: 3, value: 55 }, { x: 6, y: 4, value: 100 },
    { x: 7, y: 0, value: 48 }, { x: 7, y: 1, value: 55 }, { x: 7, y: 2, value: 52 }, { x: 7, y: 3, value: 55 },
    { x: 8, y: 0, value: 48 }, { x: 8, y: 1, value: 55 }, { x: 8, y: 2, value: 52 }, { x: 8, y: 3, value: 55 },
    { x: 9, y: 0, value: 48 }, { x: 9, y: 1, value: 55 }, { x: 9, y: 2, value: 52 }, { x: 9, y: 3, value: 55 },
    { x: 10, y: 0, value: 48 }, { x: 10, y: 1, value: 53 }, { x: 10, y: 2, value: 52 }, { x: 10, y: 3, value: 55 },
    { x: 11, y: 0, value: 48 }, { x: 11, y: 1, value: 53 }, { x: 11, y: 2, value: 48 }, { x: 11, y: 3, value: 55 },
    { x: 12, y: 0, value: 45 }, { x: 12, y: 1, value: 53 }, { x: 12, y: 2, value: 48 },
    { x: 13, y: 0, value: 45 }, { x: 13, y: 1, value: 53 }, { x: 13, y: 2, value: 48 },
    { x: 14, y: 0, value: 45 }, { x: 14, y: 1, value: 53 }, { x: 14, y: 2, value: 48 },
    { x: 15, y: 0, value: 45 }, { x: 15, y: 1, value: 53 }, { x: 15, y: 2, value: 48 },
    { x: 16, y: 0, value: 45 }, { x: 16, y: 1, value: 53 },
    { x: 17, y: 0, value: 45 }, { x: 17, y: 1, value: 53 },
    { x: 18, y: 0, value: 45 }, { x: 18, y: 1, value: 53 },
    { x: 19, y: 0, value: 45 }, { x: 19, y: 1, value: 53 },
    { x: 20, y: 0, value: 45 },
    { x: 21, y: 0, value: 45 },
    { x: 22, y: 0, value: 45 },
    { x: 23, y: 0, value: 42 },
    { x: 24, y: 0, value: 42 },
    { x: 25, y: 0, value: 11, isLast: true }, { x: 25, y: 1, value: 8, isLast: true }, { x: 25, y: 2, value: 11, isLast: true }, { x: 25, y: 3, value: 10, isLast: true }
]

const demoNames = [
    ["MALE", "FEMALE"],
    ["15-20 yrs", "21-25 yrs", "26-35 yrs", "36-50 yrs", "50+ yrs"],
    ["1 - 3 Months", "3 - 6 Months", "6 Months - 1 Years", "1 Years+"],
    ["Lawyers", "Sales", "Engineer", "Designer", "Doctor", "Student", "IT", "Business", "Professor", "Retired"]
]
const demoData = [
    [{ 0: 49, 1: 51 }],
    [{ 0: 21.12, 1: 18.46, 2: 21.34, 3: 20.45, 4: 18.63 }],
    [{ 0: 5.25, 1: 9.43, 2: 18.51, 3: 75.39 }],
    [{ 0: 10.81, 1: 9.7, 2: 8.48, 3: 9.2, 4: 9.92, 5: 9.92, 6: 11.14, 7: 10.81, 8: 10.31, 9: 9.7 }]
]

const growthData = [
    { startdate: "2015-10-08", enddate: "2015-10-14", val: 268 },
    { startdate: "2015-10-15", enddate: "2015-10-21", val: 275 },
    { startdate: "2015-10-22", enddate: "2015-10-28", val: 274 },
    { startdate: "2015-10-29", enddate: "2015-11-04", val: 269 },
    { startdate: "2015-11-05", enddate: "2015-11-11", val: 272 },
    { startdate: "2015-11-12", enddate: "2015-11-18", val: 272 },
    { startdate: "2015-11-19", enddate: "2015-11-25", val: 265 },
    { startdate: "2015-11-26", enddate: "2015-12-02", val: 258 },
    { startdate: "2015-12-03", enddate: "2015-12-09", val: 257 },
    { startdate: "2015-12-10", enddate: "2015-12-16", val: 250 },
    { startdate: "2015-12-17", enddate: "2015-12-23", val: 242 },
    { startdate: "2015-12-24", enddate: "2015-12-30", val: 243 },
    { startdate: "2015-12-31", enddate: "2016-01-06", val: 238 },
    { startdate: "2016-01-07", enddate: "2016-01-13", val: 224 },
    { startdate: "2016-01-14", enddate: "2016-01-20", val: 210 },
    { startdate: "2016-01-21", enddate: "2016-01-27", val: 201 },
    { startdate: "2016-01-28", enddate: "2016-02-03", val: 191 },
    { startdate: "2016-02-04", enddate: "2016-02-10", val: 180 },
    { startdate: "2016-02-11", enddate: "2016-02-17", val: 172 },
    { startdate: "2016-02-18", enddate: "2016-02-24", val: 168 },
    { startdate: "2016-02-25", enddate: "2016-03-02", val: 161 },
    { startdate: "2016-03-03", enddate: "2016-03-09", val: 156 },
    { startdate: "2016-03-10", enddate: "2016-03-16", val: 150 }
]
const eventData = [
    { val: 0.14, txt: "Calender Distribution" },
    { val: 0.42, txt: "Annual Picnic" },
    { val: 0.42, txt: "New Yoga Class" },
    { val: 0.57, txt: "New Kids Fitness Section" },
    { val: 0.42, txt: "3rd Anniversary Party" },
    { val: 0.85, txt: "Announcement of 30% Discount For Members" },
    { val: 0.57, txt: "Introduction of Advanced Machinery" },
    { val: 0, txt: "Mr. & Ms. FIT Championship 2015" },
    { val: 0.57, txt: "Camp on Warm up/ Cool Down Exercise" },
    { val: 0.14, txt: "Opening of new Suppliment Food Shop" },
    { val: 0.14, txt: "New Karate section for all" },
    { val: 0.14, txt: "X-MAS 2015 Celebration" }
]

// --- Cohort retention heatmap -----------------------------------------------------------------
const joiningAxis = [{
    x: {
        type: "block",
        domain: [
            "Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8", "Week 9", "Week 10",
            "Week 11", "Week 12", "Week 13", "Week 14", "Week 15", "Week 16", "Week 17", "Week 18", "Week 19", "Week 20",
            "Week 21", "Week 22", "Week 23", "Week 24", "Week 25", "Attrn Avg"
        ],
        line: "solid",
        key: "x"
    },
    y: { type: "block", domain: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"], line: "solid", key: "y" },
    data: joiningData
}]
const joiningBrush = {
    type: "heatmap",
    target: "value",
    colors: (d: Record<string, unknown>) => {
        if (d.isLast) return "#e0e0e0"
        if ((d.value as number) > 95) return "#fef92c"
        if ((d.value as number) > 60) return "#81ebd7"
        return "#b5b5b5"
    },
    format: (d: Record<string, unknown>) => `${d.value}%`
}
const joiningWidget = [
    { type: "tooltip", orient: "right", format: (d: Record<string, unknown>) => (d.message ? d.message : "Nobody left between Thu Oct 01 2015 and Sat Oct 03 2015") },
    { type: "title", text: "Members retained per week" },
    { type: "title", text: "Members are grouped by their month of joining", dy: 18 },
    { type: "title", text: "Joining Month", align: "end", orient: "center", dx: 58, dy: -18 }
]
const joiningStyle = { titleFontWeight: "bold", titleFontColor: "#555555", titleFontSize: 13 }

// --- Demographics pies -----------------------------------------------------------------------
function demoPieBrush(index: number, activeEvent?: string) {
    return {
        type: "pie",
        showText: "outer",
        ...(activeEvent ? { activeEvent } : {}),
        format: (k: string, v: unknown) => `${demoNames[index][Number(k)]}, ${v}%`
    }
}
function demoTooltipWidget(index: number, title: string, dy?: number) {
    const names = demoNames[index]
    return [
        { type: "title", text: title, dy },
        { type: "tooltip", format: (data: Record<string, unknown>, k: string) => ({ key: names[Number(k)], value: `${data[k]}%` }) }
    ]
}
const demoStyle = { titleFontWeight: "bold", titleFontSize: 12 }

// --- Growth vs events --------------------------------------------------------------------------
const growthAxis = [
    {
        x: {
            type: "fullblock",
            domain: "startdate",
            format: (_val: string, i: number) => `Week ${i + 1}`,
            line: false
        },
        y: { type: "range", domain: [0, 300], step: 4, line: "solid" },
        data: growthData
    },
    {
        x: {
            type: "dateblock",
            domain: [new Date("2015/10/08"), new Date("2016/03/16")],
            interval: 1000 * 60 * 60 * 24 * 7,
            hide: true
        },
        y: { type: "range", domain: [0, 3], hide: true },
        data: eventData
    }
]
const growthBrush = [
    { type: "line", target: "val", axis: 0 },
    { type: "scatter", target: "val", size: 10, axis: 0 },
    { type: "line", symbol: "step", target: "val", display: "max", clip: false, colors: [2], axis: 1 },
    { type: "scatter", target: "val", colors: [2], hide: true, axis: 1 }
]
const growthWidget = [
    { type: "tooltip", format: (d: Record<string, unknown>) => d.val, brush: 1 },
    { type: "tooltip", orient: "bottom", format: (d: Record<string, unknown>) => d.txt, brush: 3 },
    { type: "title", text: "Growth of members over time" },
    { type: "title", text: "How events and promotions influenced memberships", dy: 18 },
    { type: "title", text: "No. of Members", align: "start", orient: "center", dx: -90, dy: -20 },
    { type: "title", text: "Rate. of Events", align: "end", orient: "center", dx: 78, dy: -20 }
]
const growthStyle = {
    gridBorderColor: "#dcdcdc",
    gridBorderDashArray: "none",
    gridYAxisBorderWidth: 0,
    gridXAxisBorderWidth: 1,
    gridXAxisBorderColor: "white",
    gridTickBorderSize: 0,
    gridTickPadding: 10,
    titleFontWeight: "bold",
    titleFontColor: "#555555",
    titleFontSize: 13
}
</script>

<template>
    <div class="row main">
        <div class="h4">Cohort analysis of members based on month of joining</div>
        <Chart theme="pastel" width="100%" :height="420" :padding="{ top: 55 }" :axis="joiningAxis" :brush="[joiningBrush]" :widget="joiningWidget" :style="joiningStyle" />
    </div>

    <div class="row main">
        <div class="h4 demo">Demographics</div>
        <div class="row">
            <div class="col col-3 line">
                <Chart theme="pastel" width="100%" :height="300" :padding="70" :axis="[{ data: demoData[0] }]" :brush="demoPieBrush(0, 'click')" :widget="demoTooltipWidget(0, 'Male vs Female members')" :style="demoStyle" />
            </div>
            <div class="col col-3 line">
                <Chart theme="pastel" width="100%" :height="300" :padding="70" :axis="[{ data: demoData[1] }]" :brush="demoPieBrush(1)" :widget="demoTooltipWidget(1, 'Age group of members')" :style="demoStyle" />
            </div>
            <div class="col col-3 line">
                <Chart theme="pastel" width="100%" :height="300" :padding="{ top: 70, bottom: 70, left: 40, right: 100 }" :axis="[{ data: demoData[2] }]" :brush="demoPieBrush(2)" :widget="demoTooltipWidget(2, 'Member Tenure')" :style="demoStyle" />
            </div>
            <div class="col col-3">
                <Chart theme="pastel" width="100%" :height="300" :padding="{ top: 70, bottom: 70, left: 80, right: 60 }" :axis="[{ data: demoData[3] }]" :brush="demoPieBrush(3)" :widget="demoTooltipWidget(3, 'Major professions of members')" :style="demoStyle" />
            </div>
        </div>
    </div>

    <div class="row main">
        <div class="h4 demo">Growth VS Events</div>
        <Chart theme="pastel" width="100%" :height="350" :padding="{ top: 55 }" :axis="growthAxis" :brush="growthBrush" :widget="growthWidget" :style="growthStyle" />
    </div>
</template>

<style scoped>
.row.main {
    margin-bottom: 30px;
}
.row.main:first-child {
    margin-top: 30px;
}
.h4 {
    font-size: 16px !important;
    text-decoration: overline;
    color: #333;
    font-weight: bold !important;
    font-family: Caslon540BT-Regular, Times, "New Roman", serif, jennifer;
}
.h4.demo {
    margin-bottom: 30px;
}
.col.line {
    border-right: 1px dashed #dcdcdc;
}
</style>
