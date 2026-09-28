<script setup lang="ts">
// @ts-nocheck
import { reactive, ref } from "vue"

const rows = reactive([
    { id: 1, data: { name: "Hong", age: "20", location: "Ilsan" } },
    { id: 2, data: { name: "Jung", age: "30", location: "Seoul" } },
    { id: 3, data: { name: "Park", age: "10", location: "Dangjin" } }
]);

const expandedRows = ref([]);
// 원본은 입력창이 실제 row 데이터와 분리된 초안이라(value="<!= name !>" 로 한 번만 채워짐),
// Submit을 눌러야만 table_3.update()로 반영되고 Cancel은 그냥 닫기만 한다. row.data에
// v-model을 바로 걸면 타이핑하는 즉시 반영되어버려 Cancel이 되돌릴 게 없어지므로,
// 펼칠 때 draft로 복사해뒀다가 Submit에서만 row.data에 합친다.
const drafts = reactive({});

function toggleRow(id) {
    const index = expandedRows.value.indexOf(id);
    if (index > -1) {
        expandedRows.value.splice(index, 1);
        delete drafts[id];
    } else {
        const row = rows.find(r => r.id === id);
        drafts[id] = { ...row.data };
        expandedRows.value.push(id);
    }
}

function collapseRow(id) {
    const index = expandedRows.value.indexOf(id);
    if (index > -1) {
        expandedRows.value.splice(index, 1);
        delete drafts[id];
    }
}

function onSubmit(row) {
    const draft = drafts[row.id];
    if (draft) Object.assign(row.data, draft);
    collapseRow(row.id);
}

function onDelete(row) {
    const index = rows.findIndex(r => r.id === row.id);
    if (index !== -1) {
        rows.splice(index, 1);
    }
    collapseRow(row.id);
}
</script>

<template>
<div class="jui-grid-vue-root theme-classic">
<table id="table_3" class="table expand">
    <thead>
        <tr>
            <th style="width: 30px"></th>
            <th>Name</th>
            <th>Age</th>
            <th>Location</th>
        </tr>
    </thead>
    <tbody>
        <template v-for="(row, index) in rows" :key="row.id">
            <tr @click="toggleRow(row.id)">
                <td><i :class="expandedRows.includes(row.id) ? 'icon-right' : 'icon-left'"></i></td>
                <td>{{ row.data.name }}</td>
                <td>{{ row.data.age }}</td>
                <td>{{ row.data.location }}</td>
            </tr>
            <tr v-if="expandedRows.includes(row.id)" class="expand">
                <td colspan="4">
                    <div class="row">
                        <div class="group">
                            <label class="label small">Name</label>
                            <input v-model="drafts[row.id].name" type="text" class="input small" style="width: 80px" />
                        </div>
                        <div class="group">
                            <label class="label small">Age</label>
                            <input v-model="drafts[row.id].age" type="text" class="input small" style="width: 80px" />
                        </div>
                        <div class="group">
                            <label class="label small">Location</label>
                            <input v-model="drafts[row.id].location" type="text" class="input small" style="width: 80px" />
                        </div>
                    </div>
                    <br/>
                    <div class="row">
                        <div class="group">
                            <button @click.stop="onSubmit(row)" class="btn small">Submit</button>
                            <button @click.stop="onDelete(row)" class="btn small">Delete</button>
                            <button @click.stop="collapseRow(row.id)" class="btn small">Cancel</button>
                        </div>
                    </div>
                </td>
            </tr>
        </template>
    </tbody>
</table>
</div>
</template>
