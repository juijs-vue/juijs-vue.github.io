<script setup lang="ts">
import { computed, defineAsyncComponent } from "vue"
import { useRoute } from "vue-router"
import { useTitle } from "../composables/useTitle"
import galleryItems from "../generated/gallery.json"

const route = useRoute()
const base = import.meta.env.BASE_URL

const galleryId = computed(() => String(route.query.p).slice("gallery.".length))
const item = computed(() => galleryItems.find((g) => g.name === galleryId.value))

useTitle(computed(() => (item.value ? `JUI Vue: ${item.value.info.title}` : "JUI Vue")).value)

// A gallery demo converted to a real Vue component lives at ./gallery/<Name>.vue (matching
// play/ui's/play/chart's demos/*.vue convention) - rendered directly instead of the legacy
// iframe when present. Unconverted demos fall back to their original gallery/<name>/index.html,
// untouched, embedded exactly as before.
//
// Explicit id -> component-file-name map, not a derived transform (e.g. capitalize-first-letter):
// most of these gallery ids are single concatenated words with no delimiter to recover a word
// boundary from ("facebookgroup" -> "FacebookGroup" is unrecoverable by any generic string rule).
const NATIVE_DEMOS: Record<string, string> = {
    facebookgroup: "FacebookGroup",
    koreaweather: "KoreaWeather",
    fitness: "Fitness",
    accountbook: "AccountBook",
    admintool: "AdminTool",
    apmmarket: "ApmMarket",
    gps: "GPS"
}

const nativeDemos = import.meta.glob("./gallery/*.vue")
const nativeComponentName = computed(() => NATIVE_DEMOS[galleryId.value])
const nativeComponent = computed(() => {
    if (!nativeComponentName.value) return null
    const loader = nativeDemos[`./gallery/${nativeComponentName.value}.vue`]
    return loader ? defineAsyncComponent(loader as any) : null
})

const sourceUrl = computed(() =>
    nativeComponent.value
        ? `https://github.com/juijs-vue/www.jui-vue.io/tree/vue3/web/src/pages/gallery/${nativeComponentName.value}.vue`
        : `https://github.com/juijs/www.jui.io/tree/master/gallery/${galleryId.value}`
)
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
            <a class="link" target="_blank" :href="sourceUrl">
                <i class="icon-edit"></i> View source
            </a>
        </div>
        <component :is="nativeComponent" v-if="nativeComponent" />
        <iframe v-else :src="`${base}gallery/${galleryId}/index.html`" width="100%" :height="item.info.height"></iframe>
    </div>
</template>

<style>
@import "../styles/gallery-view.css";
</style>
