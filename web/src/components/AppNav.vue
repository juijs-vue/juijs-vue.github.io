<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from "vue"
import { useSwipeClose } from "../composables/useSwipeClose"
import { useLang } from "../composables/useLang"

const base = import.meta.env.BASE_URL
const { lang } = useLang()

// Every link here is a plain <a> (full page reload, not a RouterLink - matches
// useLang.ts's own "language switch is a full reload" approach), so the
// current language must be carried forward explicitly or it silently resets
// to the browser-language default on the next page (e.g. picking 한국어, then
// clicking any menu item, would otherwise drop back to English).
function pageHref(p: string) {
    return `${base}?p=${p}&lang=${lang.value}`
}

const menuOpen = ref(false)
const menuWindowEl = ref<HTMLElement | null>(null)

watch(menuOpen, (open) => {
    document.body.classList.toggle("menu-open", open)
})
onBeforeUnmount(() => {
    document.body.classList.remove("menu-open")
})

useSwipeClose(menuWindowEl, () => {
    menuOpen.value = false
})
</script>

<template>
    <header class="navbar fixed top">
        <div class="center" style="position: relative">
            <a :href="base"><span class="img img-logo-top"></span></a>

            <span class="menu menu-left">
                <a :href="pageHref('install')">Getting Started</a>
                <a :href="pageHref('basic')">Basic</a>
                <a :href="pageHref('chart')">Charts</a>
                <a :href="`${base}play/ui/`" target="_blank">Components</a>
                <a :href="`${base}play/chart/`" target="_blank">Chart Play</a>
                <a :href="pageHref('gallery')">Gallery</a>
                <a href="http://api.jui.io" target="_blank">API</a>
            </span>

            <span class="menu menu-right">
                <a href="https://github.com/juijs-vue/" target="_blank"><div class="img img-download1"></div></a>&nbsp;
                <slot name="download-button" />
            </span>

            <i class="icon-menu" @click="menuOpen = true"></i>
        </div>
    </header>

    <div class="menu-window" ref="menuWindowEl">
        <div class="container">
            <div class="nav">
                <i class="icon-close" @click="menuOpen = false"></i>
            </div>
            <ul class="menu">
                <li><a :href="pageHref('install')" @click="menuOpen = false">Getting Started</a></li>
                <li><a :href="pageHref('basic')" @click="menuOpen = false">Basic</a></li>
                <li><a :href="pageHref('chart')" @click="menuOpen = false">Charts</a></li>
                <li><a :href="`${base}play/ui/`" target="_blank">Components</a></li>
                <li><a :href="`${base}play/chart/`" target="_blank">Chart Play</a></li>
                <li><a :href="pageHref('gallery')" @click="menuOpen = false">Gallery</a></li>
                <li><a href="http://api.jui.io" target="_blank">API</a></li>
            </ul>
        </div>
    </div>
</template>
