<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const selected = ref(null)

function onSelect(formatted, date) {
    alert(formatted)
}
</script>

<template>
<Datepicker
    v-model="selected"
    type="yearly"
    size="large"
    title-format="yyyy"
    format="yyyy"
    @select="onSelect"
/>
</template>
