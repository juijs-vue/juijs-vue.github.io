<script setup lang="ts">
import { useTitle } from "../../composables/useTitle"

useTitle("JUI Vue: Basic")
</script>

<template>
<div class="col col-12 manual">
    <section>
        <h2>Using a component</h2>
        <p>
            Once registered (see <strong>Getting Started</strong>), every component is just a tag in your template - no
            <strong>jui.ready()</strong> callback, no selector-based lookup. Props configure it, <strong>@event</strong> listens
            to it, same as any other Vue component.

            <pre><code class="language-markup">&lt;script setup&gt;
import { ref } from "vue"

const tips = ref("Tooltip Message")
&lt;/script&gt;

&lt;template&gt;
  &lt;Tooltip :text="tips" position="top"&gt;
    &lt;button&gt;Hover me&lt;/button&gt;
  &lt;/Tooltip&gt;
&lt;/template&gt;</code></pre>
        </p>
        <p class="br">
            Multiple instances are just multiple tags - there's no separate "get the array of matched elements" step the way the
            old selector-based API needed.

            <pre><code class="language-markup">&lt;Tooltip text="Tooltip Message"&gt;&lt;span&gt;Tooltip 1&lt;/span&gt;&lt;/Tooltip&gt;
&lt;Tooltip text="Tooltip Message"&gt;&lt;span&gt;Tooltip 2&lt;/span&gt;&lt;/Tooltip&gt;</code></pre>
        </p>
    </section>

    <section>
        <h2>Rows and columns instead of a template engine</h2>
        <p>
            The grid no longer reads its row markup from a <strong>&lt;script type="text/template"&gt;</strong> tag - <strong>columns</strong>
            and <strong>rows</strong> are plain props, and Vue's own reactivity re-renders the table whenever they change.

            <pre><code class="language-markup">&lt;script setup lang="ts"&gt;
import { reactive } from "vue"
import { DataGrid } from "jui-grid-vue"
import type { GridColumn, GridRow } from "jui-grid-vue"

const columns: GridColumn[] = [
  { key: "name", label: "Name" },
  { key: "age", label: "Age" },
  { key: "location", label: "Location" }
]

const rows = reactive&lt;GridRow[]&gt;([
  { id: 1, data: { name: "Hong", age: 29, location: "Ilsan" } },
  { id: 2, data: { name: "Jung", age: 25, location: "Dangsan" } }
])
&lt;/script&gt;

&lt;template&gt;
  &lt;DataGrid :columns="columns" :rows="rows" sortable resizable /&gt;
&lt;/template&gt;</code></pre>
        </p>
        <p class="br">
            Updating the table is just mutating <strong>rows</strong> - push, splice, or reassign it, and the grid follows along.
            There's no separate <strong>table.update(...)</strong> call, and no template string to reuse across tables: a custom
            cell layout is a <strong>#cell-&lt;key&gt;</strong> scoped slot instead.

            <pre><code class="language-markup">&lt;DataGrid :columns="columns" :rows="rows"&gt;
  &lt;template #cell-name="{ row }"&gt;
    &lt;strong&gt;&#123;&#123; row.data.name &#125;&#125;&lt;/strong&gt;
  &lt;/template&gt;
&lt;/DataGrid&gt;</code></pre>
        </p>
    </section>

    <section>
        <h2>Imperative API via template refs</h2>
        <p>
            Most things are declarative props/events, but a handful of actions (select a row, open a tree node, export CSV) are
            still called imperatively - through a template ref instead of the old selector-returned instance.

            <pre><code class="language-markup">&lt;script setup lang="ts"&gt;
import { ref } from "vue"
import { DataGrid } from "jui-grid-vue"

const grid = ref&lt;InstanceType&lt;typeof DataGrid&gt;&gt;()

function selectFirstRow() {
  grid.value?.select(rows[0].id)
}
&lt;/script&gt;

&lt;template&gt;
  &lt;DataGrid ref="grid" :columns="columns" :rows="rows" selectable /&gt;
&lt;/template&gt;</code></pre>
        </p>
        <p class="br">
            <strong>DataGrid</strong>/<strong>VirtualGrid</strong> expose <strong>select</strong>/<strong>check</strong>/<strong>uncheckAll</strong>,
            tree methods (<strong>open</strong>, <strong>fold</strong>, <strong>openAll</strong>, <strong>foldAll</strong>), column
            visibility (<strong>showColumn</strong>, <strong>hideColumn</strong>), and CSV (<strong>getCsv</strong>,
            <strong>exportCsv</strong>, <strong>setCsv</strong>) this way - see each component's own demo pages under
            <strong>Components</strong> for the full list.
        </p>
    </section>

    <section>
        <h2>TypeScript</h2>
        <p>
            Both libraries are written in TypeScript and ship their own types - <strong>GridColumn</strong>/<strong>GridRow</strong>
            from <strong>jui-grid-vue</strong> above are real exported types, not documentation shorthand. Component props are typed
            too, so an editor with Vue/TS support will flag a typo'd prop name or a wrong value type as you write it.
        </p>
    </section>
</div>
</template>
