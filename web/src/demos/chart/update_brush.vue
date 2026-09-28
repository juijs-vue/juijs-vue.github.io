<script setup lang="ts">
// @ts-nocheck
import { onMounted, onUnmounted, ref } from "vue"
import { Chart } from "jui-chart-vue"

// `brush`는 5초 뒤 push + 인덱스 재대입으로 mutate되므로 ref()로 감싼다(<Chart>는 `brush` prop이
// 바뀔 때마다 다시 렌더링한다) - `axis`는 절대 변경되지 않아 plain const로 둔다.
const axis = [{
    x : {
        type : "block",
        domain : "quarter",
        line : true
    },
    y : {
        type : "range",
        domain : [ -40, 40 ],
        step : 10,
        line : true
    },
    data : [
        { quarter : "1Q", sales : 50, profit : 35 },
        { quarter : "2Q", sales : -20, profit : -30 },
        { quarter : "3Q", sales : 10, profit : -5 },
        { quarter : "4Q", sales : 30, profit : 25 }
    ]
}]
const brush = ref([{
    type : "column",
    target : [ "sales", "profit" ]
}])

const chartRef = ref(null)
let timer = null
onMounted(() => {
    // After 5 seconds, update brush - `<Chart>` re-renders whenever the `brush` prop changes,
    // so a plain reactive mutation replaces the legacy addBrush()/updateBrush()/render() calls.
    timer = setTimeout(() => {
        brush.value.push({
            type : "line",
            symbol : "curve",
            target : [ "sales", "profit" ]
        });

        brush.value[0] = {
            type : "scatter",
            target : [ "sales", "profit" ],
            size : 10
        };
    }, 5000);
})
onUnmounted(() => {
    clearTimeout(timer);
})
</script>

<template>
<Chart ref="chartRef" :axis="axis" :brush="brush" />
</template>
