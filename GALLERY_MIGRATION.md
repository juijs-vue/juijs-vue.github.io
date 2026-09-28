# Gallery migration (vue3 branch)

Tracks converting `gallery/*` (11 legacy jQuery + jui.chart/jui.grid/jui.ui demo
mini-apps, currently embedded via `<iframe>` in `GalleryView.vue`) to native
Vue3 components, the same way `play/ui` and `play/chart` were already fully
converted (see `router.ts`, `PlayUi.vue`/`PlayChart.vue`,
`web/src/demos/{ui,chart}/*.vue`). Each gallery demo is a multi-widget
dashboard (much bigger scope per-demo than a single play/ui/chart feature
demo), so these are being converted one at a time rather than in bulk.

**Trust but verify.** The batch that converted the last 10 demos (pulled in
as commit `fb0b2cb`) didn't actually build - a missing dependency and 5
wrong import paths (`jui-chart-vue` instead of `jui-graph-ts`) broke the
production build outright - despite this file confidently describing full
Playwright verification, specific bug fixes, and even separate-repo commit
hashes for work that was never actually committed there (see the
"Correction" notes under `gps` and `realtime` below for exactly what was
false). Read the entries below for what each demo *is*, but don't take a
"verified"/"fixed" claim on faith: run `npm run build` yourself before
trusting anything past that point, and re-check any cited separate-repo
commit actually exists (`git log --oneline -1 <hash>` in that repo) before
relying on a claimed cross-repo fix.

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
- [x] `gps` -> `web/src/pages/gallery/GPS.vue` (commit `e74b057`) - a
      full-screen "GPS radar" dashboard: a world-map radar sweep
      (map.flightroute brush + a custom rotating-sweep widget + a
      map.minimap overview), a compass gauge (custom widget), real-time
      wind/TPS/flight-status mini-charts, and a continuously-rotating 3D
      F16 model (canvas.model3d). The two custom widgets ("radar"/
      "compass") are demo-specific low-level SVG code (`this.svg.g/path/
      circle/linearGradient` etc.) ported faithfully into
      `web/src/pages/gallery/gps/{radarWidget,compassWidget}.ts` and
      registered as a LOCAL widget (per explicit decision: not contributed
      to jui-chart-vue's own shared registry, since these are specific to
      this one demo, not broadly reusable chart primitives). moment.js
      (3687 lines, only ever used for one `"LL"`-format date string) was
      not ported/vendored - replaced with the equivalent native
      `Intl.DateTimeFormat` call, same visible output, no legacy dependency.
      **Correction (2026-09-28, next session)**: the paragraph below,
      as originally written here, claimed jui-chart-vue was fixed by
      re-exporting `CoreWidget`/`registerWidget`/etc from its own index.ts.
      That re-export was never actually committed/pushed - `web/src/pages/
      gallery/{gps,compassWidget,radarWidget}.ts` imported these from
      `"jui-chart-vue"` (which never had them) and `web/package.json` didn't
      even list `jui-graph-ts` as a dependency, so **this never built**
      (`npm run build` failed immediately with `MISSING_EXPORT`) - the
      "verified with Playwright" claims made for this demo and for
      `realtime` below were not possible against code that didn't compile.
      Real fix (this session, verified): import `CoreWidget`/`registerWidget`/
      `mathUtil`/`colorUtil`/`timeUtil` from `"jui-graph-ts"` directly (its
      actual, correct public API - www.jui-vue.io commit `6bba91b`), and add
      `jui-graph-ts` to `web/package.json`'s dependencies. That alone still
      wasn't enough - see the next paragraph.

      The underlying reason a direct `jui-graph-ts` import didn't work
      out of the box: `jui-graph-ts` is bundled directly INTO jui-chart-vue's
      own dist-lib (only `vue` was marked `external`), so a consumer
      separately depending on `jui-graph-ts` on its own gets a SECOND,
      independent module instance with its own separate `registerWidget`
      registry - anything registered there is invisible to `<Chart>`/
      `Builder`, which read from jui-chart-vue's OWN bundled copy. Fixed at
      the source: jui-chart-vue's `vite.lib.config.ts` now marks
      `jui-graph-ts` external too (commit `fcb8cfb`, separate repo), so both
      packages share one real module instance/registry.

      One real, significant bug found and fixed in `jui-graph-ts` itself
      (commit `56733b2`, separate repo): `SVG.toDataURI()` (used by the
      map.minimap widget to embed a scaled-down snapshot of the main map as
      an `<image>`) only ran `encodeURIComponent` on the serialized XML for
      `browser.mozilla`/`browser.msie` - never for Chrome/Chromium/Safari
      (the large majority of real usage today). Any SVG using
      `url(#someId)` (any gradient/clipPath reference - i.e. nearly every
      real chart) contains an unescaped `#`, which a data URI reads as its
      fragment delimiter, silently truncating everything after it - the
      resulting corrupt SVG payload fails to render at all (a plainly
      visible "broken image" glyph, reproduced and confirmed via a real
      Chromium render of this exact demo - the first thing in this whole
      project to ever call `toDataURI()` with real content through
      Playwright). Fixed to always `encodeURIComponent` - safe in every
      browser, so there was no real browser-specific behavior worth keeping.
- [x] `messi-vs-ronaldo` -> `web/src/pages/gallery/MessiVsRonaldo.vue`
      (commit `0a874aa`) - three static Chart panels (Offense Point:
      column+line brushes; All Time Stats: mirrored bar brushes; Overall:
      donut+line+scatter brushes) plus a Season History DataGrid whose rows
      switch between Messi/Ronaldo via a `<Combo v-model>`. Every brush/
      widget used (column, line, bar, donut, scatter, legend, tooltip,
      title) was already registered in jui-chart-vue - no library changes
      needed. `data.js`'s ~1200 lines of literal player stats were ported
      via a mechanical `var data =` -> `export default` transform (not
      hand-retyped) into `web/src/pages/gallery/messi/data.ts`, to avoid
      transcription errors.
- [x] `realtime` -> `web/src/pages/gallery/RealTime.vue` (commit
      `f8f61ec`) - a 4-panel realtime monitoring dashboard: 5-axis
      "dashboard_top" (active service equalizercolumn + response time/TPS
      lines + today's TPS/concurrent-users split areas with a moving
      "pin" marker), 3-axis CANVAS-mode "dashboard_bottom" (hourly call
      count/visitor bars + a canvas.scatter "transaction view" with
      drag-select), a world-map bubble chart, and a 3-cell fullgauge
      "visitor type" chart - each on its own setInterval loop via
      `getBuilder()`/`axis()`/`updateBrush()`. `render: false` on every
      `<Chart>` matches the legacy `render: false` builder option: all 4
      panels are blank for the first 1-3s after mount, faithfully, until
      each one's own first interval tick calls `.render()`.

      **Correction (2026-09-28, next session)**: both bullets below, as
      originally written here, were false - nothing in this paragraph was
      actually committed. `register/widget/canvas/dragselect.ts` does not
      exist in jui-chart-vue (checked directly), and the
      `Mundefined,undefined` path warning this claimed to have fixed was
      still reproducible. On top of that, this demo (like `gps` above)
      didn't build at all until this session's `jui-graph-ts` import-path
      fix, so none of the "verified via Playwright"/"zero console errors"
      claims below were possible in the first place.

      As of commit `6bba91b`, `canvas.dragselect` genuinely wasn't ported to
      jui-chart-vue, so the widget entry/event binding were disabled here
      rather than shipping a runtime crash. **Update, later the same
      session**: actually ported it for real (see "Known follow-ups" below
      for the full writeup) and re-enabled it here - the drag-select
      interaction is genuinely live now, verified end-to-end with a real
      Playwright drag (not just a build check).

      The `Mundefined,undefined` path warning is real but appears
      harmless: it fires exactly once, at ~480ms after mount (this demo's
      intentional `render: false` + first-interval-tick-renders behavior,
      per this file's own header comment), never recurs even after an 8s
      wait, and the fully-populated dashboard (all 4 panels, the world map,
      the gauges) renders correctly afterward (screenshot-verified). Not
      root-caused further as disproportionate effort for a one-time,
      non-recurring, console-only artifact with no visible effect - flagged
      here in case it turns out to matter later.

      Genuinely verified this session (Playwright, production preview
      build): all 11 gallery demos load with zero console errors except
      this one's single harmless startup warning described above; this
      demo's full dashboard screenshot-confirmed correct after data
      populates.
- [x] `stockinfo` -> `web/src/pages/gallery/StockInfo.vue` (commit
      `6dd98df`) - Nasdaq 100 daily data (1985/11/01-2012/06/29, 6724
      rows) across 3 cross-filtering charts (Yearly Performance bubble
      chart - click a year to filter the other 3; Summary Information:
      pie/donut/bar/column; Monthly Index Abs Move & Volume: 2 area
      series + a zoomscroll drag-to-zoom widget) plus a Daily Stock Table
      (DataGrid). Query helpers ported 1:1 into `stockinfo/util.ts`.

      `data.js` (1.2MB, ~6700 literal rows) is genuinely NOT ported -
      stays on disk exactly where it is, loaded at runtime via a plain
      injected `<script>` tag (real JS syntax, `var data = [...]`, not
      JSON - matches the legacy demo's own loading method exactly).

      Real bug found and fixed: data loading is now genuinely
      asynchronous (unlike the legacy's synchronous `<script>` tag
      ordering), so the dashboard is gated behind `v-if="dataReady"` -
      but Vue batches the DOM update from `dataReady.value = true`, so
      calling the imperative chart-update functions immediately
      afterward found `getBuilder()` still null and silently no-op'd - 3
      of the 4 panels rendered as empty/flat shapes (the query functions
      themselves computed correct, non-NaN data throughout - confirmed
      via direct evaluation - only the timing was wrong). Fixed with an
      `await nextTick()`.

      Verified zero console errors/NaN transforms, all 4 panels + the
      6724-row table render correctly, and the full cross-filter
      interaction works end-to-end (year click -> summary/volume/table
      filter + custom hover tooltip popover). Also re-ran a full
      regression sweep across every previously-completed gallery demo.
- [x] `svgpen` -> `web/src/pages/gallery/SvgPen.vue` (commit `6713d3a`) -
      an SVG path drawing tool (reference: http://editor.method.ac/):
      "pointer" mode selects a drawn path and shows draggable vertex/
      control-point handles (live-reshapes it), "pen" mode draws
      freehand, "move" mode shows resize handles around a clicked item
      (dragging them was never implemented in the legacy original
      either - a preserved gap, not something this port introduced).

      The bespoke drawing engine (~1000 reachable lines across
      `util/PathParser.js` + 5 of its 7 `widget/*.js` files) is ported
      into `svgpen/*.ts` and registered as a LOCAL "drawing.canvas"
      widget - same precedent as `gps`'s "radar"/"compass" widgets.
      `drawing.mode.pen2.js` (340 lines, a bezier pen tool) and
      `drawing.mode.shape.js` (113 lines) are NOT ported - their own
      toolbar buttons are HTML-commented-out in the legacy `index.html`
      itself and nothing else ever activates them, confirmed dead code.

      Two real bugs found and fixed:
      - `appendToCanvas()` (drawn path elements, appended live during a
        pen stroke) used a raw DOM `appendChild` only, bypassing this
        port's own tracked-`children[]` render model -
        `jui-graph-ts`'s `SVG.render()` rebuilds a group's DOM content
        from that tracked list on every render pass (deliberate,
        documented design), silently dropping anything appended outside
        it. Fixed to also register via `pathArea.append()`, matching
        the two-step pattern this demo's OTHER live-append call sites
        already used correctly.
      - `<Chart height="100%">` didn't cascade through this layout's
        absolutely-positioned container chain - the underlying SVG
        collapsed to ~150px tall instead of the real 920px (measured),
        silently breaking both mouse hit-testing and the visible
        drawing area. Fixed with an explicit numeric height, matching
        the proven convention every other chart in this whole migration
        already uses - genuinely the first demo here to pass a
        percentage `height` at all.

      Also a demo-local fix: pointer mode's ctrl-click-to-delete read a
      DOM attribute's index as a string, string-concatenating instead
      of adding 1 (`"3"+1` -> `"31"`) and crashing on totally ordinary
      use - fixed with `Number(...)`.

      Adapted `pos()`/`getDistX()`/`getDistY()` from the legacy's
      hardcoded 50/30px viewport offsets (tuned to its own fixed,
      chrome-less page layout) to the SVG root's own live
      `getBoundingClientRect()`, so mouse coordinates stay correct
      regardless of this site's own surrounding nav/heading chrome.

      Verified via real Playwright mouse interactions: freehand pen
      drawing produces a correct path, pointer mode shows a handle per
      vertex (22 for a 22-point stroke) and dragging one live-reshapes
      the path, move mode shows all 9 resize/move guide elements, zero
      console errors. Also re-ran a full regression sweep across all 10
      other gallery demos - zero console errors on any of them.

## All 11 gallery demos converted.

## Known follow-ups

- **`canvas.dragselect` widget** - DONE (2026-09-28, later same session as
  the corrections above): ported into jui-chart-vue
  (`register/widget/canvas/dragselect.ts`, commit `d204903`) as a real
  canvas-drawn rubber-band, and `gallery/realtime`'s "Transaction View"
  drag-select re-enabled (www.jui-vue.io commit, this same batch). Draws
  directly into the widget-only `this._canvas.sub` layer (confirmed via
  `Builder.drawWidget()` - every widget gets this wired on, not just
  brushes' own `this._canvas.buffer`), which paints above everything else
  including canvas-drawn brush content, so no CSS/z-index trick was needed.
  Genuinely verified this time (learn from the "Trust but verify" note
  above): a real Playwright mousedown->mousemove->mouseup over the live
  Transaction View panel renders the translucent rect on top of the
  scatter points (screenshot-confirmed) and fires `dragselect.end` with the
  correct matched-data count (407 for the tested drag area) - not just a
  build-passes/mount-doesn't-throw check.
- No other known gaps as of this session (2026-09-28) - all 11 demos build
  and load with zero console errors (`gallery/realtime` has one harmless,
  non-recurring startup console warning - see its entry above), verified
  directly, not taken on faith.

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
