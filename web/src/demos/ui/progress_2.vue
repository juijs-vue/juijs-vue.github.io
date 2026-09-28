<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const value = ref(400)

function runValue() {
    value.value = 650
}
</script>

<template>
<div class="row">
    <div class="col" style="width: 40px;">
        <Progress v-model="value" min="0" max="700" orient="vertical" style="height: 200px;" />
    </div>
    <div class="col">
        <button class="btn small" @click="runValue()" style="width: 70px;">
            <i class="icon-play"></i> Run
        </button>
    </div>
</div>
</template>
