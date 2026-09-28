<script setup lang="ts">
// @ts-nocheck
import { onMounted, ref } from "vue"
import { Chart } from "jui-chart-vue"

function showEventMessage(obj) {
    alert("[" + obj.dataIndex + "] " + obj.dataKey + "=" + obj.data[obj.dataKey])
}

const axis = [
    {
        x: { type: "block", domain: "quarter", line: true },
        y: { type: "range", domain: [-40, 40], step: 10, line: true },
        data: [
            { quarter: "1Q", sales: 50, profit: 35 },
            { quarter: "2Q", sales: -20, profit: -30 },
            { quarter: "3Q", sales: 10, profit: -5 },
            { quarter: "4Q", sales: 30, profit: 25 }
        ]
    }
]
const brush = [{ type: "column", target: ["sales", "profit"] }]
const event = { click: (obj) => showEventMessage(obj) }

const chartRef = ref(null)
onMounted(() => {
    chartRef.value.getBuilder().on("rclick", (obj) => showEventMessage(obj))
})
</script>

<template>
<Chart ref="chartRef" :axis="axis" :brush="brush" :event="event" />
</template>
