<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const checked = ref(false)

function toggle() {
    checked.value = !checked.value
}
</script>

<template>
<div class="row">
    <div class="col" style="width: 90px;">
        <Switch v-model="checked" inner />
    </div>
    <div class="col">
        <button class="btn small" @click="toggle" style="width: 70px;">
            <i class="icon-play"></i> Run
        </button>
    </div>
</div>
</template>
