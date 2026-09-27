<script setup lang="ts">
import { useTitle } from "../../composables/useTitle"

useTitle("JUI Vue: Basic")
</script>

<template>
<div class="col col-12 manual">
    <section>
        <h2>Using a component</h2>
        <p>
            (<strong>Getting Started</strong>에서) 등록만 해두면, 각 컴포넌트는 템플릿의 태그 하나일 뿐입니다 - <strong>jui.ready()</strong>
            콜백도, 셀렉터로 찾는 과정도 필요 없습니다. prop으로 설정하고, <strong>@event</strong>로 이벤트를 받는 것도 다른 Vue
            컴포넌트와 똑같습니다.

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
            여러 개를 쓸 때도 그냥 태그를 여러 번 쓰면 됩니다 - 예전 셀렉터 기반 API처럼 "일치하는 엘리먼트 배열을 받아오는" 별도
            단계가 없습니다.

            <pre><code class="language-markup">&lt;Tooltip text="Tooltip Message"&gt;&lt;span&gt;Tooltip 1&lt;/span&gt;&lt;/Tooltip&gt;
&lt;Tooltip text="Tooltip Message"&gt;&lt;span&gt;Tooltip 2&lt;/span&gt;&lt;/Tooltip&gt;</code></pre>
        </p>
    </section>

    <section>
        <h2>Rows and columns instead of a template engine</h2>
        <p>
            그리드는 더 이상 <strong>&lt;script type="text/template"&gt;</strong> 태그에서 행 마크업을 읽어오지 않습니다 -
            <strong>columns</strong>와 <strong>rows</strong>는 평범한 prop이고, 이 값이 바뀌면 Vue의 반응형 시스템이 알아서
            테이블을 다시 그립니다.

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
            테이블을 갱신하는 것도 그냥 <strong>rows</strong>를 바꾸는 것뿐입니다 - push하든, splice하든, 통째로 재할당하든
            그리드가 그대로 따라갑니다. 별도의 <strong>table.update(...)</strong> 호출도, 여러 테이블에서 재사용할 템플릿
            문자열도 필요 없습니다: 셀을 커스텀하게 그리고 싶으면 <strong>#cell-&lt;key&gt;</strong> scoped slot을 쓰면 됩니다.

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
            대부분은 선언적인 prop/event로 처리하지만, 몇몇 동작(행 선택, 트리 노드 열기, CSV 내보내기)은 여전히 명령형으로
            호출합니다 - 예전처럼 셀렉터가 반환하던 인스턴스 대신, 템플릿 ref를 통해서입니다.

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
            <strong>DataGrid</strong>/<strong>VirtualGrid</strong>는 이런 식으로
            <strong>select</strong>/<strong>check</strong>/<strong>uncheckAll</strong>, 트리 메서드(<strong>open</strong>,
            <strong>fold</strong>, <strong>openAll</strong>, <strong>foldAll</strong>), 컬럼 표시 여부
            (<strong>showColumn</strong>, <strong>hideColumn</strong>), CSV(<strong>getCsv</strong>, <strong>exportCsv</strong>,
            <strong>setCsv</strong>)를 제공합니다 - 전체 목록은 <strong>Components</strong> 메뉴의 각 컴포넌트 데모 페이지를
            참고하세요.
        </p>
    </section>

    <section>
        <h2>TypeScript</h2>
        <p>
            두 라이브러리 모두 TypeScript로 작성되어 자체 타입을 제공합니다 - 위에서 쓴 <strong>jui-grid-vue</strong>의
            <strong>GridColumn</strong>/<strong>GridRow</strong>는 문서용 표기가 아니라 실제로 export되는 타입입니다.
            컴포넌트 prop에도 타입이 붙어 있어서, Vue/TS를 지원하는 에디터라면 prop 이름 오타나 잘못된 값 타입을 작성하는
            즉시 잡아줍니다.
        </p>
    </section>
</div>
</template>
