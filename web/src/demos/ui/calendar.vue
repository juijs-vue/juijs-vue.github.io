<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const selected = ref(null)

function onSelect(formatted, date) {
    alert(formatted)
}
</script>

<template>
﻿<section>
    <h2>Default</h2>
    <p>
        It provides a calendar component for implementing functions such as schedule management.
        The same as the existing markup rule, but only if you change the class name will be <strong> calendar </strong>.
    </p>
    <Datepicker
        v-model="selected"
        variant="calendar"
        title-format="MMMM yyyy"
        format="yyyy-MM-dd"
        style="height: 550px;"
        @select="onSelect"
    >
        <template #cell="{ type, no }">
            <div>{{ no }}</div>
            <div v-if="type !== 'none' && no === 6" class="task">
                <span style="background: #ff847c;">Memorial Day</span>
                <span style="background: #28a7db;">2:00 Lunch</span>
            </div>
            <div v-if="type !== 'none' && no === 17" class="task">
                <span style="background: #aa8bc6;">Interview</span>
            </div>
        </template>
    </Datepicker>
    <p></p>
    <p class="br">
        If datepicker components and other points can be added to the calendar in the <strong>td</strong> tag.
    </p>
</section>
</template>
