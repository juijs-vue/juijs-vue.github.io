<script setup lang="ts">
// @ts-nocheck
import { reactive } from "vue"

const rows = reactive([
    { id: 1, data: { name: "Hong", age: "20", location: "Ilsan" } },
    { id: 2, data: { name: "Jung", age: "30", location: "Seoul" } },
    { id: 3, data: { name: "Park", age: "15", location: "Yeosu" } },
    { id: 4, data: { name: "Kang", age: "32", location: "Seoul" } },
    { id: 5, data: { name: "Song", age: "12", location: "Gwangju" } },
    { id: 6, data: { name: "Yoon", age: "22", location: "Damyang" } },
    { id: 7, data: { name: "Kim", age: "33", location: "Busan" } },
    { id: 8, data: { name: "Hwang", age: "21", location: "Seoul" } }
])

function removeRow() {
    // The legacy code calls table_11.remove(1) which removes the row at index 1
    if (rows.length > 1) {
        rows.splice(1, 1)
    }
}
</script>

<template>
<button class="btn small" @click="removeRow">
    <i class="icon-play"></i> Run
</button>

<div class="jui-grid-vue-root theme-classic">
<table id="table_11" class="table classic" style="margin-top: 7px; position: relative;">
    <thead>
    <tr>
        <th width="50px">No</th>
        <th>Name</th>
        <th>Age</th>
        <th>Location</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(row, index) in rows" :key="row.id">
        <td>{{ index }}</td>
        <td>{{ row.data.name }}</td>
        <td>{{ row.data.age }}</td>
        <td>{{ row.data.location }}</td>
    </tr>
    </tbody>
</table>
</div>
</template>
