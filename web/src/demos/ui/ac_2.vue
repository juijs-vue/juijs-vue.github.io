<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const initialWords = [
    "ActionScript",
    "AppleScript",
    "Asp",
    "BASIC",
    "C",
    "C++",
    "Clojure",
    "COBOL",
    "ColdFusion",
    "Erlang"
]

const newWords = [
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
const words = ref(initialWords)
const ac2Ref = ref(null)

function runUpdate() {
    ac2Ref.value.update(newWords)
}
</script>

<template>
<AutoComplete ref="ac2Ref" v-model="text" class="group" size="small" :words="words" input-style="width: 150px">
    <template #prefix><label class="label small"><i class="icon-search"></i></label></template>
</AutoComplete> <button class="btn small" @click="runUpdate">
    <i class="icon-play"></i> Run
</button>
</template>
