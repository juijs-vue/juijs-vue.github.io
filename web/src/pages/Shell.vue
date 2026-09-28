<script setup lang="ts">
import { computed } from "vue"
import { useRoute } from "vue-router"
import AppNav from "../components/AppNav.vue"
import DownloadMenu from "../components/DownloadMenu.vue"
import AppFooter from "../components/AppFooter.vue"
import SubNav from "../components/SubNav.vue"
import { useLang } from "../composables/useLang"
import { useBodyClass } from "../composables/useBodyClass"

useBodyClass("jui")

import HomeEn from "./en/Home.vue"
import AboutEn from "./en/About.vue"
import InstallEn from "./en/Install.vue"
import BasicEn from "./en/Basic.vue"
import ChartEn from "./en/Chart.vue"
import HomeKo from "./ko/Home.vue"
import AboutKo from "./ko/About.vue"
import InstallKo from "./ko/Install.vue"
import BasicKo from "./ko/Basic.vue"
import ChartKo from "./ko/Chart.vue"
import GalleryList from "./GalleryList.vue"
import GalleryView from "./GalleryView.vue"

const route = useRoute()
const { lang } = useLang()
const base = import.meta.env.BASE_URL

const page = computed(() => (typeof route.query.p === "string" ? route.query.p : undefined))

const SUB_NAV_TEXT: Record<string, Record<string, { title: string; msg: string }>> = {
    install: {
        en: { title: "Getting Started", msg: "JUI framework is very easy to install and use." },
        ko: { title: "Getting Started", msg: "JUI 프레임워크는 간단하게 설치하여 사용할 수 있습니다." }
    },
    basic: {
        en: { title: "Basic", msg: "To make it easier to develop a user interface provides many core functions." },
        ko: { title: "Basic", msg: "JUI 프레임워크를 사용하기 위한 기본적인 인터페이스에 대한 소개입니다." }
    }
}

const ABOUT_TEXT: Record<string, { msg: string }> = {
    en: {
        msg: "Would you like to participate JUI project?<br/>All you need is interest and passion for the project.<br/>Try it now."
    },
    ko: { msg: "JUI 프로젝트는 누구나 참여할 수 있습니다.<br/>오픈소스에 대한 열정과 관심만 있으면 됩니다.<br/>지금 도전해주세요." }
}

const homePage = computed(() => (lang.value === "ko" ? HomeKo : HomeEn))
const aboutPage = computed(() => (lang.value === "ko" ? AboutKo : AboutEn))
const installPage = computed(() => (lang.value === "ko" ? InstallKo : InstallEn))
const basicPage = computed(() => (lang.value === "ko" ? BasicKo : BasicEn))
const chartPage = computed(() => (lang.value === "ko" ? ChartKo : ChartEn))
</script>

<template>
    <AppNav>
        <template #download-button><DownloadMenu /></template>
    </AppNav>

    <component :is="homePage" v-if="!page" />

    <template v-else-if="page === 'about'">
        <nav class="navbar fixed top about">
            <div class="center">
                <div class="notice">
                    <div class="title">About Us</div>
                    <div class="msg" v-html="ABOUT_TEXT[lang].msg"></div>
                </div>
                <img :src="`${base}res/img/about.png`" />
            </div>
        </nav>
        <article>
            <div class="center row">
                <component :is="aboutPage" />
            </div>
        </article>
    </template>

    <component :is="chartPage" v-else-if="page === 'chart'" />

    <GalleryList v-else-if="page === 'gallery'" />
    <GalleryView v-else-if="page.startsWith('gallery.')" />

    <template v-else-if="page === 'install' || page === 'basic'">
        <SubNav v-bind="SUB_NAV_TEXT[page][lang]" />
        <article>
            <div class="center row">
                <component :is="page === 'install' ? installPage : basicPage" />
            </div>
        </article>
    </template>

    <AppFooter />
</template>
