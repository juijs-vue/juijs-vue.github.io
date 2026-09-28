<script setup lang="ts">
import { useTitle } from "../../composables/useTitle"

useTitle("JUI Vue: Getting Started")
</script>

<template>
<div class="col col-12 manual">
    <section>
        <h2>Installing the packages</h2>

        <p>
            The style components and the grid are two separate npm packages - install whichever you need.
            <pre><code class="language-javascript">npm install jui-ui-vue
npm install jui-grid-vue</code></pre>
        </p>
        <p class="br">
            Both are a native Vue 3 (Composition API) rewrite - no jQuery, no <strong>juijs</strong> core dependency. <strong>jui-grid-vue</strong>
            depends on <strong>jui-ui-vue</strong> for its column show/hide menu, so install both if you're using the grid.
        </p>
    </section>

    <section>
        <h2>Registering components</h2>

        <p>
            Register everything as a Vue plugin, then use any component's tag directly in a template - no separate <strong>ready</strong>
            callback or component lookup by name.
            <pre><code class="language-javascript">import { createApp } from "vue"
import JuiUiVue from "jui-ui-vue"
import "jui-ui-vue/style.css"

createApp(App).use(JuiUiVue).mount("#app")</code></pre>
        </p>
        <p>
            Or import only the components you use, to let bundlers tree-shake the rest.
            <pre><code class="language-markup">&lt;script setup&gt;
import { Select, Datepicker } from "jui-ui-vue"
import "jui-ui-vue/style.css"
&lt;/script&gt;</code></pre>
        </p>
        <p class="br">
            <strong>jui-grid-vue</strong> exports its two components (<strong>DataGrid</strong>, <strong>VirtualGrid</strong>) the same way, and
            needs its own stylesheet too.
            <pre><code class="language-javascript">import { DataGrid } from "jui-grid-vue"
import "jui-grid-vue/style.css"
import "jui-ui-vue/style.css" // the column show/hide menu is jui-ui-vue's Dropdown component</code></pre>
        </p>
    </section>

    <section>
        <h2>Required markup</h2>

        <p>
            Every component's styles are still scoped under a <strong>jui</strong> class, so it needs to sit on an ancestor element -
            <strong>&lt;body&gt;</strong> is simplest.
            <pre><code class="language-markup">&lt;body class="jui"&gt;
    ...
&lt;/body&gt;</code></pre>
        </p>
    </section>

    <section>
        <h2>Components</h2>

        <p>
            <strong>jui-ui-vue</strong> ships 24 components: Switch, ButtonGroup, Tab, NumberChecker, Accordion, Progress, AutoComplete,
            StringChecker, Paging, Notify, Tooltip, Select, Modal, TimePicker, Window, Splitter, Dropdown, Combo, Colorpicker, Slider,
            Layout, Datepicker, Property, Tree.
        </p>
        <p class="br">
            <strong>jui-grid-vue</strong> ships two: <strong>DataGrid</strong> (sort, resize, select/check, inline edit, row drag-reorder,
            tree rows, CSV export) and <strong>VirtualGrid</strong> (the same, for large datasets - virtual-scroll or paged rendering,
            multi-column sort, client-side filtering).
        </p>
    </section>
</div>
</template>
