<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const leftSize = ref(100)
const rightSize = ref(100)
</script>

<template>
<div style="border: 1px solid #dcdcdc; position: relative; height: 398px;">
    <Layout
        v-model:left-size="leftSize"
        v-model:right-size="rightSize"
        :left-min="100"
        :left-max="300"
        :right-min="100"
        :right-max="300"
    >
        <template #left>
            <div class="title">Left</div>
        </template>
        <template #center>
            <div class="title">Center</div>
        </template>
        <template #right>
            <div class="title">Right</div>
        </template>
    </Layout>
</div>
</template>
