<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

const padding = {
    	left : 200,
    	right : 100
    }
const axis = [{
    	x : {
    		type : "range",
    		domain : [ 0, 10 ],
    		hide : true
    	},
    	y : {
    		type : "block",
    		domain : "quarter",
    		hide : true
    	},
    	data : [
    		{ quarter : "1Q", top : 1, bottom : 1 },
    		{ quarter : "2Q", top : 3, bottom : 7 },
    		{ quarter : "3Q", top : 10, bottom : 2 },
    		{ quarter : "4Q", top : 6, bottom : 4 }
    	]
    }]
const brush = [{
    	type : "hudbar",
    	target : [ "top", "bottom" ],
    	format : function(value, key) {
    		return ((key == "top") ? "T" : "B") + " " + value;
    	}
    }]
const widget = [{
    	type : "tooltip",
    	all : "all",
    	format : function(data, key) {
    		return {
    			key: (key == "top") ? "TOP" : "BOTTOM",
    			value: data[key]
    		}
    	}
    }]
const style = {
    	backgroundColor : "#1c1c1c"
    }

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :padding="padding" :axis="axis" :brush="brush" :widget="widget" :style="style" />
</template>
