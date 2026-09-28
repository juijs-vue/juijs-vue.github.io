<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const columns = [
    { key: 'name', label: 'Name', sortable: true, resizable: true },
    { key: 'age', label: 'Age', resizable: true },
    { key: 'location', label: 'Location', sortable: true, resizable: true }
]

const rows = ref([])

function onSubmit() {
    const result = []
    for (let i = 0; i < 1000000; i++) {
        result.push({
            id: i,
            data: {
                name: "Alvin" + i,
                age: Math.floor(Math.random() * 100) + 1,
                location: "LA"
            }
        })
    }
    rows.value = result
}
</script>

<template>
<button class="btn small" @click="onSubmit">
    <i class="icon-play"></i> Run
</button>

<VirtualGrid
    :columns="columns"
    :rows="rows"
    mode="virtual"
    :row-height="26"
    :height="300"
    sortable
    resizable
    theme="classic"
    variant="simple"
    headline
    :sort-loading="true"
    style="margin-top: 7px;"
>
    <template #empty>Data does not exist.</template>
</VirtualGrid>
</template>
