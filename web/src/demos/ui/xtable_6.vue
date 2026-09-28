<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const columns = [
    { key: 'name', label: 'Name' },
    { key: 'age', label: 'Age' },
    { key: 'location', label: 'Location' }
]

const rows = ref([])

function onRun() {
    const result = []
    for(let i = 0; i < 1000000; i++) {
        result.push({ id: i, data: { name: "Alvin" + i, age: Math.floor(Math.random() * 100) + 1, location: "LA" } })
    }
    rows.value = result
}
</script>

<template>
<button class="btn small" @click="onRun">
	<i class="icon-play"></i> Run
</button>

<VirtualGrid
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
/>
</template>
