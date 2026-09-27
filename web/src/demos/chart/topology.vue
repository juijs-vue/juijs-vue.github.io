<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"
import { Chart } from "jui-chart-vue"

// jui-chart-vue's own default icon font path is an absolute `/lib/jui-chart-vue/...` URL baked in
// at ITS OWN build time (for the original Flask deployment) - wrong for this SPA's own
// `/jui-ui-vue/` base (real 404s otherwise). See `web/scripts/copy-legacy-static.mjs`'s matching
// font-copy entry.
const icon = {
    type: "classic",
    path: [
        "../../lib/jui-chart-vue/fonts/icomoon.eot",
        "../../lib/jui-chart-vue/fonts/icomoon.woff",
        "../../lib/jui-chart-vue/fonts/icomoon.ttf",
        "../../lib/jui-chart-vue/fonts/icomoon.svg"
    ]
}

var data = [
    { key: "1000_1", name: "W1", type: "was", outgoing: [ "1000_2" ] },
    { key: "1000_2", name: "W2", type: "was", outgoing: [ "1000_3", "1000_4" ] },
    { key: "1000_3", name: "W3", type: "was", outgoing: [ "1_2_3_4", "1000_2" ] },
    { key: "1000_4", name: "W4", type: "server", outgoing: [ "1_2_3_4" ] },
    { key: "1_2_3_4", name: "Oracle", type: "db", outgoing: [] }
];

const padding = 5
const axis = {
        c: {
            type: "topologytable"
        },
        data: data
    }
const brush = {
        type: "topologynode",
        nodeText: function(data) {
            if(data.type == "server") {
                return "{server}";
            } else if(data.type == "was") {
                return "{was}";
            } else {
                return "{db}";
            }
        },
        nodeTitle: function(data) {
            return data.name;
        }
    }
const widget = {
        type: "topologyctrl",
        zoom: true,
        move: true
    }

const chartRef = ref(null)
</script>

<template>
<Chart ref="chartRef" :icon="icon" :padding="padding" :axis="axis" :brush="brush" :widget="widget" />
</template>
