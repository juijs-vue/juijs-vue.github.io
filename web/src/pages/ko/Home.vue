<script setup lang="ts">
import HomeBanner from "../../components/HomeBanner.vue"
import { useTitle } from "../../composables/useTitle"

useTitle("JUI Vue: A Vue 3 UI framework with rich components, SVG charts and a fast grid.")
</script>

<template>
    <HomeBanner />

    <article>
        <div class="center row">
            <div class="col col-12 home">
                <section>
                    <div class="row">
                        <div class="col col-4">
                            <div class="title">
                                <div class="img img-col-1 icon"></div><br />
                                <div class="title-msg">Vue 3 & TypeScript 기반</div>
                            </div>
                            <p>
                                라이브러리는 개발의 편의성을 위해 Vue 3와 TypeScript로<br />
                                작성되었으며, 스타일은 코드의 재사용과 확장성을 위해<br />
                                LESS를 사용하였습니다.
                            </p>
                        </div>
                        <div class="col col-4">
                            <div class="title">
                                <div class="img img-col-2 icon"></div><br />
                                <div class="img img-col-2-msg"></div>
                            </div>
                            <p>
                                다양한 인터페이스 요구를 아우르는 25종의 UI 컴포넌트를<br />
                                제공합니다. 라이브러리가 발전함에 따라 새로운 컴포넌트도<br />
                                계속 추가되고 있습니다.
                            </p>
                        </div>
                        <div class="col col-4">
                            <div class="title">
                                <div class="img img-col-3 icon"></div><br />
                                <div class="img img-col-3-msg"></div>
                            </div>
                            <p>
                                스타일 컴포넌트는 기본 기능 외의 다양한 옵션 클래스를<br />
                                제공하며 이를 조합하면 보다 다양한 스타일을 구현할 수<br />
                                있습니다. 그리고 스타일만이 아닌 스크립트 컴포넌트와의<br />
                                조합도 가능하며, 이러한 특징을 잘 활용하여<br />
                                좀 더 다양한 UI 컴포넌트를 개발할 수 있습니다.
                            </p>
                        </div>
                    </div>
                    <div class="row row-line">&nbsp;</div>
                    <div class="row">
                        <div class="col col-4">
                            <div class="title">
                                <div class="img img-col-6 icon"></div><br />
                                <div class="img img-col-6-msg"></div>
                            </div>
                            <p>
                                차트의 배경이 되는 12종의 그리드와 데이터를 표현할<br />
                                수 있는 84종의 브러쉬 그리고 인터랙션을 담당하는 <br />
                                18종의 위젯을 제공합니다. 또한 다양한 스타일의 차트에 적용할 수 있는 테마를 지원합니다.
                            </p>
                        </div>
                        <div class="col col-4">
                            <div class="title">
                                <div class="img img-col-5 icon"></div><br />
                                <div class="img img-col-5-msg"></div>
                            </div>
                            <p>
                                JUI Vue는 최신 브라우저 대부분에서 동작합니다.<br />
                                (Chrome, FireFox, Safari, Edge)<br />
                            </p>
                        </div>
                        <div class="col col-4">
                            <div class="title">
                                <div class="img img-col-4 icon"></div><br />
                                <div class="img img-col-4-msg"></div>
                            </div>
                            <p>
                                수십수백만 건의 로우를 처리할 수 있으며, 수 많은 옵션과 기능을 제공합니다. 또한 트리 형태의 로우를 표현할 수 있는 강력한 테이블
                                컴포넌트를 제공합니다.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </article>
</template>
