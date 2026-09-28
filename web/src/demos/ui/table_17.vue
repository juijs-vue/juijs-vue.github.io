<script setup lang="ts">
// @ts-nocheck
import { computed, reactive } from "vue"

const columns = [
    { key: 'index', label: 'Index', width: 214 },
    { key: 'name', label: 'Column. Name' },
    { key: 'age', label: 'Column. Age', width: 114 }
];

// 트리 조작(append/insert)은 이 중첩 구조(children) 기준으로 한다.
const rowsSource = reactive([
    { id: 1, data: { name: "Hong", age: "20", location: "Ilsan" } },
    { id: 2, data: { name: "Jung", age: "30", location: "Seoul" } },
    { id: 3, data: { name: "Park", age: "15", location: "Yeosu" } },
    { id: 4, data: { name: "Kang", age: "32", location: "Seoul" } },
    { id: 5, data: { name: "Song", age: "12", location: "Gwangju" } },
    { id: 6, data: { name: "Yoon", age: "22", location: "Damyang" } },
    { id: 7, data: { name: "Kim", age: "33", location: "Busan" } },
    { id: 8, data: { name: "Hwang", age: "21", location: "Seoul" } }
]);

// 원본(table.js)은 트리를 접고 펼치는 토글이 아예 없다 - 모든 하위 행이 항상 펼쳐진
// 채로 depth만큼 들여쓰기되어 보인다. DataGrid는 row.children이 있으면 자동으로
// tree-toggle 버튼을 붙이고 기본은 접힌 상태로 렌더링하므로(원본과 반대), 중첩 rows를
// 그대로 넘기지 않고 매번 완전히 펼친 flat 배열(children 없이 depth만 붙인)로 변환해서
// 넘긴다 - DataGrid 입장에서는 그냥 평평한 목록이라 토글이 생기지 않는다.
const rows = computed(() => {
    const result = [];
    function walk(list, depth) {
        for (const row of list) {
            result.push({ id: row.id, data: row.data, depth });
            if (row.children) walk(row.children, depth + 1);
        }
    }
    walk(rowsSource, 0);
    return result;
});

let nextId = 100; // append/insert로 생기는 새 행의 id - 문자열 id("1-1")와 섞여도
// Math.max 기반 계산처럼 깨지지 않도록 단순 증가 카운터를 쓴다.

function findRowByPath(rowsSource, path) {
    const indices = path.split('.').map(p => parseInt(p, 10));
    let current = rowsSource;

    for (let i = 0; i < indices.length; i++) {
        const idx = indices[i];
        if (i === indices.length - 1) {
            // Last index - return the row or parent for insertion
            return { parent: current, index: idx };
        }
        // Navigate to children
        if (idx < current.length) {
            const row = current[idx];
            if (!row.children) {
                row.children = [];
            }
            current = row.children;
        } else {
            return null;
        }
    }
    return null;
}

function insertAtPath(rowsSource, path, data) {
    const result = findRowByPath(rowsSource, path);
    if (!result) return;

    const newRow = { id: nextId++, data };
    result.parent.splice(result.index, 0, newRow);
}

function appendToPath(rowsSource, path, data) {
    const indices = path.split('.').map(p => parseInt(p, 10));
    let current = rowsSource;

    for (let i = 0; i < indices.length; i++) {
        const idx = indices[i];
        if (i === indices.length - 1) {
            // Found the parent - append to its children
            if (idx < current.length) {
                const row = current[idx];
                if (!row.children) {
                    row.children = [];
                }
                row.children.push({ id: nextId++, data });
            }
            return;
        }
        if (idx < current.length) {
            const row = current[idx];
            if (!row.children) {
                row.children = [];
            }
            current = row.children;
        }
    }
}

function submit() {
    appendToPath(rowsSource, "1", { name: "Kang", age: "21", location: "Seoul" });
    appendToPath(rowsSource, "1", { name: "Jung", age: "33", location: "Seoul" });
    insertAtPath(rowsSource, "1.2", { name: "Park", age: "45", location: "Seoul" });
    insertAtPath(rowsSource, "1.3", { name: "Hwang", age: "12", location: "Seoul" });
    appendToPath(rowsSource, "1.2", { name: "Roo", age: "32", location: "Seoul" });
    appendToPath(rowsSource, "1.2", { name: "Jung", age: "14", location: "Seoul" });
    appendToPath(rowsSource, "3", { name: "Yoon", age: "17", location: "Seoul" });
    appendToPath(rowsSource, "3", { name: "Kim", age: "21", location: "Seoul" });
    appendToPath(rowsSource, "3", { name: "Kim", age: "28", location: "Seoul" });
}

function onRowClick(row) {
    alert(`index(${rowIndex(row)}), name(${row.data.name})`);
}

// 원본의 row.index는 트리 계층에서의 위치를 나타내는 dot-path 문자열이다
// (예: "1.2.0" = 최상위 1번의 3번째 자식의 1번째 자식).
function rowIndex(row) {
    function search(list, prefix) {
        for (let i = 0; i < list.length; i++) {
            const path = prefix ? `${prefix}.${i}` : `${i}`;
            if (list[i].id === row.id) return path;
            if (list[i].children) {
                const found = search(list[i].children, path);
                if (found !== null) return found;
            }
        }
        return null;
    }
    return search(rowsSource, "") ?? "-1";
}
</script>

<template>
<button class="btn small" @click="submit">
    <i class="icon-play"></i> Run
</button>

<DataGrid
    :columns="columns"
    :rows="rows"
    resizable
    :scroll-height="200"
    style="margin-top: 7px;"
    @row-click="onRowClick"
>
    <template #cell-index="{ row }">{{ rowIndex(row) }}</template>
    <template #cell-name="{ row, value }">
        <span :style="{ display: 'block', paddingLeft: (5 + row.depth * 20) + 'px' }">
            <template v-if="row.depth"><i class="icon-left"></i>&nbsp;</template>{{ value }}
        </span>
    </template>
</DataGrid>
</template>
