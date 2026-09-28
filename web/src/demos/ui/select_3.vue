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

const themeListMulti = ref([])

function onChange(value) {
    console.log(value)
}
</script>

<template>
<div class="select-container select-container-500-500">
    <h1>Multi Selection for Select Box</h1>
    <div>
        <Select v-model="themeListMulti" :items="items" multi @change="onChange" />
    </div>
</div>
</template>
