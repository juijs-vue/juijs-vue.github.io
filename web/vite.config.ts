import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { resolve } from "path"

// Deployed to https://juijs-vue.github.io/ (the juijs-vue org's own GitHub
// Pages site, built by a workflow living in the juijs-vue.github.io repo) -
// base must match. Previously served from jui-ui-vue's Pages slot at
// /jui-ui-vue/; this moved to the org root, so base is just "/" now.
export default defineConfig({
    plugins: [
        vue({
            template: {
                compilerOptions: {
                    // play/ui demos rely on this (matches the old loader.html's
                    // app.config.compilerOptions.whitespace = "preserve") - Vue's
                    // default 'condense' mode strips whitespace-only text nodes
                    // spanning a line break, which some demos' CSS (e.g. a button
                    // group's `.group > * + *` negative margin) assumes survives,
                    // same as plain (non-Vue) HTML parsing does.
                    whitespace: "preserve"
                }
            }
        })
    ],
    base: "/",
    // jui-ui-vue is consumed via a "file:" link (an npm symlink) - forces a
    // single shared Vue instance instead of risking two separate copies
    // resolving through jui-ui-vue's own (symlink-real-path) node_modules.
    resolve: {
        dedupe: ["vue"]
    },
    build: {
        outDir: resolve(import.meta.dirname, "dist"),
        emptyOutDir: true
    }
})
