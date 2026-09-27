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
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue"
import { useRoute } from "vue-router"
import { File, mergeImportMap, Repl, useStore, useVueImportMap } from "@vue/repl"
import CodeMirror from "@vue/repl/codemirror-editor"
import "@vue/repl/style.css"
import type { GridColumn, GridRow } from "jui-grid-vue"
import { DataGrid } from "jui-grid-vue"
import { Colorpicker, Notify, Tab, Window } from "jui-ui-vue"
import menu from "../../../play/chart/menu.json"
import { useStylesheet } from "../composables/useStylesheet"
import { useBodyClass } from "../composables/useBodyClass"
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
// changes to this page (ESPECIALLY the Style tab below, which depends
// entirely on the sandbox's <Chart ref="chartRef"> resolving) against a
// production build, not `npm run dev`.
import juiChartVueEsUrl from "jui-chart-vue?url"
import juiChartVueCssUrl from "jui-chart-vue/style.css?url"
import vueEsmBrowserUrl from "vue/dist/vue.esm-browser.js?url"

const shellCss = useStylesheet(playShellStyleHref)

// jui-ui-vue/jui-grid-vue's own CSS (`.jui .btn`, `.jui .colorpicker`, the
// `.jui-grid-vue-root` grid theme, etc.) is already loaded globally by
// main.ts - but PlayChart.vue/PlayUi.vue are TOP-LEVEL routes (router.ts),
// not children of Shell.vue, so Shell's own `useBodyClass("jui")` never runs
// for this page. The "Edit Colors..." <Window> below additionally renders via
// `<Teleport to="body">` (jui-ui-vue's Window.vue), landing OUTSIDE this
// component's own DOM subtree entirely - a wrapping `<div class="jui">` in
// this page's own template wouldn't reach it. Only `document.body.className`
// covers both cases. "jennifer" is deliberately left off, matching the legacy
// chart shell's own `<body class="jui">` (not "jui jennifer" - that variant
// is PlayUi.vue-only).
useBodyClass("jui")

const base = import.meta.env.BASE_URL

// Eager for the same reason as PlayUi.vue: avoids the live-editor sandbox
// flashing @vue/repl's own default "Hello World!" welcome file before the
// real demo source arrives a tick later.
const demoSources = import.meta.glob<string>("../demos/chart/*.vue", { query: "?raw", import: "default", eager: true })

// ---------------------------------------------------------------------------
// localStorage-backed code/theme persistence - restores the legacy Flask
// shell's "remember what I last typed/themed for this demo" behavior
// (chart.js's viewCodeEditor()/saveCode()/applyThemeRows(), both on `main`).
// Same two key prefixes the legacy shell used ("jui.chartplay.code."/
// "jui.chartplay.theme.", each suffixed with the demo's own key - this page's
// `code` computed below IS the legacy getChartKey()), so switching demos via
// the sidebar never mixes up two different demos' saved code/theme.
//
// @vue/repl itself does NOT do this on its own - confirmed by reading its
// dist bundle: the only thing it persists to localStorage is a "show
// compile-error overlay" toggle (SHOW_ERROR_KEY), nothing about file content,
// and nothing keyed by demo. So this whole section is required, not optional
// glue on top of some existing auto-save.
// ---------------------------------------------------------------------------
function codeStorageKey(demoCode: string) {
    return `jui.chartplay.code.${demoCode}`
}
function themeStorageKey(demoCode: string) {
    return `jui.chartplay.theme.${demoCode}`
}

function demoSourceFor(demoCode: string): string {
    return demoSources[`../demos/chart/${demoCode}.vue`] ?? `<template>\n  <div>Unknown demo: ${demoCode}</div>\n</template>\n`
}

// Legacy viewCodeEditor(): "if a cached copy of this demo's code exists, load
// that instead of the demo's own original source".
function initialSourceFor(demoCode: string): string {
    return localStorage.getItem(codeStorageKey(demoCode)) ?? demoSourceFor(demoCode)
}

const defaultCode = menu.list[0]?.code ?? ""

const route = useRoute()
const code = computed(() => (typeof route.query.p === "string" ? route.query.p : defaultCode))
const initialSource = initialSourceFor(code.value)

// ---------------------------------------------------------------------------
// Style tab (theme editor) - restores the "Style" tab the old Flask-served
// play/chart shell (chart.js/templates/play/chart/index.html, both on `main`)
// had next to "Code": a data-grid of the live chart's theme key/values, with
// inline color-swatch/Colorpicker/image-preview rendering per key and a
// popup <Window> for editing the `colors` array. See below for how it reaches
// into the sandboxed demo to get at the live jui-graph-ts Builder instance.
// ---------------------------------------------------------------------------

const tabIndex = ref(0)
const tabItems = [
    { text: "Code", value: "code" },
    { text: "Style", value: "style" }
]

// The sandbox preview is a fully separate iframe document, so it needs its
// own stylesheet + a fill-the-viewport rule (<Chart>'s own wrapper is
// width/height:100%, per jui-chart-vue's Chart.vue - it has nothing to fill
// without this, unlike play/ui's demos which flow normally in-document).
//
// The inline <script> is this page's bridge into the sandbox: @vue/repl's own
// compiled preview entry (see its `_mount()`, vue-repl.js) does
// `const app = window.__app__ = createApp(AppComponent); ...; app.mount('#app')`
// - it does NOT expose the mounted root instance any further than that global.
// Confirmed via Playwright against a real build+preview run (dumping
// `app._instance.refs`) that for a demo written the way this project's
// convention requires (`<Chart ref="chartRef" .../>` - see
// demos/chart/brush_event.vue), the exposed value lands at
// `app._instance.refs.chartRef` and is already `<Chart>`'s own
// `defineExpose({ getBuilder })` object (Vue's template-ref assignment for a
// `<script setup>` root resolves straight to the child's exposed proxy, not
// its full internal instance) - i.e. `refs.chartRef.getBuilder()` returns the
// live jui-graph-ts `Builder`, exactly like `chartRef.value.getBuilder()`
// inside the demo's own `<script setup>`. This script re-exposes that lookup
// as `window.__getCurrentBuilder__` on the SANDBOX's own `window` (not this
// page's), lazily (re-reads `window.__app__` on every call) so it keeps
// working across every recompile - @vue/repl's `compileAndDisplay()` replaces
// `window.__app__` (unmount + reassign) on every edit without ever reloading
// the iframe document itself (only import-map/theme changes do a real
// `location.reload()`), so this <script>, injected once via `headHTML`,
// survives for the sandbox's whole lifetime.
// Deliberately generic (scans EVERY ref/exposed-state entry for a
// `getBuilder` function, not just one literally named "chartRef") so a future
// demo using a different ref name - or none at all, in which case it simply
// finds nothing and returns null - doesn't need this script touched.
const previewHeadHtml = `
<link rel="stylesheet" href="${juiChartVueCssUrl}">
<style>html, body, #app { height: 100%; margin: 0; }</style>
<script>
(function () {
  function unwrap(v) {
    return v && v.__v_isRef ? v.value : v
  }
  function findBuilderRef(instance) {
    if (!instance) return null
    var buckets = [instance.refs, instance.exposed, instance.setupState]
    for (var i = 0; i < buckets.length; i++) {
      var bucket = buckets[i]
      if (!bucket) continue
      for (var key in bucket) {
        var candidate = unwrap(bucket[key])
        if (candidate && typeof candidate.getBuilder === "function") return candidate
      }
    }
    return null
  }
  window.__getCurrentBuilder__ = function () {
    var app = window.__app__
    var instance = app && app._instance
    var target = findBuilderRef(instance)
    return target ? target.getBuilder() : null
  }
})()
<\/script>
`

// A STABLE object reference, not an inline `{ headHTML: previewHeadHtml }`
// literal in the template - real bug this closes, Playwright-confirmed:
// `<Repl>`'s own Sandbox.vue reads `previewOptions.value` (a `toRefs(props)`
// ref) from INSIDE a `watchEffect(updatePreview)` (vue-repl.js) - as soon as
// this page's `.style-panel` overlay rect started being tracked every
// animation frame (see `rectLoop()` below), THIS component's render function
// started re-running 60x/sec, and an inline object literal gets a brand-new
// identity on every one of those re-renders. Vue's prop-change check for an
// object prop is a reference comparison, so `<Repl>` saw that as
// `previewOptions` "changing" 60x/sec, re-triggering `updatePreview()` (a
// full recompile + sandbox app unmount/remount) continuously - which in turn
// silently discarded any `setTheme()` call made from this page within
// milliseconds of it running (a fresh `<Chart>` mount always starts from its
// own static props again). A stable reference here means <Repl> only ever
// sees a real change when `previewHeadHtml` itself changes (never, after
// module init) - confirmed via Playwright: only one initial "successfully
// compiled" log now, not hundreds/sec, and setTheme() edits stick.
const previewOptions = { headHTML: previewHeadHtml }

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

// --- Reaching into the sandbox iframe from this page ------------------------
// The iframe is recreated wholesale on a real reload (import-map/theme
// changes) and its <Chart>'s ref can briefly be null right after a demo
// switch or while a fresh edit is still compiling - every call point below is
// written to tolerate `null` at any of these steps (mirrors the legacy
// createTableStyle()'s own `if (chart == null) { ...clear grid...; return }`
// guard for demos that hadn't been ported to the Vue-based engine yet).
const replWrapEl = ref<HTMLElement | null>(null)

function getSandboxWindow(): (Window & { __getCurrentBuilder__?: () => unknown }) | null {
    const iframe = replWrapEl.value?.querySelector(".iframe-container iframe") as HTMLIFrameElement | null
    return (iframe?.contentWindow as (Window & { __getCurrentBuilder__?: () => unknown }) | null | undefined) ?? null
}

function getCurrentBuilder(): any {
    try {
        const win = getSandboxWindow()
        return typeof win?.__getCurrentBuilder__ === "function" ? win.__getCurrentBuilder__() : null
    } catch {
        // Cross-origin/detached-iframe access errors, or a mid-teardown sandbox -
        // treat exactly like "no chart yet", never let this throw into a template.
        return null
    }
}

// --- Theme grid state ---------------------------------------------------

type ThemeRowData = { key: string; value: unknown }
type ThemeRow = GridRow<ThemeRowData>

const themeColumns: GridColumn[] = [
    { key: "key", label: "Key", resizable: true },
    { key: "value", label: "Value", editable: true, resizable: true }
]
const themeRows = reactive<ThemeRow[]>([])

function isColorKey(key: string): boolean {
    return typeof key === "string" && key.indexOf("Color") !== -1
}
function isImageKey(key: string): boolean {
    return typeof key === "string" && key.indexOf("Image") !== -1
}

function fillThemeRowsFromChart(chart: any) {
    const themes = chart.theme()
    const rows: ThemeRow[] = []
    for (const key in themes) {
        rows.push({
            id: key,
            data: { key, value: key === "colors" ? themes[key].join("|") : themes[key] }
        })
    }
    themeRows.splice(0, themeRows.length, ...rows)
}

// The demo may still be compiling (freshly switched via the sidebar, or the
// very first paint after this page loads) when the Style tab is opened -
// retry for up to ~3s before giving up and just showing an empty grid
// (matching the legacy shell's silent no-op for demos with no live chart).
let themeRefreshTimer: ReturnType<typeof setTimeout> | null = null
function refreshThemeGrid(attemptsLeft = 15) {
    if (themeRefreshTimer != null) {
        clearTimeout(themeRefreshTimer)
        themeRefreshTimer = null
    }

    const chart = getCurrentBuilder()
    if (chart) {
        fillThemeRowsFromChart(chart)
        return
    }
    if (attemptsLeft <= 0) {
        themeRows.splice(0, themeRows.length)
        return
    }
    themeRefreshTimer = setTimeout(() => refreshThemeGrid(attemptsLeft - 1), 200)
}

function themeRowsToObject(): Record<string, unknown> {
    const theme: Record<string, unknown> = {}
    for (const row of themeRows) {
        const d = row.data
        theme[d.key] = d.key === "colors" ? String(d.value).split("|") : d.value
    }
    return theme
}

// DataGrid's own useEditableRow already merges the committed edit into
// `row.data` in place (see jui-grid-vue's DataGrid.vue: `Object.assign(row.data,
// data)` right before it emits `row-edit`) - by the time this fires,
// `themeRows` already reflects the edit, so re-reading it is enough.
function onThemeRowEdit() {
    const chart = getCurrentBuilder()
    if (!chart) return
    const theme = themeRowsToObject()
    chart.setTheme(theme)
    // Legacy applyThemeRows() persisted on every grid edit too (chart.js,
    // `localStorage.setItem("jui.chartplay.theme." + getChartKey(), ...)`) -
    // missing from this page's first Style-tab port, added back here so a
    // theme tweak survives a reload without an explicit "Export Theme" step.
    localStorage.setItem(themeStorageKey(code.value), JSON.stringify(theme))
}

// --- "Edit Colors..." popup ----------------------------------------------

type ColorRowData = { color: string }
type ColorRow = GridRow<ColorRowData>

const colorsWinVisible = ref(false)
const colorsColumns: GridColumn[] = [{ key: "color", label: "Color", editable: true }]
const colorsRows = reactive<ColorRow[]>([])

let colorsWinDraft: Record<string, unknown> | null = null
let colorsWinCommit: (() => void) | null = null
let colorsWinCancel: (() => void) | null = null

// Closing the window any way other than Save/Cancel (backdrop click, the
// title bar's close icon) still needs to cancel the in-progress grid edit -
// the Save path already clears these refs before hiding, so it can't
// double-cancel itself here.
watch(colorsWinVisible, (visible) => {
    if (!visible && colorsWinCommit) cancelColorsWindow()
})

function openColorsWindow(draft: Record<string, unknown>, commit: () => void, cancel: () => void) {
    colorsWinDraft = draft
    colorsWinCommit = commit
    colorsWinCancel = cancel

    const list = String(draft.value).split("|")
    colorsRows.splice(0, colorsRows.length, ...list.map((color, i) => ({ id: i, data: { color } })))

    colorsWinVisible.value = true
}

function saveColorsWindow() {
    if (!colorsWinDraft || !colorsWinCommit) return

    colorsWinDraft.value = colorsRows.map((r) => r.data.color).join("|")
    colorsWinCommit()

    colorsWinDraft = null
    colorsWinCommit = null
    colorsWinCancel = null
}

function cancelColorsWindow() {
    colorsWinCancel?.()

    colorsWinDraft = null
    colorsWinCommit = null
    colorsWinCancel = null
}

// --- Export/Import theme ---------------------------------------------------
// The legacy versions (chart.js's exportTheme/importTheme, both on `main`)
// round-tripped through a `jui.redefine("chart.theme.custom", [], function ()
// { return {...} })` JS snippet (the old jui.js v1 theme-registration format)
// and a server-side `export.php` form-POST for the actual file download -
// neither applies to this new architecture: jui-chart-vue's `Builder.setTheme()`
// takes a plain object directly (no `jui.redefine` registry at all), and this
// is a static SPA with no backend to POST a download through. Re-done here as
// a plain JSON file + a client-side Blob download - functionally equivalent
// (still a portable, re-importable snapshot of the current theme), just in a
// format that actually fits the new engine/deployment.
function exportTextFile(name: string, text: string, type = "application/json") {
    const blob = new Blob([text], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = name
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
}

function exportTheme() {
    exportTextFile(`${code.value.split(".").join("_")}_theme.json`, JSON.stringify(themeRowsToObject(), null, 2))
}

// Single entry point for "this plain theme object is now THE theme for the
// currently-active demo": fills the grid, pushes it to the live chart, and
// persists it under this demo's own localStorage key - same JSON shape the
// Export Theme button writes to a file (colors already a real array, not the
// grid's "|"-joined display string), so both the file round-trip
// (importTheme below) and the localStorage round-trip (restoreSavedTheme
// below) share one format.
function applyThemeObject(theme: Record<string, unknown>) {
    const rows: ThemeRow[] = []
    for (const key in theme) {
        const v = theme[key]
        rows.push({ id: key, data: { key, value: Array.isArray(v) ? v.join("|") : v } })
    }
    themeRows.splice(0, themeRows.length, ...rows)

    getCurrentBuilder()?.setTheme(theme)
    localStorage.setItem(themeStorageKey(code.value), JSON.stringify(theme))
}

function importTheme(e: Event) {
    const input = e.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
        try {
            applyThemeObject(JSON.parse(String(reader.result)))
        } catch (err) {
            console.error("Failed to import theme JSON", err)
            alert("Invalid theme file - expected the JSON this page's own Export Theme button produces.")
        }
        input.value = ""
    }
    reader.readAsText(file)
}

// Legacy viewCodeEditor(): "if a theme was cached for this demo, re-apply it
// on load" (there: `eval(theme)` + `chart.setTheme(jui.include(...))`; here:
// the same `applyThemeObject()` used by Import Theme/onThemeRowEdit above).
// The sandboxed demo may still be compiling (first paint, or right after a
// demo switch) when this runs - retry for ~3s before giving up silently,
// same shape as refreshThemeGrid()'s own retry loop. Also re-checks `code`
// itself on every retry: if the user has already switched to a different demo
// by the time the builder shows up, this stale call must not stomp that demo's
// theme.
function restoreSavedTheme(demoCode: string, attemptsLeft = 15) {
    const saved = localStorage.getItem(themeStorageKey(demoCode))
    if (!saved) return
    if (demoCode !== code.value) return

    if (getCurrentBuilder()) {
        try {
            applyThemeObject(JSON.parse(saved))
        } catch (err) {
            console.error("Failed to restore saved theme", err)
        }
        return
    }
    if (attemptsLeft <= 0) return
    setTimeout(() => restoreSavedTheme(demoCode, attemptsLeft - 1), 200)
}

// --- Style panel layout ------------------------------------------------
// @vue/repl's <Repl layout="horizontal"> draws its own code editor and
// preview side by side INSIDE one component (a SplitPane.vue with `.left`/
// `.right`, draggable) - there's no seam to swap just the "Code" side for a
// "Style" panel while leaving the preview alone, short of reaching into its
// rendered DOM. This measures `.split-pane > .left`'s live box (its width
// changes continuously while the user drags the splitter, tracked via
// `.left`'s own inline `style="width: N%"` - see vue-repl's SplitPane.vue)
// every animation frame and mirrors it onto `.style-panel`, an absolutely
// positioned overlay that sits on top of `.left` while the Style tab is
// active - see the `.style-mode` rule below, which hides `.left`'s real
// children (the file selector + code editor) without touching `.left` itself
// (so this measurement keeps working) or anything in `.right` (the actual
// live preview iframe, untouched either way).
const leftPaneRect = ref({ left: 0, top: 0, width: 0, height: 0 })

function updateLeftPaneRect() {
    const wrap = replWrapEl.value
    const leftEl = wrap?.querySelector(".split-pane > .left") as HTMLElement | null
    if (!wrap || !leftEl) return

    const wrapRect = wrap.getBoundingClientRect()
    const leftRect = leftEl.getBoundingClientRect()
    leftPaneRect.value = {
        left: leftRect.left - wrapRect.left,
        top: leftRect.top - wrapRect.top,
        width: leftRect.width,
        height: leftRect.height
    }
}

const stylePanelStyle = computed(() => ({
    left: `${leftPaneRect.value.left}px`,
    top: `${leftPaneRect.value.top}px`,
    width: `${leftPaneRect.value.width}px`,
    height: `${leftPaneRect.value.height}px`
}))

// Only runs while the Style tab is actually visible - `.style-panel` is the
// only thing that needs this measurement (see its own comment above), and
// looping unconditionally would re-render this whole component 60x/sec for
// no reason even on the Code tab (see `previewOptions`'s comment above for
// why that specific side effect was a real, previously-shipped bug here).
let rectRafId: number | null = null
function rectLoop() {
    updateLeftPaneRect()
    rectRafId = requestAnimationFrame(rectLoop)
}
function stopRectLoop() {
    if (rectRafId != null) {
        cancelAnimationFrame(rectRafId)
        rectRafId = null
    }
}

watch(
    tabIndex,
    (idx) => {
        if (idx === 1) {
            refreshThemeGrid()
            updateLeftPaneRect()
            if (rectRafId == null) rectRafId = requestAnimationFrame(rectLoop)
        } else {
            stopRectLoop()
        }
    },
    { immediate: true }
)

watch(code, (newCode) => {
    store.setFiles({ "App.vue": initialSourceFor(newCode) }, "App.vue")
    // The old chart's Builder (and its `window.__app__`) is gone the instant
    // the sandbox recompiles for the new demo - re-fill (or clear) the grid
    // for whichever demo is now live, same retry-then-give-up behavior as
    // first opening the Style tab.
    if (tabIndex.value === 1) refreshThemeGrid()
    restoreSavedTheme(newCode)
})

// ---------------------------------------------------------------------------
// Notify toast + Clear/Clear All/Save/CSV toolbar - restores the rest of the
// legacy Flask shell's chrome (chart.js/templates/play/chart/index.html, both
// on `main`) that the Style-tab port above didn't need yet: chart.js's
// saveCode()/clearCode()/clearAllCode()/exportCsv()/importCsv(), and the
// `<Notify ref="notifyRef">` the legacy template mounted at `#chart-shell-
// modals` next to the "Edit Colors" <Window>.
//
// The legacy template also had a header `<select>` to CHANGE themes by name
// (changeTheme(), chart.js) - deliberately not ported: this new architecture
// has no such dropdown anywhere (the Style tab's live grid editor replaced
// it), so there's nothing here for that toast branch to attach to.
// ---------------------------------------------------------------------------

const notifyRef = ref<{ add: (data: { title: string; message: string; color: string }) => void } | null>(null)

// Legacy menu.json entries can opt individual demos out of the CSV group
// (`"csv": false` - server-side `csv = data.get("csv", True)` in app.py's
// play_chart_index()); everything else defaults to showing it.
const csvEnabled = computed(() => {
    const entry = (menu.list as { code: string; csv?: boolean }[]).find((item) => item.code === code.value)
    return entry ? entry.csv !== false : true
})

function saveCode() {
    localStorage.setItem(codeStorageKey(code.value), store.activeFile.code)
    // Legacy saveCode() (chart.js) really did use `color: "danger"` for this
    // SUCCESS toast - almost certainly a copy-paste mistake there, but kept
    // as-is here: it's purely cosmetic, and this whole porting pass otherwise
    // preserves the legacy shell's behavior (including its known-odd bits,
    // e.g. the dead "Leave a comment" link) rather than second-guessing it.
    notifyRef.value?.add({
        title: code.value,
        message: "The source code has been saved.",
        color: "danger"
    })
}

function clearCode() {
    if (confirm("Clear the code and data cache?")) {
        localStorage.removeItem(codeStorageKey(code.value))
        // Legacy clearCode() did a real `location.reload()` too. A full
        // reload is simpler and more certain here than hand-resetting
        // `store`/the Style-tab grid/the sandbox iframe (all three would
        // otherwise need to be put back exactly to "freshly loaded" by hand),
        // and it takes the same code path this page already uses for a
        // normal first visit - route's `?p=` is untouched, so it lands back
        // on the same demo, now re-reading its original source.
        location.reload()
    }
}

function clearAllCode() {
    if (confirm("Clear all code and data cache?")) {
        localStorage.clear()
        location.reload()
    }
}

// Ported from chart.js's getCsvToObject()/dataToCsv() (both pure string/data
// logic already, no jQuery). The legacy getCsvToObject() built a JS
// array-literal STRING and `eval()`'d it back into an array to hand to
// axis(0).update() - this builds the array of row objects directly instead
// (same field-type inference: bare digits -> number, a single/double-quoted
// value -> string with the quotes stripped, anything else -> string as-is),
// same net result without the eval() round-trip.
function getCsvToObject(csv: string): Record<string, unknown>[] {
    const rows = csv.split("\n")
    const fields = rows[0].split(",")
    const data: Record<string, unknown>[] = []

    for (let i = 1; i < rows.length - 1; i++) {
        const cells = rows[i].split(",")
        const record: Record<string, unknown> = {}

        for (let j = 0; j < cells.length; j++) {
            const v = cells[j].trim()
            // Legacy getCsvToObject() (chart.js) used `/^[0-9]*$/` - no
            // leading "-", no decimal point - so re-importing its OWN CSV
            // export unmodified quoted every negative number back into a
            // string ("-20" instead of -20), which the demo's chart engine
            // then can't do axis-range math on (confirmed here: produces
            // "<path> d: Expected number...VNaN" console errors even on an
            // untouched round-trip). Widened to `-?digits(.digits)?` so a
            // straight export -> import round-trip of this page's own CSV
            // stays numeric, without changing the file format itself.
            if (/^-?[0-9]+(\.[0-9]+)?$/.test(v)) {
                record[fields[j]] = Number(v)
            } else if ((v.startsWith('"') && v.endsWith('"') && v.length >= 2) || (v.startsWith("'") && v.endsWith("'") && v.length >= 2)) {
                record[fields[j]] = v.slice(1, -1)
            } else {
                record[fields[j]] = v
            }
        }
        data.push(record)
    }

    return data
}

function dataToCsv(data: Record<string, unknown>[] | undefined | null): string {
    if (!data || data.length === 0) return ""

    const fields = Object.keys(data[0]).filter((key) => typeof data[0][key] !== "function")
    const rows = [fields.join(",")]

    for (const row of data) {
        rows.push(fields.map((f) => String(row[f])).join(","))
    }

    return rows.join("\n") + "\n"
}

function exportCsv() {
    const chart = getCurrentBuilder()
    if (!chart) return
    const csv = dataToCsv(chart.get("axis", 0)?.data)
    exportTextFile(`${code.value.split(".").join("_")}.csv`, csv, "text/csv")
}

function importCsv(e: Event) {
    const input = e.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
        try {
            const data = getCsvToObject(String(reader.result))
            // Real bug this closes, Playwright-confirmed: `data` here is an
            // array/objects built by THIS PAGE's own Array/Object
            // constructors, but axis(0).update() runs inside the sandboxed
            // iframe's own separate JS realm. Handing it that array as-is
            // silently breaks the chart engine's internal d3 data-join (the
            // values themselves come back correct from chart.get("axis",0).data
            // afterwards - this is a rendering-only symptom, not a data
            // one): every path in the live SVG preview renders as a broken
            // "…VNaN…" `d` attribute. Round-tripping through the SANDBOX's
            // OWN `JSON.parse` (not this page's) re-materializes the same
            // values as plain objects/arrays that belong to the iframe's own
            // realm, which the chart's data-join handles correctly - a
            // strictly stronger version of the exact same cross-realm
            // problem getCurrentBuilder() itself exists to route around for
            // reading the builder in the first place.
            const win = getSandboxWindow()
            const sameRealmData = win ? (win as unknown as { JSON: JSON }).JSON.parse(JSON.stringify(data)) : data
            getCurrentBuilder()?.axis(0)?.update(sameRealmData)
        } catch (err) {
            console.error("Failed to import CSV", err)
            alert("Invalid CSV file.")
        }
        input.value = ""
    }
    reader.readAsText(file)
}

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
onMounted(() => {
    scrollToActive()
    restoreSavedTheme(code.value)
})
watch(code, () => scrollToActive(), { flush: "post" })

onBeforeUnmount(() => {
    stopRectLoop()
    if (themeRefreshTimer != null) clearTimeout(themeRefreshTimer)
})

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
                <div class="chart-tabs">
                    <Tab v-model="tabIndex" :items="tabItems" />
                    <div class="chart-tab-tools">
                        <template v-if="tabIndex === 0">
                            <button type="button" class="btn small" @click="clearCode">Clear</button>
                            <button type="button" class="btn small" @click="clearAllCode">Clear All</button>
                            <button type="button" class="btn small" title="Save source code" @click="saveCode">
                                <i class="icon-save"></i>
                            </button>
                            <template v-if="csvEnabled">
                                <button type="button" class="btn small" title="Export CSV file" @click="exportCsv">
                                    <i class="icon-download"></i>
                                </button>
                                <label class="btn small file-btn" title="Import CSV file">
                                    <i class="icon-upload"></i>
                                    <input type="file" accept=".csv,text/csv" @change="importCsv" />
                                </label>
                            </template>
                        </template>
                        <template v-if="tabIndex === 1">
                            <button type="button" class="btn small" title="Export Theme file" @click="exportTheme">
                                <i class="icon-download"></i>
                            </button>
                            <label class="btn small file-btn" title="Import Theme file">
                                <i class="icon-upload"></i>
                                <input type="file" accept="application/json" @change="importTheme" />
                            </label>
                        </template>
                        <a class="btn small btn-api" title="Chart API" href="http://api.jui.io/" target="_blank">API</a>
                        <a class="btn small btn-fullscreen" title="Full Screen" @click="fullscreen = !fullscreen"><i class="icon-new-window"></i></a>
                    </div>
                </div>
                <div class="repl-wrap" ref="replWrapEl" :class="{ 'style-mode': tabIndex === 1 }">
                    <Repl
                        :store="store"
                        :editor="CodeMirror"
                        :show-compile-output="false"
                        :show-open-source-map="false"
                        :show-import-map="false"
                        :show-ts-config="false"
                        :preview-options="previewOptions"
                        layout="horizontal"
                    />
                    <div v-show="tabIndex === 1" class="style-panel" :style="stylePanelStyle">
                        <DataGrid
                            class="theme-grid"
                            :columns="themeColumns"
                            :rows="themeRows"
                            editable
                            resizable
                            theme="classic"
                            variant="simple"
                            headline
                            @row-edit="onThemeRowEdit"
                        >
                            <template #cell-value="{ row, value }">
                                <span v-if="row.data.key === 'colors'" class="theme-colors-preview">
                                    <span
                                        v-for="(c, i) in String(value).split('|')"
                                        :key="i"
                                        class="theme-color-swatch"
                                        :style="{ background: c }"
                                        :title="c"
                                    ></span>
                                </span>
                                <span v-else-if="isColorKey(row.data.key)" class="theme-color-swatch theme-color-swatch-wide" :style="{ background: value }">{{
                                    value
                                }}</span>
                                <img v-else-if="isImageKey(row.data.key)" :src="value" class="theme-image-preview" />
                                <span v-else>{{ value }}</span>
                            </template>
                            <template #edit-value="{ row, draft, commit, cancel }">
                                <div v-if="row.data.key === 'colors'" class="theme-edit-colors">
                                    <button type="button" class="btn small" @click="openColorsWindow(draft, commit, cancel)">Edit Colors&hellip;</button>
                                    <button type="button" class="btn small" @click="cancel">Cancel</button>
                                </div>
                                <div v-else-if="isColorKey(row.data.key)" class="theme-edit-color">
                                    <Colorpicker v-model="draft.value" />
                                    <div class="theme-edit-color-actions">
                                        <button type="button" class="btn small" @click="commit">Apply</button>
                                        <button type="button" class="btn small" @click="cancel">Cancel</button>
                                    </div>
                                </div>
                                <input v-else class="edit" type="text" v-model="draft.value" @keyup.enter="commit" @blur="commit" @keyup.esc="cancel" />
                            </template>
                        </DataGrid>
                    </div>
                </div>
            </div>
        </div>

        <Window v-model="colorsWinVisible" title="Edit Colors" :width="360" :height="420" modal :move="true" :resize="true">
            <DataGrid class="theme-grid" :columns="colorsColumns" :rows="colorsRows" editable resizable theme="classic" variant="simple" headline>
                <template #cell-color="{ value }">
                    <span class="theme-color-swatch theme-color-swatch-wide" :style="{ background: value }">{{ value }}</span>
                </template>
                <template #edit-color="{ draft, commit, cancel }">
                    <Colorpicker v-model="draft.color" />
                    <div class="theme-edit-color-actions">
                        <button type="button" class="btn small" @click="commit">Apply</button>
                        <button type="button" class="btn small" @click="cancel">Cancel</button>
                    </div>
                </template>
            </DataGrid>
            <template #foot="{ hide }">
                <a href="#" class="btn focus" @click.prevent="saveColorsWindow(); hide()">Save</a>
                <a href="#" class="btn" @click.prevent="cancelColorsWindow(); hide()">Cancel</a>
            </template>
        </Window>

        <!-- Legacy `<Notify ref="notifyRef" position="top-right" :timeout="3000">`
             (templates/play/chart/index.html, `#chart-shell-modals`). Unlike
             <Window> above, Notify.vue doesn't <Teleport> itself to <body> -
             it just needs SOME non-positioned ancestor chain up to the
             viewport for its own `position: absolute` math to land in the
             page's actual top-right corner rather than some inner panel's -
             true here since neither `.play-ui-page` nor anything above it
             (App.vue's bare `<RouterView />`) sets `position`. -->
        <Notify ref="notifyRef" position="top-right" :timeout="3000" />
    </div>
</template>

<style scoped>
.menu.hidden {
    display: none;
}

.content.fullscreen {
    left: 0;
}

.chart-tabs {
    position: absolute;
    z-index: 4;
    left: 0;
    right: 0;
    top: 0;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    background: #fff;
    border-bottom: 1px solid #ddd;
}

.chart-tab-tools {
    display: flex;
    align-items: center;
    gap: 6px;
}

.chart-tab-tools .file-btn {
    position: relative;
    overflow: hidden;
}

.chart-tab-tools .file-btn input[type="file"] {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
}

.repl-wrap {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 40px;
}

.repl-wrap :deep(.vue-repl) {
    height: 100%;
}

/* Hides the live code editor's own DOM (file selector + editor-container)
   while the Style tab is active, WITHOUT touching `.left` itself (its box -
   sized by @vue/repl's own draggable split - is what `.style-panel` mirrors
   above) or anything under `.right` (the real preview iframe). `.dragger` is
   excluded so the split can still be resized while viewing Style, keeping
   `.style-panel` (tracked every frame) in sync either way. */
.repl-wrap.style-mode :deep(.split-pane > .left > *:not(.dragger)) {
    visibility: hidden;
    pointer-events: none;
}

.style-panel {
    position: absolute;
    overflow: auto;
    background: #fff;
    box-sizing: border-box;
    padding: 8px;
    z-index: 3;
}

.theme-grid {
    background: white;
}

.theme-colors-preview {
    display: inline-flex;
    align-items: center;
}

.theme-color-swatch {
    display: inline-block;
    min-width: 60px;
    padding: 2px 6px;
    border: 1px solid #ccc;
}

.theme-colors-preview .theme-color-swatch {
    min-width: 18px;
    height: 18px;
    padding: 0;
    margin-right: 2px;
}

.theme-color-swatch-wide {
    display: block;
}

.theme-image-preview {
    max-height: 20px;
}

.theme-edit-colors,
.theme-edit-color {
    padding: 4px 0;
}

.theme-edit-color-actions {
    margin-top: 4px;
}
</style>
