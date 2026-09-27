<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

var names = {
    ie: "IE",
    ff: "Fire Fox",
    chrome: "Chrome",
    safari: "Safari",
    other: "Others"
};

// The SVG icon of style components can be used in chart

const padding = 150
// jui-chart-vue's own default icon font path is an absolute `/lib/jui-chart-vue/...` URL baked in
// at ITS OWN build time (for the original Flask deployment) - wrong for this SPA's own
// `/` base, so every demo that actually renders an icon glyph (this one does, via
// `this.icon("label")`/the legend's `icon: "{chart}"`) passes its own relative path instead. See
// `web/scripts/copy-legacy-static.mjs`'s matching font-copy entry.
const icon = {
    type: "classic",
    path: [
        "../../lib/jui-chart-vue/fonts/icomoon.eot",
        "../../lib/jui-chart-vue/fonts/icomoon.woff",
        "../../lib/jui-chart-vue/fonts/icomoon.ttf",
        "../../lib/jui-chart-vue/fonts/icomoon.svg"
    ]
}
const axis = {
        data : [
            { ie : 70, ff : 11, chrome : 9, safari : 6, other : 4 }
        ]
    }
const brush = {
        type : "pie",
        format : function(k, v) {
            return names[k] + ": " + v;
        },
        showText : true
    }
const widget = [
    	{
            type : "title",
            text : "Pie Sample"
        }, {
            type : "tooltip",
            orient : "left",
            format : function(k, v) {
                return this.icon("label") + v;
            }
        }, {
            type : "legend",
            icon : "{chart}",
            format : function(k) {
                return names[k];
            }
        }
    ]

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :padding="padding" :icon="icon" :axis="axis" :brush="brush" :widget="widget" />
</template>
