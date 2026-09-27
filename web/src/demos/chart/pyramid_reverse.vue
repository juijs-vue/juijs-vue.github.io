<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

const axis = [{
    	data : [
    		{ visit : 15654, download : 4064, request : 1987, invoice : 976, final : 846 }
    	]
    }]
const brush = [{
    	type : "pyramid",
    	showText : true,
    	reverse : true,
    	format : function(k, v, r) {
    		var h = "";

    		if(k == "visit") h = "Website visits";
    		else if(k == "download") h = "Downloads";
    		else if(k == "request") h = "Requested price list";
    		else if(k == "invoice") h = "Invoice sent";
    		else if(k == "final") h = "Finalized";

    		return h + " (" + v + ")";
    	}
    }]
const widget = [{
    	type : "tooltip",
    	format : function(data, key) {
    		return data[key];
    	}
    }, {
    	type : "title",
    	text : "Sales pyramid"
    }]
const style = {
    	pyramidLineWidth: 3
    }

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :axis="axis" :brush="brush" :widget="widget" :style="style" />
</template>
