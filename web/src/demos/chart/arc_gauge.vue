<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

const axis = [{
      	c : {
      		type : "panel",
    },
          data : [{
              title : "Overall Visits",
              value : 140,
              max : 200,
              min : 0
          }]
      }]
const brush = [{
        type : "arcgauge",
        size : 10,
        titleY : 50,
        showText : true,
        format : function(value) {
            return value + "k";
        }
    }]
const style = {
       	gaugeFontSize : 40
    }

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :axis="axis" :brush="brush" :style="style" />
</template>
