<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const grid = ref(null)
let page = 1

const columns = [
    { key: 'name', label: 'Name', sortable: true, resizable: true },
    { key: 'age', label: 'Age', sortable: true, resizable: true },
    { key: 'location', label: 'Location', sortable: true, resizable: true }
]

const rows = ref([])

function onPage(no) {
    page += no
    page = (page < 1) ? 1 : page
    grid.value?.goToPage(page)
}

function onSubmit() {
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
    page = 1
    rows.value = result
}
</script>

<template>
<button class="btn small" @click="onSubmit">
    <i class="icon-play"></i> Run
</button>

<VirtualGrid
    ref="grid"
    :columns="columns"
    :rows="rows"
    mode="paging"
    :page-size="20"
    sortable
    resizable
    theme="classic"
    variant="simple"
    headline
    :show-pager="false"
    style="margin-top: 7px;"
>
    <template #empty>Data does not exist.</template>
</VirtualGrid>

<div class="row" align="right" style="text-align: right; margin-top: 3px;">
    <div class="group">
        <button @click="onPage(-1)" class="btn mini">Prev</button>
        <button @click="onPage(1)" class="btn mini">Next</button>
    </div>
</div>
</template>
