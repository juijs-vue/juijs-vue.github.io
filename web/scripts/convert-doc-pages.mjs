// One-off conversion helper (not part of the build) - wraps doc/<lang>/<page>.html
// content fragments into plain Vue SFC <template> blocks, fixing the one known
// invalid-tag typo (</br> instead of <br/>) that Vue's stricter template
// compiler won't auto-correct the way browsers do.
import fs from "node:fs"
import path from "node:path"

const ROOT = path.resolve(import.meta.dirname, "../..")
const PAGES = [
    { file: "about", component: "About" },
    { file: "install", component: "Install" },
    { file: "basic", component: "Basic" }
]

for (const lang of ["en", "ko"]) {
    for (const { file, component } of PAGES) {
        const src = fs.readFileSync(path.join(ROOT, "doc", lang, `${file}.html`), "utf-8")
        const fixed = src.replace(/<\/br>/g, "<br/>").replace(/^﻿/, "")
        const out = `<template>\n${fixed.trimEnd()}\n</template>\n`
        const outPath = path.join(ROOT, "web/src/pages", lang, `${component}.vue`)
        fs.writeFileSync(outPath, out)
        console.log("wrote", outPath)
    }
}
