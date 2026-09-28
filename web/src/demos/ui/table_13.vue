<script setup lang="ts">
// @ts-nocheck
import { reactive } from "vue"

const columns = [
    { key: 'name', label: 'Name' },
    { key: 'age', label: 'Age' },
    { key: 'location', label: 'Location' }
];

const rows = reactive([
    { id: 1, data: { name: "Hong", age: "20", location: "Ilsan" } },
    { id: 2, data: { name: "Jung", age: "30", location: "Seoul" } },
    { id: 3, data: { name: "Park", age: "15", location: "Yeosu" } }
]);

function submit() {
    const newRows = [];
    const nStart = new Date().getTime();

    for (let i = 0; i < 100; i++) {
        newRows.push({
            id: rows.length + i + 1,
            data: { name: `Alvin${i}`, age: i, location: "LA" }
        });
    }

    rows.splice(1, 0, ...newRows);
    const nEnd = new Date().getTime();

    alert(`Running time : ${nEnd - nStart}ms`);
}
</script>

<template>
<button class="btn small" @click="submit">
    <i class="icon-play"></i> Run
</button>

<DataGrid
    :columns="columns"
    :rows="rows"
    resizable
    :scroll-height="200"
    class="grid-13"
    style="margin-top: 7px;"
/>
</template>
