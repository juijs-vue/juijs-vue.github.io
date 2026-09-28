<script setup lang="ts">
// 원본 res/index.js의 initAnimation() 포팅 - 슬라이드 3장을 크로스페이드로 전환한다.
// 원본 함수명이 화살표 방향과 반대로 붙어있다(왼쪽 화살표 클릭 -> next(), 오른쪽 화살표
// 클릭 -> prev()) - 동작 자체는 그대로 옮기고 이름만 방향에 맞게 바꿨다.
import { onMounted, onBeforeUnmount, ref } from "vue"

const SLIDE_COUNT = 3
const DURATION = 30000

const index = ref(0)
const arrowsVisible = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

// 오른쪽(다음) 방향 - index 감소, 원본의 prev() 함수와 동일한 동작.
function goRight() {
    const prevIdx = index.value
    const nextIdx = prevIdx === 0 ? SLIDE_COUNT - 1 : prevIdx - 1
    runTransition(prevIdx, nextIdx, "pt-page-moveToRightFade", "pt-page-moveFromLeftFade")
}

// 왼쪽(이전) 방향 - index 증가, 원본의 next() 함수와 동일한 동작.
function goLeft() {
    const prevIdx = index.value
    const nextIdx = prevIdx === SLIDE_COUNT - 1 ? 0 : prevIdx + 1
    runTransition(prevIdx, nextIdx, "pt-page-moveToLeftFade", "pt-page-moveFromRightFade")
}

function runTransition(prevIdx: number, nextIdx: number, outCls: string, inCls: string) {
    prevOutCls.value = { idx: prevIdx, cls: outCls }
    index.value = nextIdx
    inClsState.value = inCls

    const el = slideRefs.value[nextIdx]
    const handler = () => {
        prevOutCls.value = null
        inClsState.value = ""
        el?.removeEventListener("animationend", handler)
    }
    el?.addEventListener("animationend", handler)
}

const prevOutCls = ref<{ idx: number; cls: string } | null>(null)
const inClsState = ref("")
const slideRefs = ref<(HTMLElement | null)[]>([])

function classesFor(i: number) {
    const classes: string[] = []
    if (prevOutCls.value?.idx === i) classes.push(prevOutCls.value.cls)
    if (i === index.value && inClsState.value) classes.push(inClsState.value)
    return classes
}

function selectDot(i: number) {
    index.value = i
    prevOutCls.value = null
    inClsState.value = ""
}

onMounted(() => {
    timer = setInterval(goRight, DURATION)
})
onBeforeUnmount(() => {
    if (timer) clearInterval(timer)
})
</script>

<template>
    <div class="main" @mouseenter="arrowsVisible = true" @mouseleave="arrowsVisible = false">
        <nav
            v-for="(_, i) in SLIDE_COUNT"
            :key="i"
            ref="slideRefs"
            class="navbar fixed top"
            :class="classesFor(i)"
            v-show="i === index || prevOutCls?.idx === i"
        >
            <div class="center" v-if="i === 0">
                <div class="container">
                    <div class="title">What is JUI Vue?</div>
                    <div class="detail">
                        Simple, and fast, JUI Vue is an all-in-one UI framework for Vue 3.<br />
                        It offers a rich set of UI components, a fast data grid and SVG-based chart components.<br />
                        All components are free, including JUI Chart Vue.
                    </div>
                    <a href="https://github.com/juijs-vue/" target="_blank"><div class="img img-download-main"></div></a>
                </div>
            </div>
            <div class="center" v-else-if="i === 1">
                <div class="container-2">
                    <div class="title">Simple &amp; Easy<br />JUI Chart Vue</div>
                    <div class="detail">
                        JUI Chart Vue provides a variety of brushes, axes and widgets.<br />
                        You can represent data in conjunction with the JUI Grid Vue table component.
                    </div>
                </div>
            </div>
            <div class="center" v-else>
                <div class="container-4">
                    <div class="title">Manipulating SVG Icons<br />With Simple CSS</div>
                    <div class="detail">
                        JUI Vue includes a variety of vector-type icons.<br />
                        That means they can be used at any size.
                    </div>
                </div>
            </div>
        </nav>

        <div class="img img-control-left" @click="goLeft" :style="{ opacity: arrowsVisible ? 1 : 0 }"></div>
        <div class="img img-control-right" @click="goRight" :style="{ opacity: arrowsVisible ? 1 : 0 }"></div>

        <div class="center">
            <div class="dotnav">
                <ul>
                    <li v-for="i in SLIDE_COUNT" :key="i">
                        <a href="#" :class="{ current: i - 1 === index }" @click.prevent="selectDot(i - 1)"></a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
