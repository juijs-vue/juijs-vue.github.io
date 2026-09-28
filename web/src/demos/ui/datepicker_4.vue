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
    variant="calendar"
    title-format="yyyy. MM"
    format="yyyy-MM-dd"
    style="height: 550px;"
    @select="onSelect"
>
    <template #cell="{ type, no, day }">
        <span v-if="type !== 'none'" :style="{ color: day === 0 ? 'red' : day === 6 ? 'blue' : undefined }">{{ no }}</span>
    </template>
</Datepicker>
</template>
