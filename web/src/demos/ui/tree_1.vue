<script setup lang="ts">
// @ts-nocheck
import { onMounted, ref } from "vue"

const tree1Ref = ref(null)
const tree2Ref = ref(null)
const tree3Ref = ref(null)
const tree4Ref = ref(null)

function onSelect(node) {
    alert("index(" + node.index + "), title(" + node.data.title + ")")
}

function populateTree(treeRef) {
    if (!treeRef) return
    treeRef.append({ title: "Windows" })
    treeRef.append({ title: "Download" })
    treeRef.append({ title: "Program Files" })
    treeRef.append({ title: "Apache" })
    treeRef.append("0", { title: "run.exe" })
    treeRef.append("0", { title: "setting.conf" })
    treeRef.append("1", { title: "jui.torrent" })
    treeRef.insert("2.0", { title: "Riot Games" })
    treeRef.insert("2.0.0", { title: "lol.exe" })
    treeRef.append("3", { title: "startup.bat" })
    treeRef.fold("0")
    treeRef.fold("1")
    treeRef.fold("3")
}

onMounted(() => {
    populateTree(tree1Ref.value)
    populateTree(tree2Ref.value)
    populateTree(tree3Ref.value)
    populateTree(tree4Ref.value)
})

const rootData = { title: "C:\\" }
</script>

<template>
<div class="row">
    <div class="col col-3">
        <Tree ref="tree1Ref" variant="arrow" :root="rootData" @select="onSelect">
            <template #default="{ node }"><i></i> {{ node.data.title }}</template>
        </Tree>
    </div>
    <div class="col col-3">
        <Tree ref="tree2Ref" variant="line" :root="rootData" @select="onSelect">
            <template #default="{ node }"><i></i> {{ node.data.title }}</template>
        </Tree>
    </div>
    <div class="col col-3">
        <Tree ref="tree3Ref" variant="arrow-file" :root="rootData" @select="onSelect">
            <template #default="{ node }"><i></i> {{ node.data.title }}</template>
        </Tree>
    </div>
    <div class="col col-3">
        <Tree ref="tree4Ref" variant="line-file" :root="rootData" @select="onSelect">
            <template #default="{ node }"><i></i> {{ node.data.title }}</template>
        </Tree>
    </div>
</div>
</template>
