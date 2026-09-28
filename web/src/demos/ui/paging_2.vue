<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const grid = ref(null)
const pagingRef = ref(null)
const rows = ref([])

const columns = [
    { key: 'name', label: 'Name', sortable: true, resizable: true },
    { key: 'age', label: 'Age', sortable: true, resizable: true },
    { key: 'location', label: 'Location', sortable: true, resizable: true }
]

function submit() {
    const result = []
    for (let i = 0; i < 1000000; i++) {
        result.push({
            id: i,
            data: {
                name: "Alvin" + i,
                age: Math.floor(Math.random() * 100) + 1,
                location: "LA"
            }
        })
    }
    rows.value = result
    pagingRef.value?.reload(result.length)
}

function onPage(pNo) {
    grid.value?.goToPage(pNo)
}

function onSort() {
    pagingRef.value?.first()
}
</script>

<template>
<button class="btn small" @click="submit">
    <i class="icon-play"></i> Run
</button>

<VirtualGrid
    ref="grid"
    :columns="columns"
    :rows="rows"
    mode="paging"
    :page-size="100"
    sortable
    resizable
    :sort-loading="true"
    :show-pager="false"
    :scroll-height="230"
    style="margin-top: 7px;"
    @sort="onSort"
/>

<div style="margin-top: 3px;">
    <Paging ref="pagingRef" :count="rows.length" :page-count="100" @page="onPage" />
</div>
</template>
