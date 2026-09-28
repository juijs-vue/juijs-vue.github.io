<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const items = [
    { value: "jennifer", text: "Jennifer" },
    { value: "dark", text: "Dark" },
    { value: "pastel", html: "<strong>Pastel</strong>" },
    { value: "pattern", text: "Pattern" },
    { type: "divider" },
    {
        value: "gradient",
        html: '<img src="https://placehold.co/20x20" width="20" height="20" style="vertical-align: middle;" /> <span style="color: yellow;">Gradient</span>'
    }
]

const themeListRight = ref(undefined)
const themeBottom = ref(undefined)

function onChange(value) {
    console.log(value)
}
</script>

<template>
<div class="select-container select-container-500-300">
    <h3>Align : right</h3>
    <div style="text-align: right;">
        <Select v-model="themeListRight" :items="items" align="right" />
    </div>
</div>

<div class="select-container select-container-500-300">
    <h3>Vertical Align : bottom</h3>
    <div>
        <Select v-model="themeBottom" :items="items" valign="bottom" placeholder="THEME" @change="onChange" />
    </div>
</div>
</template>
