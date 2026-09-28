<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const page = ref(1)

function onPage(pNo) {
    alert(pNo)
}
</script>

<template>
<Paging v-model="page" :count="1000" :page-count="10" :screen-count="7" @page="onPage" style="width: 100%; margin-top: 3px;" />
</template>
