<script setup lang="ts">
// @ts-nocheck
import { reactive, ref } from "vue"

const grid = ref(null);

const columns = [
    { key: 'index', label: 'Index', width: 214 },
    { key: 'name', label: 'Column. Name' },
    { key: 'age', label: 'Column. Age', width: 114 }
];

// 원본(table.js)의 updateTree()는 중첩 구조가 아니라 flat 배열을 받는다 - 각 행의
// index가 dot-path 문자열("0", "0.0", "0.0.0", ...)이고 depth는 그 dot 개수다.
// 토글도 없이 항상 전부 펼쳐진 채로 보인다 - table_17/table_18과 같은 이유로,
// children을 쓰지 않고 depth를 직접 붙인 flat 배열을 그대로 DataGrid에 넘긴다.
const rows = reactive([]);

function submit(depth) {
    rows.length = 0;

    let key = "0";
    for (let i = 0; i < depth; i++) {
        rows.push({
            id: key,
            data: { index: key, name: "Hong" + i, age: Math.floor(Math.random() * 100) },
            depth: i
        });
        key += ".0";
    }
}
</script>

<template>
<button class="btn small" @click="submit(10)"><i class="icon-play"></i> Run</button>

<DataGrid
    ref="grid"
    :columns="columns"
    :rows="rows"
    resizable
    nowrap
    style="margin-top: 7px;"
>
    <template #cell-name="{ row, value }">
        <span :style="{ display: 'block', paddingLeft: (5 + row.depth * 20) + 'px' }">
            <template v-if="row.depth"><i class="icon-left"></i>&nbsp;</template>{{ value }}
        </span>
    </template>
    <template #empty>Data does not exist.</template>
</DataGrid>
</template>
