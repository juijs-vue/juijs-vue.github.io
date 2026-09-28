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
<!-- jui-grid-vue's own CSS (table.less/table.theme.less) is entirely scoped under
     .jui-grid-vue-root (the <DataGrid> component's own wrapper class) - it never applies to a
     bare .table element. For a plain static table like this one (production's own DOM has no
     wrapper at all around <table>), using the full <DataGrid> component would add several extra
     wrapper divs/colgroup/scroll-container that production doesn't have. This minimal wrapper
     just activates the CSS scope without any of that. -->
<div class="jui-grid-vue-root theme-classic">
<table id="table_1" class="table classic">
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
</template>
