<script setup lang="ts">
// @ts-nocheck
import { onMounted, onUnmounted, ref } from "vue"
import { Chart } from "jui-chart-vue"

// `axis`/`brush`는 여기서는 절대 재대입되지 않는다 - 아래 `updateGrid()` 호출은 <Chart>가 아니라
// ref로 얻은 실제 jui-graph-ts Builder 위에서 직접 실행되는 명령형 API라서 plain const로 둔다.
const axis = {
    x : {
        type : "block",
        domain : [ "1Q", "2Q", "3Q", "4Q" ],
        line : true
    },
    y : {
        type : "range",
        domain : [ 0, 10000 ],
        step : 4
    },
    data : [
        { sales : 2100, profit : 1800 },
        { sales : 6000, profit : 4400 },
        { sales : 8300, profit : 6700 },
        { sales : 5200, profit : 4800 }
    ]
}
const brush = {
    type: "scatter",
    target: [ "sales", "profit" ]
}

const chartRef = ref(null)
let timer = null
onMounted(() => {
    // After 5 seconds, update axis grid - `axis.updateGrid()` is an imperative Axis method with
    // no reactive-prop equivalent, so it's called directly on the live Builder via the ref
    // (same pattern as an instance-method event handler).
    //
    // `:render="false"` + the explicit `builder.render()` at the end (both restored here,
    // matching the legacy demo's own `render: false` + trailing `c.render()`) aren't optional
    // decoration - dropping them (as this file's first conversion pass did) reproduces a real
    // bug: with `render` left at `<Chart>`'s own default (`true`), each `updateGrid()` call
    // re-renders immediately (`Axis.set()`'s own `if (this.chart.isRender()) this.chart.render()`
    // guard), so the chart renders once with x AND y BOTH swapped to "block" (a genuinely
    // invalid intermediate combination - no numeric axis at all) between the two calls, before
    // the second call restores a valid x=range/y=block state. That transient render is real,
    // visible, and threw 8 "<ellipse> attribute cx: Expected length, 'null'" console errors on
    // the scatter brush's markers (confirmed via Playwright) even though the FINAL state always
    // looked correct. `render: false` batches both grid-type swaps before the engine ever
    // re-renders, exactly like the original.
    timer = setTimeout(() => {
        var builder = chartRef.value.getBuilder();
        var axis = builder.axis(0);

        axis.updateGrid("y", {
            type : "block",
            domain : [ "1Q", "2Q", "3Q", "4Q" ],
            line : true
        }, true);

        axis.updateGrid("x", {
            type : "range",
            domain : [ 0, 10000 ],
            step : 4
        }, true);

        builder.render();
    }, 5000);
})
onUnmounted(() => {
    clearTimeout(timer);
})
</script>

<template>
<Chart ref="chartRef" :axis="axis" :brush="brush" :render="false" />
</template>
