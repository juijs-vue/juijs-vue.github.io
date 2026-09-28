import { onMounted, onBeforeUnmount } from "vue"

// Injects a <link rel="stylesheet"> while the calling page is mounted, then
// removes it - for CSS that must NOT apply globally (unlike the plain SFC
// <style> blocks Vite always bundles into the one global stylesheet
// regardless of which component is active). play/ui/style.css has selectors
// like a bare `h2 {...}` that would otherwise bleed into the shell's own
// pages, matching production only ever loading it within play/ui's own
// index.html.
// The returned `loaded` promise resolves once the stylesheet has actually
// been fetched/applied (link "load" event) - appendChild alone only starts
// the fetch, so code relying on this CSS's layout (e.g. measuring offsets
// for a scroll-into-view) must await it rather than running in the same
// mount tick.
export function useStylesheet(href: string): { loaded: Promise<void> } {
    let el: HTMLLinkElement | null = null
    let resolveLoaded: () => void
    const loaded = new Promise<void>((resolve) => {
        resolveLoaded = resolve
    })
    onMounted(() => {
        el = document.createElement("link")
        el.rel = "stylesheet"
        el.href = href
        el.onload = () => resolveLoaded()
        el.onerror = () => resolveLoaded()
        document.head.appendChild(el)
    })
    onBeforeUnmount(() => {
        el?.remove()
    })
    return { loaded }
}
