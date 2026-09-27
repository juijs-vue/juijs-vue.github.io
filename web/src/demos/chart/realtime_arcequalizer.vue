<script setup lang="ts">
// @ts-nocheck
import { onMounted, onUnmounted, ref } from "vue"
import { Chart } from "jui-chart-vue"

// `axis`는 지연 로딩 후 `axis.value[0].data`가 재대입되므로 ref()로 감싼다 - brush/widget은 절대
// 변경되지 않아 plain const로 둔다.
const axis = ref([{
    c: {
        type: "panel"
    },
    data : []
}])
const brush = [{
    type : "arcequalizer",
    target : [ "v1", "v2", "v3" ],
    maxValue: 100,
    stackCount: 20,
    textRadius: 30
}]
const widget = [{
    type : "title",
    text : "Equalizer Sample"
}]

const chartRef = ref(null)
let timer = null
onMounted(() => {
    timer = setTimeout(() => {
        var data = [];

        for(var i = 0; i < 10; i++) {
            data.push({
                v1: Math.floor(Math.random() * 50),
                v2: Math.floor(Math.random() * 20),
                v3: Math.floor(Math.random() * 10)
            });
        }

        axis.value[0].data = data;
    }, 3000);
})
onUnmounted(() => {
    clearTimeout(timer);
})
</script>

<template>
<Chart ref="chartRef" :axis="axis" :brush="brush" :widget="widget" />
</template>
