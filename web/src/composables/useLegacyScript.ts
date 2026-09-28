import { onMounted, onBeforeUnmount } from "vue"

// Loads a plain (non-module) legacy <script> fresh on mount and removes the
// tag on unmount - mirrors the original's per-page-load <script> include
// (Chart.vue's res/chart.js binds a single `$(window).scroll` handler with
// module-global chart_1/2/3 guards; this component only ever mounts once per
// real browser page load since page navigation stays a full reload, so this
// matches the original's "fresh globals every visit" behavior exactly).
export function useLegacyScript(src: string) {
    let el: HTMLScriptElement | null = null

    onMounted(() => {
        el = document.createElement("script")
        el.src = src
        document.body.appendChild(el)
    })
    onBeforeUnmount(() => {
        el?.remove()
    })
}
