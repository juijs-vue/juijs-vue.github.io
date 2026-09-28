<script setup lang="ts">
// @ts-nocheck
import { computed, onMounted, reactive, ref } from "vue"

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

// ---- sort (원본 config: sort: true - No/Name/Age/Location 전부 클릭 정렬 가능,
// 첫 클릭은 desc부터, 이후 클릭마다 asc/desc 토글. "No"는 실제 필드가 없어(fields의
// 첫 항목이 null) 원래 삽입 순서(id)로 정렬한다) ----
const sortField = ref(null)
const sortOrder = ref(null)

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
        const va = field === "index" ? a.id : a.data[field]
        const vb = field === "index" ? b.id : b.data[field]
        const cmp = compare(va, vb)
        return sortOrder.value === "asc" ? cmp : -cmp
    })
}

// ---- resize (원본 config: resize: true - 드래그한 컬럼과 바로 오른쪽 이웃 컬럼이
// 폭을 나눠 갖는다, 합은 유지) ----
const tableRef = ref(null)
const colWidths = reactive({ no: null, name: null, age: null, location: null })
const COLUMN_ORDER = ["no", "name", "age", "location"]
const MIN_COLUMN_WIDTH = 30

// .resize 구분선은 표 왼쪽 끝 기준 누적 폭 위치에 그려진다(각 th에 position:relative가
// 없어서 <table>의 position:relative가 containing block이 된다) - 리사이즈 후에도 계속
// 경계를 따라가도록 매번 다시 계산한다.
const resizeLeft = computed(() => ({
    no: colWidths.no,
    name: colWidths.no + colWidths.name,
    age: colWidths.no + colWidths.name + colWidths.age
}))

onMounted(() => {
    const ths = tableRef.value.querySelectorAll("thead th")
    COLUMN_ORDER.forEach((col, i) => {
        colWidths[col] = ths[i].getBoundingClientRect().width
    })
})

let resizing = null // { col, next, startX, startWidth, startNextWidth }

function onResizeStart(col, e) {
    const nextIndex = COLUMN_ORDER.indexOf(col) + 1
    const next = COLUMN_ORDER[nextIndex]
    if (!next) return
    const th = e.currentTarget.closest("th")
    const nextTh = th.nextElementSibling
    resizing = {
        col,
        next,
        startX: e.pageX,
        startWidth: th.getBoundingClientRect().width,
        startNextWidth: nextTh.getBoundingClientRect().width
    }
    window.addEventListener("mousemove", onResizeMove)
    window.addEventListener("mouseup", onResizeEnd)
    e.preventDefault()
}
function onResizeMove(e) {
    if (!resizing) return
    const dx = e.pageX - resizing.startX
    const newWidth = resizing.startWidth + dx
    const newNextWidth = resizing.startNextWidth - dx
    if (newWidth < MIN_COLUMN_WIDTH || newNextWidth < MIN_COLUMN_WIDTH) return
    colWidths[resizing.col] = newWidth
    colWidths[resizing.next] = newNextWidth
}
function onResizeEnd() {
    resizing = null
    window.removeEventListener("mousemove", onResizeMove)
    window.removeEventListener("mouseup", onResizeEnd)
}

// ---- inline edit (원본 config: editRow: ["name", "age"] - "행 단위" 편집이다. 더블
// 클릭한 셀만이 아니라 그 행의 name/age가 한꺼번에 input으로 바뀌고(편집 불가능한
// No/Location은 disabled된 .edit 박스로 스타일만 맞춰 보여준다), 둘 중 어느 input에서
// Enter를 눌러도 행 전체가 한 번에 커밋된다. age가 숫자가 아니면 alert 띄우고 행 전체가
// 편집 상태로 남는다(부분 커밋 없음). blur/Escape는 원본에도 없다) ----
const EDITABLE_FIELDS = ["name", "age"]
const editingId = ref(null)
const draft = reactive({ name: "", age: "" })

function startEdit(row, field) {
    if (!EDITABLE_FIELDS.includes(field)) return
    editingId.value = row.id
    draft.name = row.data.name
    draft.age = row.data.age
}
function isEditingRow(row) {
    return editingId.value === row.id
}
function commitEdit(row) {
    if (isNaN(draft.age)) {
        alert("Age must enter a numeric value.")
        return
    }
    row.data.name = draft.name
    row.data.age = draft.age
    editingId.value = null
}
</script>

<template>
<div class="jui-grid-vue-root theme-classic">
<table id="table_8" ref="tableRef" class="table classic" style="position: relative;">
    <thead>
    <tr>
        <th width="50px" style="cursor: pointer;" :style="{ width: colWidths.no ? colWidths.no + 'px' : undefined, boxSizing: colWidths.no ? 'border-box' : undefined }" @click="sortBy('index')">No<i v-if="sortField === 'index'" :class="sortOrder === 'asc' ? 'icon-arrow3' : 'icon-arrow1'"></i><div class="resize" style="position: absolute; width: 8px; height: 28px; top: 0px; cursor: w-resize; z-index: 1;" :style="{ left: resizeLeft.no + 'px' }" @mousedown="onResizeStart('no', $event)"></div></th>
        <th style="cursor: pointer;" :style="{ width: colWidths.name ? colWidths.name + 'px' : undefined, boxSizing: colWidths.no ? 'border-box' : undefined }" @click="sortBy('name')">Name<i v-if="sortField === 'name'" :class="sortOrder === 'asc' ? 'icon-arrow3' : 'icon-arrow1'"></i><div class="resize" style="position: absolute; width: 8px; height: 28px; top: 0px; cursor: w-resize; z-index: 1;" :style="{ left: resizeLeft.name + 'px' }" @mousedown="onResizeStart('name', $event)"></div></th>
        <th style="cursor: pointer;" :style="{ width: colWidths.age ? colWidths.age + 'px' : undefined, boxSizing: colWidths.no ? 'border-box' : undefined }" @click="sortBy('age')">Age<i v-if="sortField === 'age'" :class="sortOrder === 'asc' ? 'icon-arrow3' : 'icon-arrow1'"></i><div class="resize" style="position: absolute; width: 8px; height: 28px; top: 0px; cursor: w-resize; z-index: 1;" :style="{ left: resizeLeft.age + 'px' }" @mousedown="onResizeStart('age', $event)"></div></th>
        <th style="cursor: pointer;" :style="{ width: colWidths.location ? colWidths.location + 'px' : undefined, boxSizing: colWidths.no ? 'border-box' : undefined }" @click="sortBy('location')">Location<i v-if="sortField === 'location'" :class="sortOrder === 'asc' ? 'icon-arrow3' : 'icon-arrow1'"></i></th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(row, index) in rows" :key="row.id">
        <td>
            <div v-if="isEditingRow(row)" class="edit" disabled style="width: 100%;">{{ index }}</div>
            <template v-else>{{ index }}</template>
        </td>
        <td @dblclick="startEdit(row, 'name')">
            <input v-if="isEditingRow(row)" type="text" class="edit" style="width: 100%;" v-model="draft.name" @keyup.enter="commitEdit(row)" />
            <template v-else>{{ row.data.name }}</template>
        </td>
        <td @dblclick="startEdit(row, 'age')">
            <input v-if="isEditingRow(row)" type="number" class="edit" style="width: 100%;" v-model="draft.age" @keyup.enter="commitEdit(row)" />
            <template v-else>{{ row.data.age }}</template>
        </td>
        <td>
            <div v-if="isEditingRow(row)" class="edit" disabled style="width: 100%;">{{ row.data.location }}</div>
            <template v-else>{{ row.data.location }}</template>
        </td>
    </tr>
    </tbody>
</table>
</div>
</template>
