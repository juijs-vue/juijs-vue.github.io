<script setup lang="ts">
// @ts-nocheck
import { computed, reactive, ref } from "vue"

const grid = ref(null);

const columns = [
    { key: 'index', label: 'Index', width: 214 },
    { key: 'name', label: 'Column. Name' },
    { key: 'age', label: 'Column. Age', width: 114 }
];

// 원본(table.js)의 move/remove/update는 배열 위치가 아니라 트리상의 dot-path 문자열로
// 대상을 가리킨다("3" = 최상위 4번째, "4.0" = 최상위 5번째의 첫 자식) - table_17과 동일한
// 구조라 경로 탐색 로직을 그대로 가져왔다.
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

// DataGrid는 row.children이 있으면 자동으로 접기/펼치기 트리 UI를 붙이고 기본은 접힌
// 상태로 렌더링한다(원본과 반대 - 원본은 토글 없이 항상 전부 펼쳐져 보인다). 중첩 rows를
// 그대로 넘기지 않고 매번 완전히 펼친 flat 배열(children 없이 depth만 붙인)로 변환한다.
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

// path의 마지막 세그먼트를 "그 자리에 삽입/그 자리의 기존 항목" 위치로 해석해
// { parent(배열), index } 를 돌려준다 - move/remove/update/insert가 전부 이 위에서 동작한다.
function findRowByPath(path) {
    const indices = String(path).split('.').map((p) => parseInt(p, 10));
    let current = rowsSource;

    for (let i = 0; i < indices.length; i++) {
        const idx = indices[i];
        if (i === indices.length - 1) {
            return { parent: current, index: idx };
        }
        if (idx < current.length) {
            const row = current[idx];
            if (!row.children) row.children = [];
            current = row.children;
        } else {
            return null;
        }
    }
    return null;
}

// 원본의 row.index는 트리 계층에서의 위치를 나타내는 dot-path 문자열이다.
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

function onRowClick(row) {
    alert(`index(${rowIndex(row)}), name(${row.data.name})`);
}

function move(fromPath, toPath) {
    // toPath는 이동(제거)이 일어나기 "전" 트리 기준으로 해석해야 한다 - 먼저 찾은
    // parent 배열 참조를 들고 있다가 나중에 그 위에 삽입한다(같은 배열이 아닌 이상
    // from을 먼저 빼도 to가 가리키는 배열/자리에는 영향이 없다).
    const to = findRowByPath(toPath);
    const from = findRowByPath(fromPath);
    if (!from || !to || from.index >= from.parent.length) return;
    const [moved] = from.parent.splice(from.index, 1);
    to.parent.splice(to.index, 0, moved);
}

function remove(path) {
    const result = findRowByPath(path);
    if (!result || result.index >= result.parent.length) return;
    result.parent.splice(result.index, 1);
}

function update(path, data) {
    const result = findRowByPath(path);
    if (!result || result.index >= result.parent.length) return;
    Object.assign(result.parent[result.index].data, data);
}
</script>

<template>
<div class="group">
    <button class="btn small" @click="move('3', '4.0')">Move</button> <button class="btn small" @click="remove('1')">Remove</button> <button class="btn small" @click="update('2', { name: 'AAA' })">Update</button>
</div>

<DataGrid
    ref="grid"
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
