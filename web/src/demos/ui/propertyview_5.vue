<script setup lang="ts">
// @ts-nocheck
import { reactive, ref } from "vue"

const accordionItems = reactive([
    { title: "Default Settings", contentClass: "has-property" },
    { title: "View Settings", contentClass: "has-property" },
    { title: "Data Server Settings", contentClass: "has-property" }
])

const propertyItems = reactive([
    { type: "group", title: "Inner Property", description: "it can be nested property view " },
    { type: "checkbox", title: "Controls", key: "controls", value: true, description: "Display controls in the bottom right corner" },
    { type: "checkbox", title: "Progress", key: "progress", value: true, description: "Display a presentation progress bar" },
    { type: "checkbox", title: "Slide Number", key: "slideNumber", value: false, description: "Display the page number of the current slide" },
    { type: "checkbox", title: "History", key: "history", value: false, description: "Push each slide change to the browser history" },
    { type: "checkbox", title: "Keyboard", key: "keyboard", value: true, description: "Enable keyboard shortcuts for navigation" }
])

const accordionOpen = ref(0)

function onChange(item, newValue, oldValue) {
    console.log("item : ", item)
    console.log("all items", newValue)
}
</script>

<template>
<div class="property-container" style="width: 500px; height: 500px; position: relative; overflow: auto;">
    <h1 style="color: #333; margin-top: 10px; margin-bottom: 10px; border-bottom: 0px;">Property view with Accordion</h1>
    <Accordion v-model="accordionOpen" :items="accordionItems" :auto-fold="true">
        <template #icon="{ open }">
            <i :class="open ? 'icon-arrow3' : 'icon-arrow1'"></i>
        </template>
        <template #content-0>
            <div class="property">
                <Property :items="propertyItems" @change="onChange" />
            </div>
        </template>
        <template #content-1>
            <div class="property">
                <Property :items="propertyItems" @change="onChange" />
            </div>
        </template>
        <template #content-2>
            <div class="property">
                <Property :items="propertyItems" @change="onChange" />
            </div>
        </template>
    </Accordion>
</div>
</template>
