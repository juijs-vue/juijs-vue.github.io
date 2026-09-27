import { createRouter, createWebHistory } from "vue-router"
import Shell from "./pages/Shell.vue"

// The shell lives on a single path and branches on the `p`/`lang` query
// params (matching the original's `/?p=<page>&lang=<lang>` scheme exactly, so
// external links/bookmarks keep working) - see Shell.vue for the branching.
// play/ui keeps its own separate `/play/ui/?p=<code>` prefix the same way.
// play/ui is lazy (unlike Shell) because it pulls in @vue/repl for the live
// editor - a ~1.6MB dependency that would otherwise bloat every page's
// initial bundle, including ones with nothing to do with play/ui.
export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: "/", name: "shell", component: Shell },
        { path: "/play/ui/", name: "play-ui", component: () => import("./pages/PlayUi.vue") },
        // play/chart converted to the same architecture as play/ui above (real
        // .vue SFC demos + a @vue/repl live editor) - every entry in
        // play/chart/menu.json now has a matching web/src/demos/chart/*.vue,
        // loaded generically by PlayChart.vue via import.meta.glob.
        { path: "/play/chart/", name: "play-chart", component: () => import("./pages/PlayChart.vue") }
    ]
})
