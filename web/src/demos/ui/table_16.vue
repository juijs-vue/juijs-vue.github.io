<script setup lang="ts">
// @ts-nocheck
import { reactive } from "vue"

const columns = [
    { key: 'name', label: 'Name' },
    { key: 'age', label: 'Age' }
];

const rows = reactive([]);

function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const csv = event.target.result;
        const lines = csv.split('\n').filter(line => line.trim());

        rows.length = 0; // Clear existing rows
        lines.forEach((line, idx) => {
            const parts = line.split(',').map(p => p.trim());
            if (parts.length >= 2) {
                rows.push({
                    id: idx + 1,
                    data: { name: parts[0], age: parts[1] }
                });
            }
        });
    };
    reader.readAsText(file);
}
</script>

<template>
<input type="file" @change="handleFileChange" />

<DataGrid
    :columns="columns"
    :rows="rows"
    sortable
    resizable
    variant="simple"
    headline
    style="margin-top: 7px;"
/>
</template>
