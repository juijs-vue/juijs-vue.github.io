<script setup lang="ts">
import { useTitle } from "../composables/useTitle"
import galleryItems from "../generated/gallery.json"

useTitle("JUI Vue: Gallery")

const base = import.meta.env.BASE_URL
</script>

<template>
    <nav class="navbar fixed top sub">
        <div class="center">
            <span class="title">Gallery</span>
            <span class="msg"
                >JUI gallery provides a variety of dashboard templates developed with a component such as a chart or
                grid.</span
            >
        </div>
    </nav>

    <article>
        <div class="gallery-container">
            <div class="gallery-list">
                <div v-for="item in galleryItems" :key="item.name" class="item" :class="{ iframe: !item.hasThumbnail }">
                    <div class="wrap">
                        <div class="body">
                            <img v-if="item.hasThumbnail" :src="`${base}gallery/${item.name}/thumbnail.png`" />
                            <iframe v-else border="0" frameborder="0" :src="`${base}gallery/${item.name}/index.html`" scrolling="no"></iframe>
                            <a :href="`${base}?p=gallery.${item.name}`"></a>
                        </div>
                        <div class="footer">
                            <div class="title" :title="item.info.title">{{ item.info.title }}</div>
                            <div class="description" :title="item.info.description">{{ item.info.description }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </article>
</template>

<style>
@import "../styles/gallery-list.css";
</style>
