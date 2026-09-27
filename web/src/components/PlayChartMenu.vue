<script setup lang="ts">
import { usePlayChartMenu } from "../composables/usePlayChartMenu"

const props = defineProps<{ code: string }>()
const { groups, activeGroupType } = usePlayChartMenu(() => props.code)
</script>

<template>
    <div class="vmenu rect">
        <template v-for="g in groups" :key="g.type">
            <a :data-type="g.type" :class="{ active: g.type === activeGroupType }">{{ g.title }}</a>
            <ul class="submenu">
                <li v-for="item in g.list" :key="item.code" :class="{ active: item.code === code }">
                    <RouterLink :to="{ path: '/play/chart/', query: { p: item.code } }">{{ item.title }}</RouterLink>
                </li>
            </ul>
        </template>
    </div>
</template>
