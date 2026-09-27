# Gallery migration (vue3 branch)

Tracks converting `gallery/*` (11 legacy jQuery + jui.chart/jui.grid/jui.ui demo
mini-apps, currently embedded via `<iframe>` in `GalleryView.vue`) to native
Vue3 components, the same way `play/ui` and `play/chart` were already fully
converted (see `router.ts`, `PlayUi.vue`/`PlayChart.vue`,
`web/src/demos/{ui,chart}/*.vue`). Each gallery demo is a multi-widget
dashboard (much bigger scope per-demo than a single play/ui/chart feature
demo), so these are being converted one at a time rather than in bulk.

## Status

- [x] `facebookgroup` -> `web/src/pages/gallery/FacebookGroup.vue` (commit
      `c07b2e9`) - full worked example, read this commit before starting the
      next one.
- [x] `koreaweather` -> `web/src/pages/gallery/KoreaWeather.vue` (commit
      `PENDING`) - map.weather brush card layout + realtime (1s interval)
      air-quality line + 3-day forecast table + province combo. Two real
      bugs caught and fixed along the way (neither specific to this demo):
      `jui-chart-vue`'s `package.json` had no `main`/`module`/`exports` at
      all (separate repo, separate commit) - broke the ENTIRE `web`
      production build (`jui-chart-vue?url` unresolved), not just this
      demo; and the province `<Combo>` needs an actual `v-model` bound back
      to itself (even though nothing downstream consumes the selection,
      matching the legacy demo exactly) or its own button label never
      updates after picking an item.
- [ ] accountbook
- [ ] admintool
- [ ] apmmarket
- [ ] fitness
- [ ] gps
- [ ] messi-vs-ronaldo
- [ ] realtime
- [ ] stockinfo
- [ ] svgpen

No particular order was requested - smallest-first is a reasonable default.
Rough sizes surveyed 2026-09-27 (gps/stockinfo's line counts are mostly
embedded data, not real app logic - their actual app code is small):

| demo | real app code (approx) | notes |
|---|---|---|
| koreaweather | ~522 lines | smallest remaining |
| fitness | ~667 lines | |
| accountbook | ~875 lines | |
| realtime | ~874 lines | |
| admintool | ~930 lines | |
| apmmarket | ~1299 lines | |
| messi-vs-ronaldo | ~1702 lines | |
| svgpen | ~2008 lines | |
| gps | index.html ~377 lines + `resources/model/*.js` (~42k lines of 3D model data) | data files stay as-is, not ported |
| stockinfo | index.html ~511 + util.js ~157 lines + `data.js` (~60k lines) | `data.js` stays as-is, not ported |

## Steps (per demo)

1. Read the legacy demo fully: `gallery/<name>/index.html` (+ any `.js`/`.css`
   it loads) and `gallery/<name>/package.json`.
2. Identify the jui-chart-vue/jui-grid-vue/jui-ui-vue pieces it needs. Check
   `jui-chart-vue/src/register/{brush,widget,theme,icon,grid}/` to confirm
   every brush/widget `type` and every theme/icon name the legacy config uses
   is **actually registered** there - the old jQuery engine supports more
   than jui-chart-vue has ported so far (e.g. the `"jennifer"` icon/theme
   isn't ported; only classic/dark/gradient/pastel themes and the classic
   icon set exist as of this writing - using an unregistered one throws
   `JUI_CRITICAL_ERR` mid-render and corrupts every node/shape drawn after
   the crash point).
3. Write `web/src/pages/gallery/<Name>.vue` (PascalCase), porting the legacy
   `chart(display, {...})`/DOM logic 1:1 into reactive Vue: `<Chart :axis
   :brush :widget :event>`, `<DataGrid :columns :rows>`, `<Dropdown :items>`.
   Guard any `<Chart>` that starts with empty/not-yet-loaded data with
   `v-if` (e.g. `v-if="data.length"`) - mounting with empty data before an
   async fetch resolves can throw inside the engine's own active-node
   handler.
4. Register it in `GalleryView.vue`'s `NATIVE_DEMOS` map:
   `{"<id>": "<Name>"}`. This must be an **explicit map**, not a derived
   transform - most gallery ids are single concatenated words with no
   recoverable delimiter (`"facebookgroup"` -> `"FacebookGroup"` can't be
   produced by any generic capitalize/kebab-to-Pascal rule).
5. Once verified working, delete the legacy `gallery/<name>/index.html` (and
   its own `.css` if unique to it) - keep `data/`, images, icon fonts, etc.
   in place; the new component still fetches/references them at runtime.
6. Build: `cd web && npm run build` (vue-tsc + vite build +
   `copy-legacy-static.mjs`). This only proves it compiles, not that the UI
   works.
7. **Actually verify it renders and is interactive** - a passing build is not
   enough for a UI change:
   - `npm run dev`'s file watcher hits `EMFILE: too many open files` in this
     environment - use `npm run preview -- --port <N>` instead (serves the
     already-built `dist/`, no watcher).
   - Use **Playwright**, not the claude-in-chrome browser-extension tool -
     the user has explicitly asked for this.
   - `playwright` isn't a convenient direct dependency anywhere in this
     family of repos - `jui-grid-vue/node_modules/playwright` exists
     locally; write/run throwaway test scripts from inside that directory
     (ESM resolution needs the script's own location to have
     `node_modules/playwright` above it), and delete them when done - don't
     commit them anywhere.
   - Check for zero console errors AND exercise every real interaction the
     legacy demo had (clicks, dropdowns, drill-downs, etc.), not just the
     initial screenshot. Coordinate-based `page.mouse.click(x, y)` is
     unreliable for hitting chart elements (nested SVG group transforms);
     prefer `locator(...).click()` on the actual text/element so Playwright
     computes the real target itself.
8. Commit with a thorough message: what was ported, anything adapted vs. the
   original (and why), and exactly how it was verified (which interactions,
   what the screenshots/DOM checks showed) - see commit `c07b2e9` for the
   level of detail expected.
9. Redeploy: `gh workflow run deploy-pages.yml --repo
   juijs-vue/juijs-vue.github.io`, wait for it (`gh run watch`), then
   re-check the live URL (`https://juijs-vue.github.io/?p=gallery.<name>`).
   GitHub Pages sits behind a CDN with a ~10 minute cache - an immediate
   re-check can still show the OLD version; poll instead of concluding the
   deploy failed.
