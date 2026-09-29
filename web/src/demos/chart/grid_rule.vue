<script setup lang="ts">
// jui-graph-ts's RuleGrid ("chart.grid.rule") - the only demo of this grid type anywhere in this
// gallery (it was previously unreachable in this Vue ecosystem: never registered under
// jui-chart-vue's own grid-type map, and never actually rendered in the real legacy engine either
// - see jui-graph-ts's grid/rule.ts header comment for the full history of what was fixed).
//
// Not used as the main y-axis of the column brush below: `jui-graph-ts`'s own `getXY()` decides
// which axis is the "value" axis purely by `axis.y.type == "range"` (see brush/core.ts's header
// comment) - a "rule"-typed grid never satisfies that check, so no brush (column, line, or
// otherwise) can read a RuleGrid as its value axis without x/y silently swapping roles. RuleGrid's
// only real use is therefore as a second, brush-less axis group overlaid on the SAME plot area as
// the real data axis - a right-side reference scale, same pattern the legacy `mixed3_axis_3` demo
// uses (`axis[1].extend: 0` inherits axis[0]'s x config; `axis[1]` gets no `brush` entry of its
// own, so it only ever draws, never gets read for coordinates).
//
// Both y axes below share the exact same explicit `domain: [0, 120]` (not the data's own min/max,
// resolved via a string `domain: "sales"`) specifically so their tick math snaps to the same 0
// baseline: both grids walk their ticks outward from 0 in `step`-sized units (see range.ts's/
// rule.ts's own `initDomain()`), so two DIFFERENT auto-resolved domains (e.g. axis[0] snapping to
// [0,120], axis[1] snapping to [70,120] from a narrower data-derived range) would make their
// labels land at the same pixel height for genuinely different values - actively misleading, not
// just visually busy. With a shared domain, axis[1]'s `step: 12` (-> a 10-unit tick spacing, see
// rule.ts's own `unit = Math.ceil((max-min)/step)`) aligns with axis[0]'s own 6-unit tick spacing
// (`step: 20`, see range.ts's own `unit = div(max-min, step)`) at their common multiples
// (30/60/90/120), reading as a finer-grained subdivision of the same scale rather than an
// unrelated second one.
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

const data = [
    { month: "Jan", sales: 82 },
    { month: "Feb", sales: 95 },
    { month: "Mar", sales: 71 },
    { month: "Apr", sales: 108 },
    { month: "May", sales: 90 },
    { month: "Jun", sales: 120 }
]

const padding = { left: 50, right: 60 }
const axis = [
    {
        x: {
            type: "block",
            domain: "month",
            line: true
        },
        y: {
            type: "range",
            domain: [0, 120],
            step: 20,
            line: true
        },
        data: data
    },
    {
        x: {
            hide: true
        },
        y: {
            type: "rule",
            domain: [0, 120],
            step: 12,
            orient: "right",
            // RuleGrid.right()'s own tick+label reach ~10px INWARD from this grid's own origin
            // (a short tick plus 4px of label padding, see rule.ts's right() method) - with the
            // default dist:0 that origin sits exactly on the plot's right edge, so the label
            // overlapped the column brush's own full-width bars. Push the grid itself out into
            // the right padding area so the label clears the bars.
            dist: 40
        },
        extend: 0,
        data: data
    }
]
const brush = {
    type: "column",
    target: "sales",
    axis: 0
}

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :padding="padding" :axis="axis" :brush="brush" />
</template>
