<script setup lang="ts">
// @ts-nocheck
// Native Vue3 port of gallery/svgpen (legacy jQuery-free, pure jui.chart demo, still at
// gallery/svgpen/index.html on `main`) - an SVG path drawing tool (reference:
// http://editor.method.ac/): a "pointer" mode to select/reshape a drawn path's own vertices via
// draggable handles, a "pen" mode for freehand drawing, and a "move" mode that shows resize
// handles around a clicked item (dragging them was never implemented in the original either - see
// svgpen/modeMove.ts's own header comment).
//
// The bespoke drawing engine (~1000 reachable lines across util/PathParser.js + 5 of its 7
// widget/*.js files) is ported into svgpen/*.ts and registered as a LOCAL "drawing.canvas" widget
// (see drawingCanvasWidget.ts's own header comment) - same precedent as gallery/gps's "radar"/
// "compass" widgets. `drawing.mode.pen2.js` (340 lines, a bezier curve pen tool) and
// `drawing.mode.shape.js` (113 lines) are genuinely NOT ported: their own toolbar buttons are
// HTML-commented-out in the legacy index.html itself (`<!-- <a ... data-mode="pen2">... -->`) and
// nothing else anywhere ever activates them - confirmed dead/unreachable code, not a shortcut.
import { ref } from "vue"
import { Chart } from "jui-chart-vue"
import "./svgpen/drawingCanvasWidget"

const canvasRef = ref<InstanceType<typeof Chart> | null>(null)
const menuOpen = ref(false)
const activeMode = ref("pointer")

function setMode(mode: string) {
    activeMode.value = mode
    canvasRef.value?.getBuilder?.()?.emit("drawing.canvas.change.mode", [mode])
}
</script>

<template>
    <div class="svgpen">
        <div class="drawing-menu">
            <ul class="drawing-menu-bar">
                <li class="menu-item" style="position: relative">
                    <a class="menu-item-link" @click="menuOpen = !menuOpen">JUI</a>
                    <Dropdown v-model="menuOpen" :items="[{ text: 'About Drawing Tool', value: 1 }]" size="large" :width="150" />
                </li>
                <li class="menu-item">File</li>
                <li class="menu-item">Edit</li>
                <li class="menu-item">Object</li>
                <li class="menu-item">View</li>
            </ul>
        </div>
        <div class="drawing-left-toolbar">
            <div class="buttons">
                <a class="drawing-btn" :class="{ select: activeMode === 'pointer' }" @click="setMode('pointer')"><i class="icon-arrow4 white"></i></a>
                <a class="drawing-btn" :class="{ select: activeMode === 'pen' }" @click="setMode('pen')"><i class="icon-edit white"></i></a>
                <a class="drawing-btn" :class="{ select: activeMode === 'move' }" @click="setMode('move')"><i class="icon-minus white"></i></a>
            </div>
        </div>
        <div class="drawing-right-toolbar">
            <div class="toolbar-row">
                <div class="toolbar-item">
                    <small>width</small>
                    <div>560</div>
                </div>
                <div class="toolbar-item">
                    <small>height</small>
                    <div>480</div>
                </div>
            </div>
        </div>
        <div class="drawing-bottom-toolbar">reference by http://editor.method.ac/</div>
        <div class="drawing-canvas">
            <div class="drawing-root">
                <!-- `:height="920"` (a real number), not "100%": `.drawing-canvas`'s own height
                     comes from absolute-positioning offsets (top/bottom against `.svgpen`'s fixed
                     1000px), not a literal CSS `height` - a "100%" Chart height doesn't reliably
                     cascade all the way through that chain to the underlying SVG element (measured:
                     it collapses to ~150px instead of the real 920px). Matches the same explicit-
                     pixel-height convention every other chart in this whole migration already uses. -->
                <Chart ref="canvasRef" width="100%" :height="920" :padding="0" :widget="[{ type: 'drawing.canvas' }]" :style="{ backgroundColor: 'transparent' }" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.svgpen {
    position: relative;
    /* Legacy's own height came from the gallery iframe's fixed height (package.json's own
       "height": "1000px") - every child here is position:absolute against this root instead of
       the legacy's own position:fixed-against-the-whole-viewport, so it still needs one. */
    height: 1000px;
    background-color: #2f2f2f;
    color: white;
    overflow: hidden;
}
.drawing-menu {
    padding-left: 30px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 30px;
}
.drawing-menu-bar {
    margin: 0;
    padding: 0;
    position: relative;
    list-style: none;
}
.drawing-menu-bar .menu-item {
    position: relative;
    display: inline-block;
    padding: 5px 10px;
    cursor: pointer;
}
.menu-item-link {
    cursor: pointer;
}
.drawing-left-toolbar {
    position: absolute;
    top: 30px;
    left: 0;
    width: 50px;
    bottom: 0;
}
.drawing-right-toolbar {
    position: absolute;
    top: 30px;
    right: 0;
    width: 175px;
    bottom: 0;
    padding: 10px;
    padding-top: 0;
    box-sizing: border-box;
}
.toolbar-row {
    display: flex;
}
.toolbar-item {
    flex: 1;
    border-radius: 3px;
    background: #3f3f3f;
    padding: 0 5px;
    margin-left: 2px;
    margin-right: 2px;
}
.toolbar-item div {
    background: transparent;
    font: 24px/normal sans-serif;
    color: #4f80ff;
    text-align: center;
    padding: 10px 0 16px;
    width: 100%;
    height: 24px;
    position: relative;
    z-index: 2;
}
.drawing-bottom-toolbar {
    position: absolute;
    left: 50px;
    right: 0;
    height: 50px;
    bottom: 0;
}
.drawing-canvas {
    position: absolute;
    top: 30px;
    left: 50px;
    right: 175px;
    bottom: 50px;
    background-color: #444;
}
.drawing-root {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #3f3f3f;
}
.drawing-btn {
    display: inline-block;
    height: 27px;
    width: 27px;
    border: solid #2f2f2c 8px;
    border-left-width: 13px;
    margin: 0;
    cursor: pointer;
    font-size: 27px;
}
.drawing-btn.select {
    color: cyan;
}
</style>
