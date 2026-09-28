<script setup lang="ts">
// @ts-nocheck
import { onBeforeUnmount, onMounted, reactive, ref } from "vue"

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

// ---- right-click row menu (원본: rowmenu 이벤트가 select()+dd.move()+dd.show()를 호출.
// 위치는 우클릭한 td 자신의, table을 기준으로 한 상대 좌표(jQuery .position())다) ----
const selectedId = ref(null)
const dropdownStyle = ref({ display: "none" })

function showMenu(e, row) {
    selectedId.value = row.id
    const td = e.target.closest("td")
    dropdownStyle.value = {
        display: "block",
        position: "absolute",
        left: td.offsetLeft + "px",
        top: td.offsetTop + "px"
    }
}
function hideMenu() {
    dropdownStyle.value = { display: "none" }
}
function unselect() {
    selectedId.value = null
    hideMenu()
}

// ---- row edit (원본: editRow: [1,2,3] - No를 뺀 name/age/location 전부. "Edit" 메뉴를
// 눌러야만 들어가고(더블클릭 트리거 없음 - editEvent:false), Enter로 셋 다 한번에 커밋) ----
const editingId = ref(null)
const draft = reactive({ name: "", age: "", location: "" })

function startEditSelected() {
    if (selectedId.value === null) return
    const row = rows.find(r => r.id === selectedId.value)
    editingId.value = row.id
    draft.name = row.data.name
    draft.age = row.data.age
    draft.location = row.data.location
    unselect()
}
function isEditingRow(row) {
    return editingId.value === row.id
}
function commitEdit(row) {
    row.data.name = draft.name
    row.data.age = draft.age
    row.data.location = draft.location
    editingId.value = null
}

function onMenuSelect(index) {
    if (index === 0) startEditSelected()
    else unselect()
}

function onDocClick(e) {
    if (!e.target.closest("#table_9_dd")) hideMenu()
}
onMounted(() => document.addEventListener("click", onDocClick))
onBeforeUnmount(() => document.removeEventListener("click", onDocClick))
</script>

<template>
<div class="jui-grid-vue-root theme-classic">
<table id="table_9" class="table simple headline" style="position: relative;">
    <thead>
    <tr>
        <th width="50px">No</th>
        <th>Name</th>
        <th>Age</th>
        <th>Location</th>
    </tr>
    </thead>
    <tbody><tr v-for="(row, index) in rows" :key="row.id" :class="{ selected: selectedId === row.id }" @contextmenu.prevent="showMenu($event, row)">
        <td>
            <div v-if="isEditingRow(row)" class="edit" disabled style="width: 100%;">{{ index }}</div>
            <template v-else>{{ index }}</template>
        </td>
        <td>
            <input v-if="isEditingRow(row)" type="text" class="edit" style="width: 100%;" v-model="draft.name" @keyup.enter="commitEdit(row)" />
            <template v-else>{{ row.data.name }}</template>
        </td>
        <td>
            <input v-if="isEditingRow(row)" type="text" class="edit" style="width: 100%;" v-model="draft.age" @keyup.enter="commitEdit(row)" />
            <template v-else>{{ row.data.age }}</template>
        </td>
        <td>
            <input v-if="isEditingRow(row)" type="text" class="edit" style="width: 100%;" v-model="draft.location" @keyup.enter="commitEdit(row)" />
            <template v-else>{{ row.data.location }}</template>
        </td>
    </tr></tbody>
</table>
</div>

<div id="table_9_dd" class="dropdown large" style="width: 152px;" :style="dropdownStyle">
    <ul style="width: 150px; display: block;">
        <li @click="onMenuSelect(0)">Edit</li>
        <li @click="onMenuSelect(1)">Close</li>
    </ul>
</div>
</template>
