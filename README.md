# juijs-vue.github.io

The `juijs-vue` organization's site, deployed at https://juijs-vue.github.io/.

This repo holds the site's own source directly (`web/` - the Vue 3 + Vite
SPA - plus the legacy static assets it still depends on: `lib/`, `res/`,
`gallery/`, `play/*/menu.json`, `play/chart/resource/`) and the deploy
workflow ([`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml))
that builds and publishes it.

`web/` depends on five sibling component libraries that aren't published to
npm yet, consumed via `file:../../<name>` links: `jui-core-ts`,
`jui-graph-ts`, `jui-chart-vue`, `jui-ui-vue`, `jui-grid-vue`. Each lives in
its own repo under this org and is checked out alongside this one by the
deploy workflow. For local development, clone all five next to this repo:

```
juijs-vue/
  juijs-vue.github.io/   (this repo)
  jui-core-ts/
  jui-graph-ts/
  jui-chart-vue/
  jui-ui-vue/
  jui-grid-vue/
```

then build each in dependency order (`jui-core-ts` -> `jui-graph-ts` ->
`jui-chart-vue`; `jui-ui-vue` -> `jui-grid-vue`) before running `web/`'s own
`npm run build`/`npm run dev`.

See [`GALLERY_MIGRATION.md`](GALLERY_MIGRATION.md) for the status of the
`gallery/*` Vue 3 conversion.

Redeploy manually after a change lands (Actions tab -> "Deploy www.jui-vue.io
to GitHub Pages" -> Run workflow) - not yet triggered automatically by pushes
to this or any of the library repos.

## History

This repo previously held only the deploy workflow, checking out
[`www.jui-vue.io`](https://github.com/juijs-vue/www.jui-vue.io) (its `vue3`
branch) as the site source. The source now lives here directly instead,
matching the standard `<org>.github.io` convention - `www.jui-vue.io` is
left as-is (not archived), but new work happens here going forward.
