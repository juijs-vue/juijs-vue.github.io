<script setup lang="ts">
// @ts-nocheck
import { reactive } from "vue"

const columns = [
    { key: 'name', label: 'Name', visible: true },
    { key: 'age', label: 'Age', visible: true },
    { key: 'location', label: 'Location', visible: false }
];

const rows = reactive([
    { id: 1, data: { name: "Hong", age: "20", location: "Ilsan" } },
    { id: 2, data: { name: "Jung", age: "30", location: "Seoul" } },
    { id: 3, data: { name: "Park", age: "15", location: "Yeosu" } }
]);
</script>

<template>
<DataGrid
    :columns="columns"
    :rows="rows"
    sortable
    resizable
    column-menu
    variant="simple"
    headline
/>
</template>
