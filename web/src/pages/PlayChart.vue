<script setup lang="ts">
// Pilot port of play/chart to the same architecture play/ui already uses (see
// PlayUi.vue): a real Vue 3 SPA page hosting a @vue/repl live editor, with each
// demo a genuine .vue SFC (web/src/demos/chart/*.vue) instead of a Flask-served
// json/*.js file that calls `Vue.createApp(...).mount(...)` imperatively.
//
// Unlike jui-ui-vue/jui-grid-vue, jui-chart-vue exports a single named `Chart`
// component (no Vue plugin/`install()`, no global auto-registration) - so demo
// SFCs `import { Chart } from "jui-chart-vue"` themselves, and this page's
// sandbox needs no `previewCustomCode` `app.use(...)` injection.
import { computed, onMounted, ref, watch } from "vue"
import { useRoute } from "vue-router"
import { File, mergeImportMap, Repl, useStore, useVueImportMap } from "@vue/repl"
import CodeMirror from "@vue/repl/codemirror-editor"
import "@vue/repl/style.css"
import menu from "../../../play/chart/menu.json"
import { useStylesheet } from "../composables/useStylesheet"
import PlayChartMenu from "../components/PlayChartMenu.vue"
import playShellStyleHref from "../styles/play-shell.css?url"
// jui-chart-vue isn't on any CDN - self-host its already-built ES module + CSS
// output as ordinary Vite assets, same approach PlayUi.vue uses for
// jui-ui-vue/jui-grid-vue.
//
// KNOWN DEV-MODE-ONLY BUG (does not affect the deployed site): under `npm run
// dev`, any <Chart ref="..."> (or any jui-ui-vue/jui-grid-vue component with a
// ref, e.g. <Tooltip>) inside this page's @vue/repl sandbox never resolves its
// ref ("[Vue warn]: Missing ref owner context..." + the ref staying null
// forever). Root cause: `vite dev`'s server-side import-rewrite transform
// still runs on THIS package's self-hosted dist file when the sandbox iframe
// fetches it through the browser's import map (bypassing Vite's normal
// module-graph resolution, which is the only thing `resolve.dedupe` in
// vite.config.ts actually covers) - it silently redirects that file's own
// internal `import ... from "vue"` to Vite's *dev-only* pre-bundled deps
// cache, a SECOND, separate Vue module instance from the one this page's own
// compiled code and `vueEsmBrowserUrl` use. Two live Vue instances means
// `currentRenderingInstance` tracking (which template refs rely on) is split
// across them, so refs silently never resolve. `vite build` + a real static
// file server (`vite preview`, or the deployed site) has no such server-side
// transform step at all - confirmed working end-to-end there. Always verify
// changes to this page against a production build, not `npm run dev`.
import juiChartVueEsUrl from "jui-chart-vue?url"
import juiChartVueCssUrl from "jui-chart-vue/style.css?url"
import vueEsmBrowserUrl from "vue/dist/vue.esm-browser.js?url"

const shellCss = useStylesheet(playShellStyleHref)

const base = import.meta.env.BASE_URL

// Eager for the same reason as PlayUi.vue: avoids the live-editor sandbox
// flashing @vue/repl's own default "Hello World!" welcome file before the
// real demo source arrives a tick later.
const demoSources = import.meta.glob<string>("../demos/chart/*.vue", { query: "?raw", import: "default", eager: true })

const defaultCode = menu.list[0]?.code ?? ""

const route = useRoute()
const code = computed(() => (typeof route.query.p === "string" ? route.query.p : defaultCode))
const demoPath = computed(() => `../demos/chart/${code.value}.vue`)
const initialSource = demoSources[demoPath.value] ?? `<template>\n  <div>Unknown demo: ${code.value}</div>\n</template>\n`

// The sandbox preview is a fully separate iframe document, so it needs its
// own stylesheet + a fill-the-viewport rule (<Chart>'s own wrapper is
// width/height:100%, per jui-chart-vue's Chart.vue - it has nothing to fill
// without this, unlike play/ui's demos which flow normally in-document).
const previewHeadHtml = `
<link rel="stylesheet" href="${juiChartVueCssUrl}">
<style>html, body, #app { height: 100%; margin: 0; }</style>
`

const { importMap: vueImportMap } = useVueImportMap()
const store = useStore({
    files: ref({ "App.vue": new File("App.vue", initialSource) }),
    mainFile: ref("App.vue"),
    builtinImportMap: ref(
        mergeImportMap(vueImportMap.value, {
            imports: {
                vue: vueEsmBrowserUrl,
                "jui-chart-vue": juiChartVueEsUrl
            }
        })
    )
})
// See PlayUi.vue's identical comment: useStore() always adds its own
// "src/App.vue" welcome-file tab regardless of the `files`/`mainFile` we
// already passed in - delete it before <Repl> ever renders it.
delete store.files["src/App.vue"]

watch(code, () => {
    const src = demoSources[demoPath.value] ?? `<template>\n  <div>Unknown demo: ${code.value}</div>\n</template>\n`
    store.setFiles({ "App.vue": src }, "App.vue")
})

const menuEl = ref<HTMLElement | null>(null)
async function scrollToActive() {
    await shellCss.loaded
    const menu = menuEl.value
    const active = menu?.querySelector("li.active") as HTMLElement | null
    if (active && menu) {
        const contentTop = active.getBoundingClientRect().top - menu.getBoundingClientRect().top + menu.scrollTop
        menu.scrollTop = contentTop - 100
    }
}
onMounted(scrollToActive)
watch(code, () => scrollToActive(), { flush: "post" })

const fullscreen = ref(false)

function goHome() {
    location.href = base
}
</script>

<template>
    <div class="play-ui-page">
        <div class="header">
            <div class="logo">
                <img :src="`${base}res/img/play_logo.png`" align="absmiddle" @click="goHome" />
            </div>
            <div class="toolbar">
                <i id="sidemenu" class="icon-menu"></i>
            </div>
        </div>
        <div class="container">
            <div class="menu" ref="menuEl" :class="{ hidden: fullscreen }">
                <PlayChartMenu :code="code" />
            </div>
            <div class="content" :class="{ fullscreen }">
                <div class="repl-toolbar">
                    <a class="btn btn-api" title="Chart API" href="http://api.jui.io/" target="_blank">API</a>
                    <a class="btn btn-fullscreen" title="Full Screen" @click="fullscreen = !fullscreen"><i class="icon-new-window"></i></a>
                </div>
                <div class="repl-wrap">
                    <Repl
                        :store="store"
                        :editor="CodeMirror"
                        :show-compile-output="false"
                        :show-open-source-map="false"
                        :show-import-map="false"
                        :show-ts-config="false"
                        :preview-options="{ headHTML: previewHeadHtml }"
                        layout="horizontal"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.menu.hidden {
    display: none;
}

.content.fullscreen {
    left: 0;
}

.repl-toolbar {
    position: absolute;
    z-index: 4;
    top: 8px;
    right: 8px;
}

.repl-wrap {
    position: absolute;
    inset: 0;
}

.repl-wrap :deep(.vue-repl) {
    height: 100%;
}
</style>
