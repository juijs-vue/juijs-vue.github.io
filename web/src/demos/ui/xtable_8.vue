<script setup lang="ts">
// @ts-nocheck
import { onMounted, ref } from "vue"

const columns = [
    { key: 'url', label: 'URL', width: 394 },
    { key: 'count', label: 'Count' }
]

const grid = ref(null)

// Build tree structure from flat index-based data
const treeData = [
    { index: "0", type: "open", data: { url: "/", count: 105 } },
    { index: "0.0", type: "fold", data: { url: "/css", count: 35 } },
    { index: "0.0.0", type: "fold", data: { url: "/index.css", count: 15 } },
    { index: "0.0.1", type: "fold", data: { url: "/layout.css", count: 15 } },
    { index: "0.0.2", type: "fold", data: { url: "/login.css", count: 5 } },
    { index: "0.1", type: "fold", data: { url: "/js", count: 35 } },
    { index: "0.1.0", type: "fold", data: { url: "/index.js", count: 23 } },
    { index: "0.1.1", type: "fold", data: { url: "/jquery.js", count: 12 } },
    { index: "0.2", type: "fold", data: { url: "/img", count: 0 } },
    { index: "0.2.0", type: "fold", data: { url: "logo.ico", count: 0 } },
    { index: "0.3", type: "fold", data: { url: "/main.jsp", count: 10 } },
    { index: "0.4", type: "fold", data: { url: "/login.jsp", count: 10 } },
    { index: "0.5", type: "fold", data: { url: "/sitemap.xml", count: 10 } },
    { index: "0.6", type: "fold", data: { url: "/package.json", count: 5 } }
]

// Convert to GridRow tree structure
const rowsById = {}
const result = []

// First pass: create all rows
treeData.forEach(item => {
    rowsById[item.index] = {
        id: item.index,
        data: item.data,
        children: []
    }
})

// Second pass: build hierarchy
treeData.forEach(item => {
    const parts = item.index.split('.')
    if(parts.length === 1) {
        result.push(rowsById[item.index])
    } else {
        const parentIndex = parts.slice(0, -1).join('.')
        if(rowsById[parentIndex]) {
            rowsById[parentIndex].children.push(rowsById[item.index])
        }
    }
})

const rows = ref(result)

function onRowClick(row) {
    if(row.children && row.children.length > 0) {
        grid.value?.toggle(row.id)
    }
}

onMounted(() => {
    grid.value?.open('0')
})
</script>

<template>
<VirtualGrid
  ref="grid"
  :columns="columns"
  :rows="rows"
  mode="virtual"
  :row-height="26"
  :height="300"
  resizable
  theme="classic"
  variant="simple"
  headline
  style="margin-top: 7px;"
  @row-click="onRowClick"
>
    <template #empty>Data does not exist.</template>
    <template #tree-toggle="{ expanded }">
        <i :class="expanded ? 'icon-right' : 'icon-left'"></i>
    </template>
</VirtualGrid>
</template>
