<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const visible = ref(false)
</script>

<template>
<button class="btn" @click="visible = true">
    <i class="icon-play"></i> Run
</button>

<Window v-model="visible" title="HOME" :width="500" :height="300" modal>
    <p>Contents...</p>
    <template #foot="{ hide }">
        <a href="#" class="btn focus" @click.prevent="hide">Save</a> <a href="#" class="btn" @click.prevent="hide">Close</a>
    </template>
</Window>
</template>
