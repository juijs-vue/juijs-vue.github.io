<script setup lang="ts">
// @ts-nocheck
import { onBeforeUnmount, onMounted, ref } from "vue"

const data = [
    { name: "Hong", age: "20", location: "Ilsan" },
    { name: "Jung", age: "30", location: "Seoul" },
    { name: "Park", age: "15", location: "Yeosu" },
    { name: "Kang", age: "32", location: "Seoul" },
    { name: "Song", age: "12", location: "Gwangju" },
    { name: "Yoon", age: "22", location: "Damyang" },
    { name: "Kim", age: "33", location: "Busan" },
    { name: "Hwang", age: "21", location: "Seoul" }
]

const dropdownStyle = ref({});
const selectedRow = ref(null);

// .dropdown은 CSS 기본값이 display:none이라(원본 ui.dropdown의 dd.show()/hide()가 이걸
// 토글한다), position만 잡아주는 것만으로는 아예 안 보인다 - display도 같이 켜줘야 한다.
function showMenu(event, row) {
    selectedRow.value = row;
    dropdownStyle.value = {
        display: 'block',
        position: 'fixed',
        left: event.clientX + 'px',
        top: event.clientY + 'px'
    };
}

function hideMenu() {
    dropdownStyle.value = {};
}

function selectMenuItem(text) {
    alert(text);
    hideMenu();
}

function onDocClick(e) {
    if (!e.target.closest('#table_6_dd')) hideMenu();
}
onMounted(() => document.addEventListener('click', onDocClick));
onBeforeUnmount(() => document.removeEventListener('click', onDocClick));
</script>

<template>
<div class="jui-grid-vue-root theme-classic">
<table id="table_6" class="table simple headline">
    <thead>
        <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Location</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="row in data" :key="row.name" @contextmenu.prevent="showMenu($event, row)">
            <td>{{ row.name }}</td>
            <td>{{ row.age }}</td>
            <td>{{ row.location }}</td>
        </tr>
    </tbody>
</table>
</div>

<div id="table_6_dd" class="dropdown large" :style="dropdownStyle">
    <ul style="width: 150px;">
        <li @click="selectMenuItem('Dropdown 1')">Dropdown 1</li>
        <li class="divider"></li>
        <li @click="selectMenuItem('Dropdown 2')">Dropdown 2</li>
        <li @click="selectMenuItem('Dropdown 3')">Dropdown 3</li>
        <li @click="selectMenuItem('Dropdown 4')">Dropdown 4</li>
    </ul>
</div>
</template>
