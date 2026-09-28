<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const value = ref(400)

function runValue() {
    value.value = 700
}
</script>

<template>
<div class="row">
    <div class="col col-4">
        <Progress v-model="value" min="0" max="700" />
    </div>
    <div class="col col-8" style="padding-left: 15px;">
        <button class="btn small" @click="runValue()">
            <i class="icon-play"></i> Run
        </button>
    </div>
</div>
</template>
