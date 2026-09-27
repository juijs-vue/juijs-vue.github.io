// Copies the legacy static directories `vite build` doesn't know about into
// dist/, so the published site is a single self-contained static tree -
// index.html and its bundled assets reference these at runtime (lib/ for
// jui-ui-vue/jui-grid-vue UMD + legacy jquery/jui, res/img + res/chart.js for
// the untouched-by-design home banner charts, gallery/ and play/chart/ for
// the not-yet-ported legacy demos this phase doesn't touch).
import fs from "node:fs"
import path from "node:path"

const ROOT = path.resolve(import.meta.dirname, "../..")
const DIST = path.resolve(import.meta.dirname, "../dist")

const ENTRIES = [
    { from: "lib", to: "lib" },
    { from: "gallery", to: "gallery" },
    { from: "play/chart", to: "play/chart" },
    { from: "res/chart.js", to: "res/chart.js" },
    { from: "res/img", to: "res/img" }
]

for (const { from, to } of ENTRIES) {
    const src = path.join(ROOT, from)
    const dest = path.join(DIST, to)
    fs.cpSync(src, dest, { recursive: true })
    console.log(`copied ${from} -> dist/${to}`)
}

// GitHub Pages serves static files only - there's no server-side rewrite to
// send a path-based route like /play/ui/ to the SPA's index.html the way a
// real webserver's SPA-fallback config would. vue-router's createWebHistory
// only needs *some* copy of index.html to load and then reads
// window.location.pathname itself at runtime, so placing a literal copy at
// play/ui/index.html (a real file GitHub Pages can serve directly) sidesteps
// needing a 404.html fallback trick entirely.
fs.mkdirSync(path.join(DIST, "play/ui"), { recursive: true })
fs.copyFileSync(path.join(DIST, "index.html"), path.join(DIST, "play/ui/index.html"))
console.log("copied dist/index.html -> dist/play/ui/index.html (path-based route)")

// Same trick for play/chart's own pilot route (see router.ts's "/play/chart/"
// entry) - the ENTRIES loop above already copied the legacy play/chart/
// directory's own files (json/, menu.json, chart.css, ...) into dist/play/chart/,
// so this only adds the one extra index.html alongside them.
fs.copyFileSync(path.join(DIST, "index.html"), path.join(DIST, "play/chart/index.html"))
console.log("copied dist/index.html -> dist/play/chart/index.html (path-based route)")
