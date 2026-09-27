# juijs-vue.github.io

This repo exists only to host the `juijs-vue` organization's GitHub Pages
site at https://juijs-vue.github.io/. It has no source of its own - the
actual content is [www.jui-vue.io](https://github.com/juijs-vue/www.jui-vue.io)
(currently developed on its `vue3` branch), checked out and built by
[`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)
together with its local (not-yet-published-to-npm) dependencies:
jui-core-ts, jui-graph-ts, jui-chart-vue, jui-ui-vue and jui-grid-vue.

Run the workflow manually (Actions tab -> "Deploy www.jui-vue.io to GitHub
Pages" -> Run workflow) to redeploy after changes land in any of those repos.
