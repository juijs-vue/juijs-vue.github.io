<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const visible = ref(false)
</script>

<template>
<button class="btn" @click="visible = true">
    <i class="icon-play"></i> Run
</button>

<div v-if="visible" class="msgbox detail" style="width: 350px; height: 150px; left: 50%; top: 175px;">
    <div class="head">
        [Title] Detail Message
        <div class="subtext">2014.02.25 17:18:38</div>
        <a href="#" class="close" @click.prevent="visible = false"><i class="icon-exit"></i></a>
    </div>
    <div class="body">
        Contents...<br>
    </div>
</div>
</template>
