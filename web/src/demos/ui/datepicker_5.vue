<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const selected = ref(null)
const minDate = new Date(new Date().setDate(new Date().getDate() - 5))
const maxDate = new Date(new Date().setDate(new Date().getDate() + 5))

function onSelect(formatted, date) {
    alert(formatted)
}
</script>

<template>
<Datepicker
    v-model="selected"
    title-format="yyyy. MM"
    format="yyyy-MM-dd"
    :min-date="minDate"
    :max-date="maxDate"
    @select="onSelect"
/>
</template>
