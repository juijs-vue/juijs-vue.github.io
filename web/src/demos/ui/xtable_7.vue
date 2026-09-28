<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const columns = [
    { key: 'name', label: 'Name' },
    { key: 'age', label: 'Age' },
    { key: 'location', label: 'Location', sortable: false }
]

const rows = ref([])
const grid = ref(null)

function onRun() {
    const result = []
    for(let i = 0; i < 100000; i++) {
        result.push({ id: i, data: { name: "Alvin" + i, age: Math.floor(Math.random() * 100) + 1, location: "LA" } })
    }

    // Append children to specific rows
    result[0].children = [{ id: "0.0", data: { name: "Alvin0.0", age: 15, location: "LA" } }]
    result[2].children = [
        { id: "2.0", data: { name: "Alvin2.0", age: 20, location: "LA" }, children: [
            { id: "2.0.0", data: { name: "Alvin2.0.0", age: 30, location: "LA" } }
        ] }
    ]
    result[4].children = [
        { id: "4.0", data: { name: "Alvin4.0", age: 25, location: "LA" } },
        { id: "4.1", data: { name: "Alvin4.1", age: 27, location: "LA" } }
    ]
    result[7].children = [
        { id: "7.0", data: { name: "Alvin7.0", age: 27, location: "LA" }, children: [
            { id: "7.0.0", data: { name: "Alvin7.0.0", age: 23, location: "LA" } },
            { id: "7.0.1", data: { name: "Alvin7.0.1", age: 22, location: "LA" } }
        ] }
    ]

    rows.value = result
}

function onRowClick(row) {
    if(row.children && row.children.length > 0) {
        grid.value?.toggle(row.id)
    }
}
</script>

<template>
<button class="btn small" @click="onRun">
	<i class="icon-play"></i> Run
</button>

<VirtualGrid
  ref="grid"
  :columns="columns"
  :rows="rows"
  mode="virtual"
  :row-height="26"
  :height="400"
  sortable
  resizable
  theme="classic"
  :width="800"
  style="width: 600px; display: block; margin-top: 7px;"
  @row-click="onRowClick"
/>
</template>
