<template>
<!-- .popover 자체는 원래 position:absolute(팝오버 단독 사용 시 필요) - 하지만 여기서는 이미
     position:absolute인 Tooltip의 wrapper(.tooltip) 안에 슬롯으로 들어가는데, abs-positioned
     자식은 부모의 width:max-content 계산에 전혀 기여하지 않아(부모의 :width/:align prop이
     적용될 자리가 없어짐) 좁고 세로로 긴 박스가 됐었다 - relative로 덮어써서 wrapper의 실제
     콘텐츠로 참여시켜 width/align이 정상 적용되게 한다(static이 아니라 relative인 이유: .popover
     자신의 ::before/::after 화살표가 right:100%/top:50%로 .popover 기준 위치를 잡는데, static이면
     이 pseudo-element들의 containing block이 wrapper로 넘어가 화살표 위치가 어긋난다). -->
<Tooltip position="right" :width="300" align="left" show-type="click" hide-type="click" text="With Popover, With Popover, With Popover, With Popover, With Popover, With Popover"> <button class="btn small">Popover</button> <template #tooltip>
        <div class="popover right" style="position: relative; width: 300px; z-index: 10001;">
            <div class="head">Subject</div>
            <div class="body">
                <div class="image"><i class="icon-caution"></i></div>
                <div class="message">With Popover, With Popover, With Popover, With Popover, With Popover, With Popover</div>
            </div>
        </div>
    </template>
</Tooltip>
</template>
