<script setup lang="ts">
// @ts-nocheck
import { reactive } from "vue"

const items = reactive([
    { type: "group", title: "Inner Property", description: "it can be nested property view " },
    { type: "checkbox", title: "Controls", key: "controls", value: true, description: "Display controls in the bottom right corner" },
    { type: "checkbox", title: "Progress", key: "progress", value: true, description: "Display a presentation progress bar" },
    { type: "checkbox", title: "Slide Number", key: "slideNumber", value: false, description: "Display the page number of the current slide" },
    { type: "checkbox", title: "History", key: "history", value: false, description: "Push each slide change to the browser history" },
    { type: "checkbox", title: "Keyboard", key: "keyboard", value: true, description: "Enable keyboard shortcuts for navigation" }
])

function onChange(item, newValue, oldValue) {
    console.log("item : ", item)
    console.log("all items", newValue)
}
</script>

<template>
<div class="property-container" style="width: 500px; height: 500px; position: relative; overflow: auto;">
    <div class="panel">
        <div class="head">
            <i class="icon-left"></i> <strong>Complex Settings with Panel</strong>
        </div>
        <div class="body has-property" style="height: 300px;">
            <div class="property">
                <Property :items="items" @change="onChange" />
            </div>
        </div>
    </div>
</div>
</template>
