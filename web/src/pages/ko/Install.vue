<script setup lang="ts">
import { useTitle } from "../../composables/useTitle"

useTitle("JUI Vue: Getting Started")
</script>

<template>
<div class="col col-12 manual">
    <section>
        <h2>Installing the packages</h2>

        <p>
            스타일 컴포넌트와 그리드는 서로 다른 npm 패키지로 분리되어 있습니다. 필요한 것만 설치하면 됩니다.
            <pre><code class="language-javascript">npm install jui-ui-vue
npm install jui-grid-vue</code></pre>
        </p>
        <p class="br">
            둘 다 jQuery나 기존 <strong>juijs</strong> 코어에 의존하지 않는, 순수 Vue 3(Composition API)로 새로 작성된 라이브러리입니다.
            <strong>jui-grid-vue</strong>는 컬럼 표시/숨김 메뉴 때문에 <strong>jui-ui-vue</strong>에 의존하므로, 그리드를 쓴다면 둘 다 설치해야 합니다.
        </p>
    </section>

    <section>
        <h2>Registering components</h2>

        <p>
            Vue 플러그인으로 한 번에 등록하면, 템플릿에서 컴포넌트 태그를 바로 쓸 수 있습니다 - 별도의 <strong>ready</strong> 콜백이나
            이름으로 컴포넌트를 찾는 과정이 필요 없습니다.
            <pre><code class="language-javascript">import { createApp } from "vue"
import JuiUiVue from "jui-ui-vue"
import "jui-ui-vue/style.css"

createApp(App).use(JuiUiVue).mount("#app")</code></pre>
        </p>
        <p>
            아니면 실제로 쓰는 컴포넌트만 개별로 import해서, 번들러가 나머지를 트리쉐이킹하도록 할 수도 있습니다.
            <pre><code class="language-markup">&lt;script setup&gt;
import { Select, Datepicker } from "jui-ui-vue"
import "jui-ui-vue/style.css"
&lt;/script&gt;</code></pre>
        </p>
        <p class="br">
            <strong>jui-grid-vue</strong>도 두 컴포넌트(<strong>DataGrid</strong>, <strong>VirtualGrid</strong>)를 같은 방식으로 export하며,
            자체 스타일시트도 따로 로드해야 합니다.
            <pre><code class="language-javascript">import { DataGrid } from "jui-grid-vue"
import "jui-grid-vue/style.css"
import "jui-ui-vue/style.css" // 컬럼 표시/숨김 메뉴가 jui-ui-vue의 Dropdown 컴포넌트입니다</code></pre>
        </p>
    </section>

    <section>
        <h2>Required markup</h2>

        <p>
            모든 컴포넌트의 스타일은 여전히 <strong>jui</strong> 클래스 하위로 스코프되어 있으므로, 상위 요소 어딘가에 이 클래스가
            있어야 합니다 - 가장 간단한 방법은 <strong>&lt;body&gt;</strong>에 붙이는 것입니다.
            <pre><code class="language-markup">&lt;body class="jui"&gt;
    ...
&lt;/body&gt;</code></pre>
        </p>
    </section>

    <section>
        <h2>Components</h2>

        <p>
            <strong>jui-ui-vue</strong>는 24개 컴포넌트를 제공합니다: Switch, ButtonGroup, Tab, NumberChecker, Accordion, Progress,
            AutoComplete, StringChecker, Paging, Notify, Tooltip, Select, Modal, TimePicker, Window, Splitter, Dropdown, Combo,
            Colorpicker, Slider, Layout, Datepicker, Property, Tree.
        </p>
        <p class="br">
            <strong>jui-grid-vue</strong>는 두 개를 제공합니다: <strong>DataGrid</strong>(정렬, 리사이즈, 선택/체크, 인라인 편집,
            행 드래그 순서 변경, 트리 행, CSV 내보내기)와, 대용량 데이터를 위한 <strong>VirtualGrid</strong>(가상 스크롤 또는
            페이징 렌더링, 다중 컬럼 정렬, 클라이언트 사이드 필터링 등 동일한 기능을 지원).
        </p>
    </section>
</div>
</template>
