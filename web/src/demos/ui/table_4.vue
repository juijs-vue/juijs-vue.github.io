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
<div style="max-height: 181px; overflow: auto; position: relative;">
<table id="table_4" class="table classic borderless has-scroll">
    <thead>
        <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Location</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="row in data" :key="row.name">
            <td>{{ row.name }}</td>
            <td>{{ row.age }}</td>
            <td>{{ row.location }}</td>
        </tr>
    </tbody>
</table>
</div>
</div>
</template>
