// Build-time port of app.py's build_gallery_list() - scans gallery/*/package.json
// and bakes the result into a static JSON module, since the deployed site is a
// plain static build with no server to do this scan at request time.
import fs from "node:fs"
import path from "node:path"

const ROOT = path.resolve(import.meta.dirname, "../..")
const GALLERY_DIR = path.join(ROOT, "gallery")
const OUT_PATH = path.join(import.meta.dirname, "../src/generated/gallery.json")

const items = []
for (const name of fs.readdirSync(GALLERY_DIR)) {
    const full = path.join(GALLERY_DIR, name)
    if (!fs.statSync(full).isDirectory()) continue
    const pkgPath = path.join(full, "package.json")
    if (!fs.existsSync(pkgPath)) continue

    const info = JSON.parse(fs.readFileSync(pkgPath, "utf-8"))
    const hasThumbnail = fs.existsSync(path.join(full, "thumbnail.png"))
    items.push({ name, info, hasThumbnail })
}
items.sort((a, b) => a.name.localeCompare(b.name))

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true })
fs.writeFileSync(OUT_PATH, JSON.stringify(items, null, 2))
console.log(`wrote ${OUT_PATH} (${items.length} gallery items)`)
