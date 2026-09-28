<script setup lang="ts">
// @ts-nocheck
import { reactive } from "vue"

const columns = [
    { key: 'name', label: 'Name', editable: true, resizable: true },
    { key: 'age', label: 'Age', editable: true, resizable: true },
    { key: 'location', label: 'Location', editable: true, resizable: true }
]

const rows = reactive([
    { id: 1, data: { name: "Hong", age: 20, location: "Ilsan" } },
    { id: 2, data: { name: "Jung", age: 30, location: "Seoul" } },
    { id: 3, data: { name: "Park", age: 15, location: "Yeosu" } },
    { id: 4, data: { name: "Kang", age: 32, location: "Seoul" } },
    { id: 5, data: { name: "Song", age: 12, location: "Gwangju" } },
    { id: 6, data: { name: "Yoon", age: 22, location: "Damyang" } },
    { id: 7, data: { name: "Kim", age: 33, location: "Busan" } },
    { id: 8, data: { name: "Hwang", age: 21, location: "Seoul" } }
])

const locations = ["Ilsan", "Seoul", "Yeosu", "Gwangju", "Damyang", "Busan"]
</script>

<template>
<section>
    <h2>Editable rows with per-column editors</h2>
    <p>
        Double-click any row to edit it. Name uses the grid's default text input, Age uses
        a number input, and Location uses a dropdown - each supplied through the
        <code>#edit-{column.key}</code> slot instead of being limited to one input type.
    </p>
    <p class="br"></p>

    <DataGrid :columns="columns" :rows="rows" editable sortable resizable theme="classic" variant="simple" headline>
        <template #edit-age="{ draft, commit }">
            <input type="number" class="edit" style="width: 100%;" v-model="draft.age" @keyup.enter="commit" @blur="commit" />
        </template>
        <template #edit-location="{ draft, commit }">
            <select class="edit" style="width: 100%;" v-model="draft.location" @change="commit" @keyup.enter="commit">
                <option v-for="loc in locations" :key="loc" :value="loc">{{ loc }}</option>
            </select>
        </template>
    </DataGrid>
</section>
</template>
