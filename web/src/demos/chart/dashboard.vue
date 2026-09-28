<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

var data = [
    { quarter : "1Q", sales: 2, profit: 15, total: 17 },
    { quarter : "2Q", sales: 15, profit: 6, total: 21 },
    { quarter : "3Q", sales: 8, profit: 10, total: 18 },
    { quarter : "4Q", sales: 18, profit: 5, total: 23 }
];
var data2 = [
    { name : "Start", value : 90 },
    { name : "a", value : 105 },
    { name : "b", value : 126 },
    { name : "c", value : 89 },
    { name : "d", value : 6 },
    { name : "e", value : -30 },
    { name : "f", value : 16 },
    { name : "g", value : 107 },
    { name : "end", value : 168 }
];

const axis = [{
        x : {
            type : "block",
            domain : "quarter"
        },
        y : {
            type : "range",
            domain : "sales"
        },
        area : {
            x : 0,  y : 0, width : "40%", height : "40%"
        },
        data : data
    }, {
        // NOTE: this used to be a nested `x: { extend: 0 }` / `y: { extend: 0, domain: "profit" }`
        // (grid-level `extend`) - that was never a real, implemented feature of this engine (or
        // the original jui-chart engine it's ported from: neither one's `chart.grid.*` ever reads
        // an `extend` key at all - only the AXIS level does, via `Builder`'s own
        // `extend(axis, options.axis[axis.extend], true)`). With no `domain` of its own, that left
        // this axis's x-grid with an EMPTY ordinal domain, so `axis.x(...)` returned `null` for
        // every row - the real root cause of this demo's `<path> attribute d: Expected number,
        // "Mnull,..."` console error (traced to the "line"/profit brush specifically, not
        // "waterfall" - Playwright-inspected the live SVG to confirm which brush's `<path>` it
        // was). Fixed by using the axis-level `extend` this engine actually supports: it merges
        // axis 0's raw `x`/`y` config into this axis (skipping any key already set here) BEFORE
        // this axis resolves its own scale against its own `area` - so this axis still gets its
        // own independently-positioned x/y grids (same type+domain as axis 0, not literally
        // axis 0's own resolved pixel positions), which is what a "quarter" x-axis paired with a
        // *different* "profit" y-domain, drawn in a *different* area than axis 0, needs.
        extend : 0,
        y : {
            domain : "profit"
        },
        area : {
            x : "50%",  y : 0, width : "50%", height : "40%"
        },
        data : data
    }, {
        x : {
            type : "block",
            domain : "name"
        },
        y : {
            type : "range",
            step : 10,
            domain : "value"
        },
        area : {
            x : 0,  y : "50%", width : "100%", height : "50%"
        },
        data : data2
    }]
const brush = [{
        type : "column",
        target : "sales",
        axis : 0
    }, {
        type : "line",
        target : "profit",
        axis : 1
    }, {
        type : "waterfall",
        target : "value",
        end : true,
        line : true,
        outerPadding : 10,
        axis : 2
    }]

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :axis="axis" :brush="brush" />
</template>
