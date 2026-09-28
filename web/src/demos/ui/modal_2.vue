<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const show = ref(false)
</script>

<template>
<button class="btn" @click="show = true">
    <i class="icon-play"></i> Run
</button>

<div style="position: relative;" class="jui-grid-vue-root theme-classic">
    <table id="modal_2" class="table classic" style="margin-top: 7px;">
        <thead>
            <tr>
                <th>No</th>
                <th>Name</th>
                <th>Age</th>
                <th>Location</th>
            </tr>
        </thead>
        <tbody style="max-height: 200px; width: 700px;">
            <tr>
                <td style="width: 164px;">0</td>
                <td style="width: 164px;">Hong</td>
                <td style="width: 164px;">20</td>
                <td style="width: 153px;">Ilsan</td>
            </tr>
            <tr>
                <td>1</td>
                <td>Jung</td>
                <td>30</td>
                <td>Seoul</td>
            </tr>
            <tr>
                <td>2</td>
                <td>Park</td>
                <td>15</td>
                <td>Yeosu</td>
            </tr>
        </tbody>
    </table>

    <Modal v-model="show" :fixed="false" :opacity="0.5" color="white">
        <div style="font-size: 20px; color: red;">
            NOW LOADING...
        </div>
    </Modal>
</div>
</template>
