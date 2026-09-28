<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const dd4 = ref(false)
const dd4Items = ref([
    { value: 1, text: "text1" },
    { value: 2, text: "text2" },
    { value: 3, text: "text3" }
])

function onDd4Change(data) {
    alert(data.value + ", " + data.text)
}

function dd4Update() {
    dd4Items.value = [
        { value: 4, text: "text4" },
        { value: 5, text: "text5" },
        { value: 6, text: "text6" }
    ]
}
</script>

<template>
<div class="navbar" style="overflow: hidden;">
    <div class="inline right">
        <a class="btn small" @click="dd4Update()">Update</a> <a class="btn small" @click="dd4 = true">Menu List <i class="icon-arrow1"></i></a> <Dropdown v-model="dd4" anchor :anchor-left="100" :width="120" style="margin-top: 10px;" :items="dd4Items" @change="onDd4Change" />
    </div>
</div>
</template>
