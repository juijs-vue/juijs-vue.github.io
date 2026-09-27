<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

const padding = 100
const axis = {
    	x : {
    		type : "range",
    		domain : [ -5, 20 ],
    		line : "solid"
    	},
    	y : {
    		type : "range",
    		domain : [ -3, 5 ],
    		hide : true
    	},
    	z : {
    		type : "range",
    		domain : [ -7, 7 ],
    		line : "solid"
    	},
    	depth : 400,
    	perspective : 0.8
    }
const brush = [{
    	type : "canvas.model3d",
    	model : "f16"
    }]
const widget = [{
    	type : "polygon.rotate3d"
    }]
const style = {
    	gridXAxisBorderWidth: 1,
    	gridYAxisBorderWidth: 1,
    	gridZAxisBorderWidth: 1
    }
const canvas = true

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :padding="padding" :axis="axis" :brush="brush" :widget="widget" :style="style" :canvas="canvas" />
</template>
