<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

// `chart.brush.gauge`'s own `drawUnit(index, data, group)` reads `value`/`min`/`max`/`unit` off
// each `axis.data` ROW (`this.getValue(data, "value", 0)` etc - see
// jui-chart-vue/src/register/brush/gauge.ts) - only `startAngle`/`endAngle` (and the ad hoc
// `arrow` flag `createText()` reads) are real brush-level config. This demo originally put
// `value`/`min`/`max`/`unitText` on `brush` instead (no `axis`/`axis.data` at all), which the
// brush's own `eachData()` never reads - with zero data rows, `eachData` never calls `drawUnit` at
// all, so the gauge silently drew nothing (no console error, just an empty chart - the actual
// `JUI_CRITICAL_ERR: brush type 'gauge' is not registered` this session fixed was a separate,
// now-resolved issue). Moving the row-level fields into a real `axis.data` entry (and renaming
// `unitText` -> `unit`, the field name `getValue(data, "unit")` actually reads) makes the gauge
// actually render.
const axis = {
        data : [
            { value : 200, min : 10, max : 700, unit : "feeds" }
        ]
    }
const brush = {
        type : 'gauge',
        startAngle : -90,
        endAngle : 180,
        arrow : true
    }

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :axis="axis" :brush="brush" />
</template>
