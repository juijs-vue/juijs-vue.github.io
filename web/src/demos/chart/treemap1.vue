<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

const axis = [{
    	data : [{
    		index: "0",
    		text: "Apples"
    	}, {
    		index: "0.0",
    		text: "Anne",
    		value: 5
    	}, {
    		index: "0.1",
    		text: "Rick",
    		value: 3
    	}, {
    		index: "0.2",
    		text: "Peter",
    		value: 4
    	}, {
    		index: "1",
    		text: "Bananas"
    	}, {
    		index: "1.0",
    		text: "Anne",
    		value: 4
    	}, {
    		index: "1.1",
    		text: "Rick",
    		value: 10
    	}, {
    		index: "1.2",
    		text: "Peter",
    		value: 1
    	}, {
    		index: "2",
    		text: "Oranges"
    	}, {
    		index: "2.0",
    		text: "Anne",
    		value: 1
    	}, {
    		index: "2.1",
    		text: "Rick",
    		value: 3
    	}, {
    		index: "2.2",
    		text: "Peter",
    		value: 3
    	}, {
    		index: "3",
    		text: "Susanne",
    		value: 2
    	}]
    }]
const brush = [{
    	type : "treemap",
    	textOrient : "bottom",
    	textAlign : "end",
    	titleDepth : 1,
    	colors : [ "#EC2500", "#ECE100", "#EC9800", "#9EDE00" ],
    	target : [ "value" ]
    	/*/
    	nodeColor: function(node) {
    	}
    	/**/
    }]
const widget = [{
    	type : "tooltip",
    	format : function(data) {
    		return {
    			key: data.text,
    			value: data.value
    		}
    	}
    }]
const event = {
    	click: function(d, e) {
    		console.log(d);
    	}
    }

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :axis="axis" :brush="brush" :widget="widget" :event="event" />
</template>
