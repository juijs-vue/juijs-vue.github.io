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
        type : "fullgauge",
        size : 20,
        titleY : 40,
        showText : true,
        format : function(value) {
            return value + "k";
        }
    }]
const style = {
       	gaugeFontSize : 30
    }

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :axis="axis" :brush="brush" :style="style" />
</template>
