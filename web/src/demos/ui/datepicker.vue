<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const daily = ref(null)
const yearly = ref(null)

function onSelect(formatted, date) {
    alert(formatted)
}
</script>

<template>
﻿<section>
    <h2>Default</h2>

    <p>
        Datepicker is comprised of tables and the user can designate a different style for each element according to the state.
    </p>

    <Datepicker
        style="width: 250px; height: 200px;"
        v-model="daily"
        title-format="MMMM yyyy"
        format="yyyy-MM-dd"
        @select="onSelect"
    />
</section>

<section>
    <h2>Large</h2>

    <p>
        It is possible to set the sizes of elements constituting a datepicker to suit each other, providing a calender with a different appearance.
    </p>

    <Datepicker
        v-model="yearly"
        type="yearly"
        size="large"
        title-format="yyyy"
        format="yyyy"
        @select="onSelect"
    />
</section>
</template>
