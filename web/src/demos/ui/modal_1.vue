<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const show = ref(false)
</script>

<template>
<button class="btn" @click="show = true">
    <i class="icon-play"></i> Run
</button>

<Modal v-model="show" color="black">
    <template #default="{ hide }">
        <div class="msgbox">
            <div class="head">
                Title
            </div>
            <div class="body">
                Contents...<br/>

                <div style="text-align: center; margin-top: 45px;">
                    <a class="btn focus small">Save</a> <a class="btn small" @click="hide">Close</a>
                </div>
            </div>
        </div>
    </template>
</Modal>
</template>
