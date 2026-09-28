<script setup lang="ts">
// @ts-nocheck
import { reactive, ref } from "vue"

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

// 원본(sort: ["name", 1, 2])은 Name/Age/Location 전부 정렬 가능하고, 처음 클릭은 desc부터
// 시작해서 다시 클릭할 때마다 asc/desc를 토글한다(정렬 안 된 상태로는 안 돌아간다).
const sortField = ref(null)
const sortOrder = ref(null) // 'asc' | 'desc'

function compare(a, b) {
    const na = Number(a)
    const nb = Number(b)
    if (a !== "" && b !== "" && !isNaN(na) && !isNaN(nb)) return na - nb
    return String(a).localeCompare(String(b))
}

function sortBy(field) {
    sortOrder.value = sortField.value === field && sortOrder.value === "desc" ? "asc" : "desc"
    sortField.value = field

    rows.sort((a, b) => {
        const cmp = compare(a.data[field], b.data[field])
        return sortOrder.value === "asc" ? cmp : -cmp
    })
}
</script>

<template>
<div class="jui-grid-vue-root theme-classic">
<div style="max-height: 181px; overflow: auto; position: relative;">
<table id="table_7" class="table classic stripeless has-scroll">
    <thead>
    <tr>
        <th style="cursor: pointer;" @click="sortBy('name')">Name<i v-if="sortField === 'name'" :class="sortOrder === 'asc' ? 'icon-arrow3' : 'icon-arrow1'"></i><div class="resize" style="position: absolute; width: 8px; height: 28px; left: 181px; top: 0px; cursor: w-resize; z-index: 1;"></div></th>
        <th style="cursor: pointer;" @click="sortBy('age')">Age<i v-if="sortField === 'age'" :class="sortOrder === 'asc' ? 'icon-arrow3' : 'icon-arrow1'"></i><div class="resize" style="position: absolute; width: 8px; height: 28px; left: 363px; top: 0px; cursor: w-resize; z-index: 1;"></div></th>
        <th style="cursor: pointer;" @click="sortBy('location')">Location<i v-if="sortField === 'location'" :class="sortOrder === 'asc' ? 'icon-arrow3' : 'icon-arrow1'"></i></th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="row in rows" :key="row.id">
        <td>{{ row.data.name }}</td>
        <td>{{ row.data.age }}</td>
        <td>{{ row.data.location }}</td>
    </tr>
    </tbody>
</table>
</div>
</div>
</template>
