<script setup lang="ts">
// @ts-nocheck
import { reactive, ref } from "vue"

const grid = ref(null);

const columns = [
    { key: 'name', label: 'Name' },
    { key: 'age', label: 'Age' },
    { key: 'location', label: 'Location' }
];

const rows = reactive([
    { id: 1, data: { name: "Hong", age: "20", location: "Ilsan" } },
    { id: 2, data: { name: "Jung", age: "30", location: "Seoul" } },
    { id: 3, data: { name: "Park", age: "15", location: "Yeosu" } },
    { id: 4, data: { name: "Kang", age: "32", location: "Seoul" } },
    { id: 5, data: { name: "Song", age: "12", location: "Gwangju" } },
    { id: 6, data: { name: "Yoon", age: "22", location: "Damyang" } },
    { id: 7, data: { name: "Kim", age: "33", location: "Busan" } },
    { id: 8, data: { name: "Hwang", age: "21", location: "Seoul" } }
]);

// beforeId는 드래그한 행이 들어갈 자리의 "바로 앞에 남는 행"의 id다(끝으로 옮기면
// undefined) - 원본의 index 기반 move(y,c)를 id 기준으로 그대로 옮긴 것.
function onRowMove(fromId, beforeId) {
    if (!confirm("Do you want to change the row position?")) {
        return;
    }

    const fromIndex = rows.findIndex((r) => r.id === fromId);
    if (fromIndex === -1) return;

    const [moved] = rows.splice(fromIndex, 1);
    const toIndex = beforeId == null ? -1 : rows.findIndex((r) => r.id === beforeId);
    if (toIndex === -1) rows.push(moved);
    else rows.splice(toIndex, 0, moved);

    console.log("Completed.");
}
</script>

<template>
<DataGrid
    ref="grid"
    :columns="columns"
    :rows="rows"
    draggable
    :drag-handle="false"
    @row-move="onRowMove"
/>
</template>
