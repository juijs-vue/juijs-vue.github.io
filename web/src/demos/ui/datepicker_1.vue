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
    title-format="yyyy. MM"
    format="yyyy/MM/dd"
    @select="onSelect"
/>
</template>
