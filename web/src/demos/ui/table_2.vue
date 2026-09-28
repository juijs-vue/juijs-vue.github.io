<script setup lang="ts">
// @ts-nocheck
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
</script>

<template>
<div class="jui-grid-vue-root theme-classic">
<table id="table_2" class="table simple stripeless">
    <thead>
        <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Location</th>
        </tr>
    </thead>
    <tbody>
        <template v-for="(row, index) in data" :key="index">
            <tr>
                <td>{{ row.name }}</td>
                <td>{{ row.age }}</td>
                <td v-if="index % 2 === 0" :rowspan="2">{{ row.location }}</td>
            </tr>
        </template>
    </tbody>
</table>
</div>
</template>
