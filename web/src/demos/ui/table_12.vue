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

function appendRows() {
    const nStart = new Date().getTime()
    let nextId = Math.max(...rows.map(r => r.id)) + 1

    for (let i = 0; i < 1000; i++) {
        rows.push({
            id: nextId++,
            data: { name: "Alvin" + i, age: i, location: "LA" }
        })
    }

    const nEnd = new Date().getTime()
    alert("Running time : " + (nEnd - nStart) + "ms")
}
</script>

<template>
<button class="btn small" @click="appendRows">
    <i class="icon-play"></i> Run
</button>

<div class="jui-grid-vue-root theme-classic">
<div style="max-height: 230px; overflow: auto; position: relative; margin-top: 7px;">
<table id="table_12" class="table classic has-scroll">
    <thead>
    <tr>
        <th>No<div class="resize" style="position: absolute; width: 8px; height: 30px; left: 136px; top: 0px; cursor: w-resize; z-index: 1;"></div></th>
        <th>Name<div class="resize" style="position: absolute; width: 8px; height: 30px; left: 272.5px; top: 0px; cursor: w-resize; z-index: 1;"></div></th>
        <th>Age<div class="resize" style="position: absolute; width: 8px; height: 30px; left: 409px; top: 0px; cursor: w-resize; z-index: 1;"></div></th>
        <th>Location</th>
    </tr>
    </thead>
    <tbody><tr v-for="(row, index) in rows" :key="row.id">
        <td>{{ index }}</td>
        <td>{{ row.data.name }}</td>
        <td>{{ row.data.age }}</td>
        <td>{{ row.data.location }}</td>
    </tr></tbody>
</table>
</div>
</div>
</template>
