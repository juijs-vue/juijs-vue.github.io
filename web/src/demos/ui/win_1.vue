<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const visible = ref(false)
</script>

<template>
<button class="btn" @click="visible = true">
    <i class="icon-play"></i> Run
</button>

<Window v-model="visible" title="HOME" :width="500" :height="300" :left="'30%'" :top="200" :move="true" :resize="true">
    <template #actions>
        <a href="javascript:alert('plus');"><i class="icon-plus"></i></a>
        <a href="javascript:alert('search');"><i class="icon-search"></i></a>
    </template>
    <p>Contents...</p>
</Window>
</template>
