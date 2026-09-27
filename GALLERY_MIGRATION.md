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
      `ef71983`) - map.weather brush card layout + realtime (1s interval)
      air-quality line + 3-day forecast table + province combo. Two real
      bugs caught and fixed along the way (neither specific to this demo):
      `jui-chart-vue`'s `package.json` had no `main`/`module`/`exports` at
      all (separate repo, separate commit) - broke the ENTIRE `web`
      production build (`jui-chart-vue?url` unresolved), not just this
      demo; and the province `<Combo>` needs an actual `v-model` bound back
      to itself (even though nothing downstream consumes the selection,
      matching the legacy demo exactly) or its own button label never
      updates after picking an item.
- [x] `fitness` -> `web/src/pages/gallery/Fitness.vue` (commit `ef7e880`) -
      purely static charts, no interactivity/state beyond what jui-chart-
      vue's brushes give for free (pie hover/click, tooltip) - heatmap cohort
      grid + 4 demographic pies + dual-axis line/step growth chart, all
      `theme="pastel"`. No new bugs found in jui-chart-vue/jui-ui-vue this
      time; one pre-existing bug in the LEGACY demo itself confirmed (not
      introduced by the port, not fixed either - ported faithfully): the
      "Male vs Female" pie's tooltip/label format function looks up
      `demo_names[0][k]` for BOTH slices but the real legacy site also shows
      "MALE" as both labels (verified by rendering the old gallery/fitness/
      index.html side by side before deleting it) - a genuine data/lookup
      bug in the original, left as-is.
- [x] `accountbook` -> `web/src/pages/gallery/AccountBook.vue` (commit
      `353e9d4`) - by far the most stateful demo so far: editable Expense/
      Income `<DataGrid>`s (with a floating `<Datepicker>`/`<Dropdown>` for
      the date/type edit cells, matching the legacy's own shared floating-
      widget pattern), a reactive column chart, checkbox multi-delete, a
      month `<Slider>`, and a Summary tab using `<Datepicker variant="calendar">`
      (NOT a separate Calendar component - jui-ui-vue doesn't have one, but
      also doesn't need one: `variant="calendar"` is the exact same
      Datepicker skinned differently, confirmed by reading its own source)
      with per-day task badges + a `<Window>` modal showing that day's
      breakdown in two more `<DataGrid>`s under a pill `<Tab>`.
      Two real, non-trivial bugs found and fixed:
      - **jui-grid-vue's `DataGrid.vue` itself** (separate repo, separate
        commit `234e734`): its editable-row commit was unconditional (any
        field's blur/Enter closes edit mode immediately), but the legacy
        grid.table this demo is built on (confirmed by reading grid.min.js
        directly) lets its `editend` handler REJECT an incomplete row and
        keep editing open - this demo's whole "date, then memo, then cash,
        then type, THEN commit" flow depends on that. Added an opt-in
        `editValidate` prop that can return `false` to reject-and-stay-open,
        purely additive (every other consumer's behavior is unchanged).
      - This demo's own floating date/type edit-cell inputs were originally
        wired to commit on their own `blur` (matching the OTHER, plain
        default-slot columns' convention) - but focus moving to the floating
        picker itself is a blur too, which committed (and, pre-editValidate,
        closed) the row before the picker's selection ever landed. Fixed by
        only committing explicitly once the picker actually makes a
        selection, not on blur.
      Follow-up fix (commit `47600e5`): the Total row's Cash/Card columns
      didn't line up with the grid's own (a separate plain `<table>` can't
      guarantee matching widths against a column with no explicit `width`).
      Fixed properly by adding a real `footer-<key>`-slot-based `<tfoot>` to
      jui-grid-vue's `DataGrid.vue` itself (separate repo, commit
      `714283e`) - sharing the SAME `<table>`/`<colgroup>` guarantees
      pixel-perfect alignment, styled like the header row (matching the
      legacy grid.table's own "Total" row, which reused a second `<thead>`
      for the exact same reason) and sticky-pinned to the scroll
      container's bottom edge.
- [x] `admintool` -> `web/src/pages/gallery/AdminTool.vue` (commit `ef0ad8a`)
      - a dashboard with 8 `<Chart>`s (combo/bar/gauge/sparklines/bargauges),
      a `<DataGrid>` order list, and a page-wide Theme selector
      (Jennifer/Dark). The flagship feature (theme switching the WHOLE page)
      raised a real architecture question, resolved with the user: rather
      than injecting a real, unscoped theme stylesheet (which would also
      re-theme the site's own header/nav - jui-ui-vue only ever globally
      loads ONE compiled theme, with no runtime-swap mechanism at the app
      level), discovered that `<Chart theme="...">` (jui-chart-vue) and
      `<DataGrid theme="...">` (jui-grid-vue) ALREADY support real per-
      instance theme switching with no cross-page bleed - jui-grid-vue's
      table styles are already compiled for all 3 themes at once, each
      scoped under its own `.theme-<name>` class, toggled by the `theme`
      prop (done by another session, discovered while investigating this).
      This page's OWN chrome (cards/menu/header, ported from index-dark.css/
      index-jennifer.css) is restyled the same way - a scoped-in-this-
      component `theme-<name>` class, never a global stylesheet - so the
      site's own header/nav can't be affected by this demo's own theme
      toggle. `jui-chart-vue` still has no "jennifer" theme at all (same gap
      FacebookGroup's conversion hit) - "Jennifer" maps to its own default
      for the 8 charts specifically (none of them pass an explicit theme in
      the original either), while the page chrome and DataGrid get a real
      jennifer theme. "Dark" is real everywhere. Also substituted the
      legacy's hotlinked 2015-era external blog image (background noise
      texture) for the identical asset already vendored locally
      (res/img/light-noise.png, already used elsewhere on this site).
- [x] `apmmarket` -> `web/src/pages/gallery/ApmMarket.vue` (commit `05ccbf6`)
      - a marketing landing page, not a real dashboard: 3 hover-flip cards
      (CSS 3D flip, plain markup, no chart) that each open a fullscreen
      popup with its own world-map chart (map.comparebubble/map.selector/
      map.note/map.bubble brushes, one popup mixing a map with a column
      chart on a second axis). The legacy popup was an `<iframe>` loading a
      SEPARATE HTML document, with a scripted width/height/position
      transition timed around the iframe's load event - replaced with a
      real `<Teleport to="body">` overlay + a plain CSS opacity transition,
      since the popup content is just another one of this component's own
      `<Chart>`s, not a genuinely separate document needing to load.
      Two real bugs found and fixed:
      - The popup needs `<Teleport to="body">` at all - this page renders
        nested inside the site's own shell, and the shell's own persistent
        nav header (verified via computed style: `z-index: 10000`) sits in
        a DIFFERENT stacking context than a plain high `z-index` set here
        can ever beat; teleporting to `<body>` escapes that context
        entirely (the same reason jui-ui-vue's own `Window.vue` modal does
        the same).
      - `recalcMapScale()` (this component's own port of each legacy
        pop_N.html's window-resize handler, which rescales/repositions the
        map to fill the popup) could compute a NEGATIVE width/height -
        `<Chart>` throws on that (SVG rejects negative attribute values) -
        under an unusual resize timing (a Playwright "capture the whole
        scrollable page" screenshot mode briefly resizing the viewport
        surfaced this, but a real, very short window could hit the same
        path). Added a defensive guard: skip the update entirely when the
        computed height isn't positive, rather than ever applying a
        nonsensical size.
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
