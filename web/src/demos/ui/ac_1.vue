<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const words = [
    "ActionScript",
    "AppleScript",
    "Asp",
    "BASIC",
    "C",
    "C++",
    "Clojure",
    "COBOL",
    "ColdFusion",
    "Erlang",
    "Fortran",
    "Groovy",
    "Haskell",
    "Java",
    "JavaScript",
    "Lisp",
    "Perl",
    "PHP",
    "Python",
    "Ruby",
    "Scala",
    "Scheme"
]

const text = ref("")

function onChangeWord(text) {
    alert(text)
}
</script>

<template>
<AutoComplete v-model="text" class="group" size="small" :words="words" input-style="width: 150px" @change="onChangeWord">
    <template #prefix><label class="label small"><i class="icon-search"></i></label></template>
</AutoComplete>
</template>
