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
    type="monthly"
    size="large"
    title-format="yyyy"
    format="yyyy/MM"
    @select="onSelect"
/>
</template>
