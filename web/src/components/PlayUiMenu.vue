<script setup lang="ts">
import { usePlayUiMenu } from "../composables/usePlayUiMenu"

const props = defineProps<{ code: string }>()
const { groups, activeGroupType } = usePlayUiMenu(() => props.code)
</script>

<template>
    <div class="vmenu rect">
        <template v-for="g in groups" :key="g.type">
            <a :data-type="g.type" :class="{ active: g.type === activeGroupType }">{{ g.title }}</a>
            <ul class="submenu">
                <li v-for="item in g.list" :key="item.code" :class="{ active: item.code === code }">
                    <!-- RouterLink (in-place query change, same route/component -
                         PlayUi.vue's own reactive watcher swaps the live editor's
                         file, no full reload) instead of the shell's full-reload
                         <a href> pattern - unlike the shell's language/page
                         switches, this doesn't touch anything (like res/chart.js)
                         that depends on a real reload to rebind cleanly. -->
                    <RouterLink :to="{ path: '/play/ui/', query: { p: item.code } }">{{ item.title }}</RouterLink>
                </li>
            </ul>
        </template>
    </div>
</template>
