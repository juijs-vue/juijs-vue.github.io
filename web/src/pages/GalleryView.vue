<script setup lang="ts">
import { computed } from "vue"
import { useRoute } from "vue-router"
import { useTitle } from "../composables/useTitle"
import galleryItems from "../generated/gallery.json"

const route = useRoute()
const base = import.meta.env.BASE_URL

const galleryId = computed(() => String(route.query.p).slice("gallery.".length))
const item = computed(() => galleryItems.find((g) => g.name === galleryId.value))

useTitle(computed(() => (item.value ? `JUI Vue: ${item.value.info.title}` : "JUI Vue")).value)
</script>

<template>
    <div v-if="item" class="gallery-view-container">
        <div class="gallery-view-info">
            <h1 class="title">{{ item.info.title }}</h1>
            <p class="description">{{ item.info.description }}</p>
            <p class="author">
                Created by <strong>{{ item.info.author }}</strong>
                <a v-if="item.info.email" :href="`mailto:${item.info.email}`"><small>({{ item.info.email }})</small></a>
            </p>
            <a class="link" target="_blank" :href="`https://github.com/juijs/www.jui.io/tree/master/gallery/${item.name}`">
                <i class="icon-edit"></i> View source
            </a>
        </div>
        <iframe :src="`${base}gallery/${galleryId}/index.html`" width="100%" :height="item.info.height"></iframe>
    </div>
</template>

<style>
@import "../styles/gallery-view.css";
</style>
