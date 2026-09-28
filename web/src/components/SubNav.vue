<script setup lang="ts">
defineProps<{ title: string; msg: string }>()
</script>

<template>
    <nav class="navbar fixed top sub">
        <div class="center">
            <span class="title">{{ title }}</span>
            <span class="msg">{{ msg }}</span>
        </div>
    </nav>
</template>
