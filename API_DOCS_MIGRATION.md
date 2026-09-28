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
- [ ] Priority 5: jui-chart-vue's `register/brush` (89 files) +
      `register/widget` (19 files) + grid/theme/icon Options interfaces
      (~108 items total) - **not started.** No named `XxxOptions` interface
      exists anywhere in that repo yet (confirmed by grep before Priority 4
      started) - this requires authoring new types by reverse-engineering
      each brush/widget's real behavior from its `_OWN_DEFAULTS` object and
      at least one real demo/gallery usage, which is exactly the kind of
      work that has caused real bugs earlier in this project (the
      `dragselect` port and the `gps`/`realtime` fixes both needed careful,
      slow, Playwright-verified debugging - see `GALLERY_MIGRATION.md`).
      Deliberately last/lowest-priority because of that risk. Tackle the
      most commonly-used brushes first (bar/line/column) rather than all 89
      at once, and cross-check each new interface against a real
      demo/gallery usage before marking it done - the same evidentiary
      standard `GALLERY_MIGRATION.md` already uses.

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

## Steps (per brush/widget, for Priority 5 when it's picked up)

1. Read the brush/widget's `.ts` file fully, including its `_OWN_DEFAULTS`
   object and any file-header porting-history comment.
2. Find at least one real demo (`gallery/*`, `play/chart/demos/*`) that
   actually uses this brush/widget type and read how it configures it.
3. Author a named, exported `XxxOptions` interface capturing the real field
   shapes (not just `Record<string, unknown>`), with a TSDoc comment per
   field describing what it does (pull from the file's own inline comments
   where they exist).
4. Re-run `npm run typecheck`/`vite build` in `jui-chart-vue` - a wrong
   field type will usually surface here first.
5. Add the brush/widget to `jui-api-doc`'s `generate-component-docs.mjs` (or
   a new TypeDoc entry, since these are plain `.ts` files, not `.vue` -
   TypeDoc is the right tool here, not vue-component-meta) and run
   `npm run docs:build`; inspect the generated page directly.
6. Only then mark it done in this file's Status section, citing the demo
   you cross-checked against.
