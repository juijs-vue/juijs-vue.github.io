<template>
<!-- 원본(loader.php raw)은 이 버튼들이 페이지 맨 위(margin/padding 0)에 붙어있어서 "Top"
     tooltip이 뜰 자리가 전혀 없다 - 그래서 버튼 자체를 완전히 덮어버린다(production도 실제로
     동일하게 덮는다, screenshot으로 직접 확인함). 버튼을 가리지 않고 위로 뜨길 원하므로 위에
     여백을 둬서 "Top" tooltip이 뜰 실제 공간을 만든다. -->
<div style="margin-top: 40px;">
<Tooltip text="Tooltip Message" position="right" :width="300" align="center">
    <button class="btn small">Right</button>
</Tooltip> <Tooltip text="Tooltip Message" position="top">
    <button class="btn small">Top</button>
</Tooltip> <Tooltip text="Tooltip Message" position="bottom" show-type="click">
    <button class="btn small">Bottom</button>
</Tooltip> <Tooltip text="Tooltip Message" position="left" :delay="1000">
    <button class="btn small">Left</button>
</Tooltip>
</div>
</template>
