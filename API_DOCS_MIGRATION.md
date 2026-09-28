# API docs migration

Tracks the backlog for the generated API reference site (`jui-api-doc/`, a
sibling repo/directory at `/home/jiho/juijs-vue/jui-api-doc`, deployed
separately to its own GCP App Engine service - not part of this repo's
GitHub Pages build). See that directory's `scripts/generate-component-docs.mjs`
(vue-component-meta, for the Vue component libraries) and
`typedoc.{core-ts,graph-ts}.json` (TypeDoc, for the two pure-TS libraries).

**Trust but verify.** `GALLERY_MIGRATION.md` in this same repo records a real
incident where a prior session claimed Playwright-verified fixes for code
that never actually built. The same standard applies here: don't mark a
component "typed"/"documented" without actually running
`npm run docs:build` in `jui-api-doc/` and inspecting the generated page for
that specific component (props/emits tables render, no stray `unknown`
where a real type was expected), and don't claim UI behavior is unchanged
without an actual Playwright interaction against a live demo - a clean
`vue-tsc`/`vite build` only proves the code compiles, not that it still
works.

## Status

- [x] Priority 1: jui-grid-vue (DataGrid/VirtualGrid/ColumnMenu) + jui-chart-vue's
      `Chart.vue` - already typed before this effort started, wired into
      `jui-api-doc` and verified (Playwright, zero console errors, prop
      tables render with real descriptions).
- [x] Priority 2: jui-core-ts (TypeDoc) - wired and verified.
- [x] Priority 3: jui-graph-ts (TypeDoc) - wired and verified. 144 TypeDoc
      warnings (unknown `@cfg`/`@method` block tags left over from the
      legacy jsduck-era comments, and a few internal types referenced but
      not exported) - harmless, not fixed (out of scope: fixing them means
      rewriting the original JSDoc comments, not a docs-tooling task).
- [x] **Priority 4: jui-ui-vue (25 files: 24 public components + the
      internal `TreeNode.vue` helper `Tree.vue` uses) - JS → TS conversion +
      TSDoc, done.** See the per-component notes below.
- [x] **Priority 5a: jui-chart-vue's `register/widget/**/*.ts` (19 files, all
      of them - `title`/`cross`/`guideline`/`legend`/`raycast`/`scroll`/
      `tooltip`/`topologyctrl`/`vscroll`/`zoom`/`zoomscroll`/`zoomselect`/
      `dragselect`, plus `canvas/dragselect`/`canvas/picker`/`map/control`/
      `map/minimap`/`map/tooltip`/`polygon/rotate3d`) - done.** Every
      `_OWN_DEFAULTS` object now has a named, exported `XxxWidgetOptions`
      interface with per-field TSDoc, and the defaults const itself is typed
      against that interface (a free correctness check). See the detail
      section below.
- [x] **Priority 5b: jui-chart-vue's `register/brush/**/*.ts` (84 registered
      brush types across 77 edited files: 61 flat + 7 `canvas/` + 6 `map/` +
      3 `polygon/`) - done.** `register/grid/topologytable.ts` (1) and
      `register/theme`/`register/icon`/`register/pattern` (7) remain
      explicitly deferred - see note below (unchanged from before). See the
      detail section below.
- [ ] Priority 5c: wire `register/widget`'s and `register/brush`'s new
      `XxxOptions` interfaces into `jui-api-doc` itself. These are plain
      `.ts` files, not `.vue` components, and none of them are re-exported
      from `jui-chart-vue/src/index.ts` (confirmed - only `Chart`/`Builder`/
      `GRID_TYPES`/a few `Chart.vue`-level types are) - TypeDoc is the right
      tool (not `vue-component-meta`), pointed at an `entryPoints` array of
      the individual `register/widget/**/*.ts` + `register/brush/**/*.ts`
      files rather than a single barrel import (there isn't one). Not done
      yet - both 5a and 5b are now done, so this can be picked up any time,
      or explicitly ask for it sooner if the widget/brush docs are wanted
      standalone.
- [ ] `register/grid/topologytable.ts` (1 file) and `register/theme`/
      `register/icon`/`register/pattern` (7 files) - **explicitly deferred,
      not part of Priority 5b.** `register/theme/*.ts` files are a different
      kind of "options" (a huge flat style-key dictionary -
      `Record<string, unknown>` today - shared by ONE interface across all 5
      theme files, not authored per-file) and are lower-value to document
      than brush/widget since end users select a theme by name string rather
      than constructing one inline. `topologytable.ts`'s own grid config is
      a similarly small, single-file, lower-traffic surface. Fine to defer
      indefinitely unless specifically requested.

## Priority 4 detail (jui-ui-vue)

All 25 files converted: `<script setup>` → `<script setup lang="ts">`,
runtime `defineProps({...})` → typed `defineProps<{...}>()` (+
`withDefaults`), runtime `defineEmits([...])` → typed
`defineEmits<{...}>()`, TSDoc comments added per prop where the original
had a `//` comment explaining it. `typescript`, `vue-tsc`, `@vue/tsconfig`
added as devDependencies; `tsconfig.json`/`tsconfig.lib.json` added
(mirrors `jui-grid-vue`'s pattern - `tsconfig.lib.json` is a standalone,
non-project-references config, required because `vue-component-meta`'s
checker doesn't work with TS project references). A `typecheck` npm script
(`vue-tsc --noEmit -p tsconfig.lib.json`) was added for local verification;
the actual `build` script (`vite build`, what CI runs) was deliberately
left untouched so this conversion can't newly break the live site's deploy
pipeline even if a type slipped through somewhere.

Verified: `npm run typecheck` clean across all 25 files, `npm run build`
succeeds, all 24 public components generate real prop/emit tables in
`jui-api-doc` (Playwright-checked, zero console errors), and a Playwright
sweep of 50 `play/ui` demo pages on the actual site (`juijs-vue.github.io`
web app, rebuilt against the new `jui-ui-vue` dist) loaded with zero
console errors, plus targeted interaction tests (open an accordion panel,
click a button-group item, expand a tree node, pick a datepicker date,
switch tabs, drag a slider handle) all worked and produced the expected
state changes.

Two real, intentional behavior notes from the conversion (not bugs
introduced by typing - found *because of* typing):

- **`ButtonGroup.vue`**: the only runtime `validator` in all 25 files
  (`type: {..., validator: (v) => v === "radio" || v === "check"}`) was
  replaced by a `"radio" | "check"` TS union. This is a real, if minor,
  behavioral change: Vue's own dev-mode console warning for an invalid
  `type` value is gone (TS types are erased at runtime), though the actual
  rendered behavior for an invalid value is unchanged (treated as
  `"radio"`, same as before - `===` checks against `"check"` still fail the
  same way).
- **`Window.vue`**: `show(x, y)` called a function named `move(x, y)` that
  was never defined anywhere in the file - a pre-existing `ReferenceError`
  bug, silently never triggered because no demo in this repo ever calls
  `show()` with arguments (confirmed via grep across `web/src/demos/ui/`).
  Fixed to call the actual `moveTo(x, y)` function during this conversion
  (TS's "cannot find name" caught it immediately); left a comment at the
  call site explaining the fix.

`TreeNode.vue` (internal, not in `jui-ui-vue/src/index.js`'s public export
list, so it isn't a `jui-api-doc` target on its own) needed a shared
`src/types/tree.ts` (`TreeNodeData`/`TreeNodeInternal`/`TreeCtx`/
`TreeDragControl`) since it and `Tree.vue` pass a self-referential node
graph through Vue's `provide`/`inject` - documented there rather than
duplicated in both files.

## Priority 5a detail (jui-chart-vue widgets)

Each `register/widget/**/*.ts` file's `_OWN_DEFAULTS` object (previously an
untyped or loosely-`as`-cast object literal, e.g.
`{axis: null as number | null, orient: 'top' as 'top' | 'center' | 'bottom', ...}`)
now has a named `export interface XxxWidgetOptions {...}` above it with a
TSDoc comment per field, and the const itself is typed
`: XxxWidgetOptions` - so a wrong field slipping in gets caught by
`vue-tsc` immediately, not just left as silent `unknown`. Descriptions were
written from reading each widget's actual `draw()`/`drawBefore()`/event-
handler logic (grepped for `widget.<field>` per file), not guessed from the
field name alone - e.g. `cross.ts`'s `xFormat`/`yFormat` are documented
with their real (counter-intuitive - each names the *opposite* guide
line's tooltip) gating behavior, cited from that file's own header
comment. `map/tooltip.ts` has no `_OWN_DEFAULTS` of its own (it extends
`TooltipWidget` and inherits its `setup()` verbatim) - re-exported its
options type under its own name (`MapTooltipWidgetOptions`) purely so a
future doc page for `"map.tooltip"` has something to point at.

Every `static setup(): Record<string, unknown> { return XXX_OWN_DEFAULTS }`
needed an `as Record<string, unknown>` cast added at the return statement -
a named interface without an index signature isn't structurally assignable
to `Record<string, unknown>`, which is what forced this pattern in the
first place (confirmed by trying it without the cast first).

Verified: `vue-tsc -p tsconfig.lib.json --noEmit` clean, `build`/`build:lib`
both succeed, all 242 existing `vitest` specs pass unchanged (the
`build`ed output is even byte-identical in one spot-checked case - type
annotations erase at compile time, so this is expected, not a "did the
build actually pick up the change" concern). Live-verified with
Playwright against the real site: the gallery's 11 compiled demos (which
use `legend`/`tooltip` pervasively and `dragselect`/`topologyctrl`
directly) still render with zero new console errors, and - after fixing an
unrelated pre-existing bug that was blocking this exact verification (see
below) - the `play/chart` live-editable sandbox renders `title`/`tooltip`/
`legend`/`topologytable`+`topologynode` demos correctly too.

**Found and fixed along the way, not part of Priority 5 itself but
blocking its own verification**: `web/src/pages/PlayChart.vue`'s
live-editable sandbox failed on literally all 161 `play/chart` demos with
`Failed to resolve module specifier "jui-graph-ts"` - confirmed this was
already broken on the live deployed site before any of today's changes,
not something this session introduced. An earlier session's fix to
`jui-chart-vue/vite.lib.config.ts` (externalizing `"jui-graph-ts"` to stop
it bundling a private copy - the same dual-module-instance bug
`GALLERY_MIGRATION.md` documents for the main build) never got a matching
entry added to this page's own native-ESM sandbox import map, so the
browser had nothing to resolve that bare specifier to. Fixed by
self-hosting `jui-graph-ts`'s own `dist-lib` ES build the same way
`jui-chart-vue` itself already was (see `PlayChart.vue`'s own comment at
the fix site for the full explanation).

## Priority 5b detail (jui-chart-vue brushes)

Same pattern as Priority 5a's widgets, applied to every `register/brush/
**/*.ts` file (flat + `canvas/`/`map/`/`polygon/`): each `_OWN_DEFAULTS`
object got a named, exported `XxxBrushOptions` interface with a per-field
TSDoc comment (read from the file's own `draw()`/`drawBefore()`/event-
handler logic, not guessed from the field name), the defaults const typed
against it, and `as Record<string, unknown>` added to the `static setup()`
return statement (same structural-assignability reason as Priority 5a).
84 registered brush types across 77 edited files. 7 brushes were confirmed
to declare **no** options of their own at all (no `static setup()`, or one
that returns only inherited/base fields with nothing brush-specific):
`candlestick.ts`, `circlegauge.ts`, `ohlc.ts`, `path.ts`, `rangearea.ts`,
`canvas/bubblecloud.ts`, `map/flightroute.ts` - left untouched, not
skipped by oversight. Several brushes (`stackcolumn`, `fullstackcolumn3d`,
`fullstackcylinder3d`, `stackcylinder3d`, `patterncolumn`, `imagecolumn`,
`bubble3d`, `stackline`, `stackarea`, `stackscatter`, and others) extend a
sibling brush and inherit its `setup()` via real class inheritance with no
override of their own - these got a re-exported `type XxxBrushOptions =
SiblingBrushOptions` alias purely so a future doc page for that registered
name has something to point at, matching `map/tooltip.ts`'s precedent from
Priority 5a.

**Verification methodology for this batch, and why it differs from
Priority 5a's live-Playwright sweep**: every one of the 77 edits is
provably a type-annotation-only change - no `_OWN_DEFAULTS` literal value
(number, string, boolean, or array/object shape) was touched, only type
annotations added around the existing values and inline `as X` casts
removed in favor of typing the const itself. This was checked
programmatically, not just asserted: a script extracted each file's
pre-edit and post-edit `_OWN_DEFAULTS` object body from git history,
stripped `as <type>` casts and whitespace, and diffed the two - all 33
files that showed a textual difference were confirmed by hand to be
artifacts of the stripping regex choking on multi-argument function-type
casts (e.g. `null as ((this: unknown, data: BrushData) => unknown) | null`
has internal commas/parens), never an actual literal-value change. Since
TS type annotations erase at compile time and the underlying object
literals are byte-for-byte unchanged, `vue-tsc -p tsconfig.lib.json
--noEmit` (clean), `npm run build:lib` (succeeds), and `npx vitest run`
(242/242 pass) together already prove there is no behavior change for this
specific kind of edit - unlike Priority 4/5a, which also changed real
logic (Window.vue's `move`→`moveTo` fix, the PlayChart sandbox fix) and
therefore genuinely needed a live-rendered Playwright check to catch a
possible regression. A live Playwright sweep was **not** re-run against
the deployed site for this batch on that basis; if a future brush edit
under this same file touches an actual default *value* (not just its
type), it needs the full Steps-style live verification, not this
shortcut.

## Steps (for any future per-file "author a named Options interface" work
## - `register/grid/topologytable.ts`, `register/theme`/`register/icon`/
## `register/pattern`, or revisiting a brush/widget with a real behavior
## change - same steps Priority 5a's widgets and 5b's brushes went through)

1. Read the file fully, including its `_OWN_DEFAULTS` object and any
   file-header porting-history comment.
2. Grep the file for every `brush.<field>`/`widget.<field>` read (or
   equivalent `this.brush`/`this.widget` cast-and-index access) to see how
   each option actually affects behavior - don't document a field's meaning
   from its name alone.
3. Find at least one real demo (`gallery/*`, `play/chart/demos/*`) that
   actually uses this type and read how it configures it.
4. Author a named, exported `XxxOptions` interface capturing the real
   field shapes (not just `Record<string, unknown>`), with a TSDoc comment
   per field describing what it does. Type the `_OWN_DEFAULTS` const
   against it too - this is itself a correctness check, not just
   documentation.
5. Every `static setup(): Record<string, unknown> { return XXX_OWN_DEFAULTS }`
   will need `XXX_OWN_DEFAULTS as Record<string, unknown>` at the return
   statement once the const is typed against a real interface (a named
   interface without an index signature isn't structurally assignable to
   `Record<string, unknown>`).
6. Re-run `npx vue-tsc -p tsconfig.lib.json --noEmit` and `npm run
   build:lib` in `jui-chart-vue`, plus `npx vitest run` - a wrong field type
   or behavior change will usually surface in one of these first.
7. If the change is type-annotation-only (no literal default value
   changed - verify this the way Priority 5b's detail section above did,
   not just by assuming it), steps 4-6 are sufficient. If any actual
   default value or logic changed, live-verify with Playwright against the
   demo found in step 3 (gallery demos render directly; `play/chart` demos
   go through the live-editable sandbox, whose own import-map correctly
   resolves `jui-graph-ts` as of Priority 5a's own fix - see that section's
   note if it breaks again).
8. Wiring into `jui-api-doc` itself is tracked separately as Priority 5c -
   don't block marking something "done" here on that, but do keep this
   file and `jui-api-doc`'s
   `scripts/generate-component-docs.mjs`/`typedoc.*.json` in sync once 5c
   actually happens.
9. Only then mark it done in this file's Status section, citing what you
   cross-checked against.
