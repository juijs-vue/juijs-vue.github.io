<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const data = [
    { name: "Hong", age: "20", location: "Ilsan" },
    { name: "Jung", age: "30", location: "Seoul" },
    { name: "Park", age: "15", location: "Yeosu" },
    { name: "Kang", age: "32", location: "Seoul" },
    { name: "Song", age: "12", location: "Gwangju" },
    { name: "Yoon", age: "22", location: "Damyang" },
    { name: "Kim", age: "33", location: "Busan" },
    { name: "Hwang", age: "21", location: "Seoul" }
]

const checkedRows = ref([]);

function toggleRow(name) {
    const index = checkedRows.value.indexOf(name);
    if (index > -1) {
        checkedRows.value.splice(index, 1);
    } else {
        checkedRows.value.push(name);
    }
}

function showCheckedCount() {
    alert(checkedRows.value.length);
}
</script>

<template>
<button class="btn small" @click="showCheckedCount">
    <i class="icon-play"></i> Run
</button>

<div class="jui-grid-vue-root theme-classic" style="margin-top: 7px;">
<table id="table_5" class="table simple">
    <thead>
        <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Location</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="row in data" :key="row.name" :class="{ checked: checkedRows.includes(row.name) }" style="cursor: pointer;" @click="toggleRow(row.name)">
            <td>{{ row.name }}</td>
            <td>{{ row.age }}</td>
            <td>{{ row.location }}</td>
        </tr>
    </tbody>
</table>
</div>
</template>
