<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const dd3 = ref(false)

function onDd3Change(data) {
    alert(data.value + ", " + data.text)
}
</script>

<template>
<div class="navbar" style="overflow: hidden;">
    <div class="inline-right">
        <a class="btn small" @click="dd3 = true">Menu List <i class="icon-arrow1"></i></a> <Dropdown v-model="dd3" :keydown="true" anchor :width="120" style="margin-left: -15px; margin-top: 10px;" @change="onDd3Change">
            <li value="1">Dropdown 1</li>
            <li value="2">Dropdown 2</li>
            <li value="3">Dropdown 3</li>
            <li value="4">Dropdown 4</li>
        </Dropdown>
    </div>
</div>
</template>
