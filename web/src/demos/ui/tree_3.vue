<script setup lang="ts">
// @ts-nocheck
import { onMounted, ref } from "vue"

const treeRef = ref(null)

onMounted(() => {
    const t = treeRef.value
    if (!t) return
    t.append({ title: "Windows" })
    t.append({ title: "Download" })
    t.append({ title: "Program Files" })
    t.append({ title: "Apache" })
    t.append("0", { title: "run.exe" })
    t.append("0", { title: "setting.conf" })
    t.append("1", { title: "jui.torrent" })
    t.insert("2.0", { title: "Riot Games" })
    t.insert("2.0.0", { title: "lol.exe" })
    t.append("3", { title: "startup.bat" })
    t.fold("0")
    t.fold("1")
    t.fold("3")
})

const rootData = { title: "C:\\" }
</script>

<template>
<Tree ref="treeRef" variant="line-file" :root="rootData" drag :drag-child="false">
    <template #default="{ node }"><i></i> {{ node.data.title }}</template>
</Tree>
</template>
