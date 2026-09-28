<template>
﻿<section>
    <h2>Default</h2>

    <!-- 원본 소스는 <p> 안에 <div>가 바로 오는데, 이는 HTML5 파싱 규칙상 유효하지 않아
         브라우저가 <div> 앞에서 <p>를 암묵적으로 닫아버린다(실제로는 tooltip들이 <p>의
         자식이 아니라 <section>의 형제) - 그래서 tooltip들의 static position 계산 기준이
         달라진다. Vue 컴파일러는 이 자동 교정을 하지 않으므로 원본 브라우저가 만드는
         실제 DOM 구조(및 끝에 남는 빈 <p></p>)를 그대로 마크업에 반영했다. -->
    <p>
        Tooltip is comprised of a title and anchors on the left/right side and at the top/bottom.
    </p>

    <div class="tooltip">
        <div class="anchor"></div>
        <div class="message">Title contents</div>
    </div>

    <div class="tooltip left" style="left: 125px;">
        <div class="anchor"></div>
        <div class="message">Title contents</div>
    </div>

    <div class="tooltip right" style="left: 250px;">
        <div class="anchor"></div>
        <div class="message">Title contents</div>
    </div>

    <div class="tooltip top" style="left: 375px;">
        <div class="anchor"></div>
        <div class="message">Title contents</div>
    </div>

    <div class="tooltip bottom" style="left: 500px;">
        <div class="anchor"></div>
        <div class="message">Title contents</div>
    </div>

    <p></p>
</section>
</template>
