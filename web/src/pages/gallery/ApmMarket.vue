<script setup lang="ts">
// @ts-nocheck
// Native Vue3 port of gallery/apmmarket (legacy jQuery + jui.chart demo, still at
// gallery/apmmarket/index.html + pop_1/2/3.html on `main`). Ported 1:1 in behavior: 3 flip-cards
// (hover to flip, showing a "READ MORE" button) that each open a fullscreen popup with its own
// world-map chart (map.comparebubble/map.selector/map.note/map.bubble brushes + a mixed column
// chart for pop_3). The legacy popup was an <iframe> with a scripted width/height/position
// transition timed around the iframe's own load event (a workaround for loading a SEPARATE HTML
// document) - replaced here with a real Vue-native absolutely-positioned overlay + the SAME CSS
// transition, since the popup content is just another one of THIS component's own <Chart>s, not a
// separate document that needs loading at all.
import { computed, nextTick, onBeforeUnmount, ref } from "vue"
import { Chart } from "jui-chart-vue"

const base = import.meta.env.BASE_URL
const img = (name: string) => `${base}gallery/apmmarket/images/${name}`
const mapPath = `${base}gallery/apmmarket/images/world-1040x660.svg`

const CARDS = [
    {
        image: img("summary_1.jpg"),
        title: "APM Market Share Analysis",
        content: "The application performance monitoring market had another strong year...",
        hoverBg: "#814fd5",
        hoverInfo: "GARTNER",
        hoverTitle: "APM Market Share Analysis",
        hoverContent: "The application performance monitoring market had another strong year, growing 13.1% and reaching $2.4 billion in 2013.",
        popupBg: "#814fd5",
        popupInfo: "GARTNER",
        popupTitle: "APM Market Share Analysis",
        popupDesc: "The application performance monitoring market had another strong year, growing 13.1% and reaching $2.4 billion in 2013. A new class of vendors, with simplified and innovative business models, is altering the market landscape of traditional APM providers.",
        popupDark: false
    },
    {
        image: img("summary_2.jpg"),
        title: "JenniferSoft Worldwide Partners",
        content: "JenniferSoft, Inc an independent software vender company in the Application Performance...",
        hoverBg: "#ffcb2b",
        hoverInfo: "JenniferSoft",
        hoverTitle: "JenniferSoft Worldwide Partners",
        hoverContent: "JenniferSoft, Inc an independent software vender company in the Application Performance Management(APM) market.",
        popupBg: "#ffcb2b",
        popupInfo: "JenniferSoft",
        popupTitle: "JenniferSoft Worldwide Partners",
        popupDesc: "JenniferSoft, Inc an independent software vender company in the Application Performance Management(APM) market. JenniferSoft has made it's best efforts to establish a solid relationship of trust with worldwide reselling partners and our customers.",
        popupDark: true
    },
    {
        image: img("summary_3.jpg"),
        title: "JENNIFER5 Reference",
        content: "Currently, the total number of enterprise customers of JENNIFER5 is 1024 by jun 10th 2015.",
        hoverBg: "#1abc9c",
        hoverInfo: "JenniferSoft",
        hoverTitle: "JENNIFER5 Reference",
        hoverContent: "Currently, the total number of enterprise customers of JENNIFER5 is 1024 by jun 10th 2015.",
        popupBg: "#1abc9c",
        popupInfo: "JenniferSoft",
        popupTitle: "JENNIFER5 Reference",
        popupDesc: "Since its inception in 2005, JenniferSoft has deployed JENNIFER5 to 261 new customer sites in 2008, 478 in 2010, 683 in 2012. Currently, the total number of enterprise customers of JENNIFER5 is 1028 by Jun 10th 2015.",
        popupDark: false
    }
]

const hoveredIndex = ref<number | null>(null)
const openIndex = ref<number | null>(null)
const isOpen = computed(() => openIndex.value !== null)

function openPopup(index: number) {
    openIndex.value = index
    nextTick(recalcMapScale)
}
function closePopup() {
    openIndex.value = null
}

// --- Map scale (mirrors each legacy pop_N.html's own window-resize handler) -------------------
const chartWrapEl = ref<HTMLElement | null>(null)
const mapScale = ref({ width: 1040, height: 660, scale: 1, viewX: 0, viewY: 0 })

function recalcMapScale() {
    if (!chartWrapEl.value) return
    const top = chartWrapEl.value.getBoundingClientRect().top
    const h = window.innerHeight - top
    // A window short enough (or a resize event firing mid-transition/at an odd moment - e.g. a
    // test harness's "capture the whole scrollable page" screenshot mode briefly resizing the
    // viewport) can put `top` below the available height entirely, going negative here - passing
    // that straight to <Chart>'s width/height would throw (SVG rejects negative attribute values).
    // Skip the update rather than apply a nonsensical size; the next real resize/reopen corrects it.
    if (h <= 0) return
    const s = h / 660
    const w = 1060 * s
    if (openIndex.value === 2) {
        const p = 100
        mapScale.value = { width: w, height: h, scale: h / (660 + p), viewX: (1060 + p - w) / 2, viewY: (660 + p - h) / 2 }
    } else {
        mapScale.value = { width: w, height: h, scale: s, viewX: (1060 - w) / 2, viewY: (660 - h) / 2 }
    }
}
window.addEventListener("resize", recalcMapScale)
onBeforeUnmount(() => window.removeEventListener("resize", recalcMapScale))

// --- Popup 1: APM Market Share Analysis (map.comparebubble) -----------------------------------
const popup1Axis = computed(() => [{
    map: { path: mapPath, width: 1040, height: 660, scale: mapScale.value.scale, viewX: mapScale.value.viewX, viewY: mapScale.value.viewY },
    data: [
        { title: "2014", value: 2.6 },
        { title: "2013", value: 2.3 }
    ]
}])
const popup1Brush = [
    { type: "map.comparebubble", size: 150, colors: ["#ffc000", "#fffc00"], format: (value: number) => `$${value} Billion` },
    { type: "map.selector", active: ["KR", "JP", "CN", "TH", "MY", "AU", "IL", "TR", "RO", "IT", "PL", "IE", "UA", "DE", "AT", "CH", "ES", "PT", "US", "BR"] }
]
const popup1Widget = [{ type: "title", size: 50, color: "white", text: "15.8%", dy: 40 }]
const popup1Style = {
    fontFamily: "noto sans, sans-serif",
    backgroundColor: "transparent",
    mapPathBackgroundColor: "rgb(149,107,220)",
    mapPathBorderColor: "#814fd5",
    mapPathBorderWidth: 0.5,
    mapSelectorColor: "rgb(149,107,220)",
    mapSelectorActiveColor: "#a481e1"
}

// --- Popup 2: JenniferSoft Worldwide Partners (map.selector + map.note) ------------------------
const COUNTRY_NAMES: Record<string, string> = {
    KR: "Korea", JP: "Japan", CN: "China", TH: "Thailand", MY: "Malaysia", AU: "Australia", IL: "Israel",
    TR: "Turkey", RO: "Turkey", IT: "Italy", PL: "Poland", IE: "Ireland", UA: "Ukraine", DE: "Germany",
    AT: "Austria", CH: "Switzerland", ES: "Spain", PT: "Portugal", US: "USA", BR: "Brazil"
}
const partnerData = [
    { id: "KR", value: 3, texts: ["2010 SK C&C", "2008 LG N-Sys", "2006 samsung SDS"] },
    { id: "JP", value: 7, texts: ["2010 Security and Knowledge Support Service", "2010 Shin Nihon System Technology Corporation", "2009 OrioGlobal, Ltd.", "2008 Blaze Consulting", "2008 Hitachi information Systems", "2008 NEC Corporation", "2006 K.K Ashisuto"] },
    { id: "CN", value: 4, texts: ["2013 KunlanSoft", "2012 Esol", "2012 Encore", "2009 JawaSoft"] },
    { id: "TH", value: 1, texts: ["2013 INGRAM MICRO"] },
    { id: "MY", value: 1, texts: ["2010 Pocketpixel"] },
    { id: "AU", value: 1, texts: ["2010 Pickett Computer Services Pty Ltd"] },
    { id: "IL", value: 1, texts: ["2011 Infomanta"] },
    { id: "TR", value: 1, texts: ["2012 VBT"] },
    { id: "RO", value: 1, texts: ["2011 Castalia"] },
    { id: "IT", value: 1, texts: ["2012 Expertise4IT"] },
    { id: "PL", value: 1, texts: ["2009 WorldIT"] },
    { id: "IE", value: 1, texts: ["2012 keFox"] },
    { id: "UA", value: 1, texts: ["2012 keFox"] },
    { id: "DE", value: 1, texts: ["2011 NuPSoft"] },
    { id: "AT", value: 1, texts: ["2011 NuPSoft"] },
    { id: "CH", value: 1, texts: ["2011 NuPSoft"] },
    { id: "ES", value: 1, texts: ["2011 VANTIS"] },
    { id: "PT", value: 1, texts: ["2011 VANTIS"] },
    { id: "US", value: 2, texts: ["2012 TONE Software", "2008 Caucho Technology, Inc"] },
    { id: "BR", value: 2, texts: ["2011 VANTIS", "2010 Sun Software"] }
]
const popup2Axis = computed(() => [{
    map: { path: mapPath, width: 1040, height: 660, scale: mapScale.value.scale, viewX: mapScale.value.viewX, viewY: mapScale.value.viewY },
    data: partnerData
}])
const popup2Brush = [
    { type: "map.selector", active: partnerData.map((d) => d.id) },
    { type: "map.note", activeEvent: "map.mouseover", format: (data: { id: string; value: number }) => `${COUNTRY_NAMES[data.id]}: ${data.value}` }
]
const popup2Style = {
    fontFamily: "noto sans, sans-serif",
    backgroundColor: "transparent",
    mapPathBackgroundColor: "rgb(255,229,149)",
    mapPathBorderColor: "#ffcb2b",
    mapPathBorderWidth: 0.5,
    mapSelectorHoverColor: "rgb(255,255,255)",
    mapSelectorActiveColor: "rgb(242,140,8)"
}

// --- Popup 3: JENNIFER5 Reference (map.bubble + column) ----------------------------------------
const referenceData = [
    { id: "KR", value: 3 }, { id: "JP", value: 7 }, { id: "CN", value: 4 }, { id: "TH", value: 1 },
    { id: "MY", value: 1 }, { id: "AU", value: 1 }, { id: "IL", value: 1 }, { id: "TR", value: 1 },
    { id: "RO", value: 1 }, { id: "IT", value: 1 }, { id: "PL", value: 1 }, { id: "IE", value: 1 },
    { id: "UA", value: 1 }, { id: "DE", value: 1 }, { id: "AT", value: 1 }, { id: "CH", value: 1 },
    { id: "ES", value: 1 }, { id: "PT", value: 1 }, { id: "US", value: 2 }, { id: "BR", value: 2 }
]
const salesData = [
    { year: "2008", sales: 261 }, { year: "2009", sales: 375 }, { year: "2010", sales: 478 }, { year: "2011", sales: 586 },
    { year: "2012", sales: 683 }, { year: "2013", sales: 820 }, { year: "2014", sales: 1028 }
]
const popup3Axis = computed(() => [
    {
        map: { path: mapPath, width: 1040, height: 660, scale: mapScale.value.scale, viewX: mapScale.value.viewX, viewY: mapScale.value.viewY },
        data: referenceData
    },
    {
        x: { type: "block", domain: "year", line: false },
        y: { type: "range", domain: [0, 1000], step: 5, line: true },
        area: { y: "70%", height: "25%" },
        data: salesData
    }
])
const popup3Brush = [
    { type: "map.bubble", colors: ["rgb(129,79,213)"], showText: true, min: 15, max: 50 },
    { type: "map.selector", active: referenceData.map((d) => d.id) },
    { type: "column", target: "sales", size: 20, axis: 1, display: "all", clip: false, colors: (d: { sales: number }) => (d.sales < 1000 ? "#555d69" : "#fff000") }
]
const popup3Style = {
    fontFamily: "noto sans, sans-serif",
    backgroundColor: "transparent",
    gridFontColor: "rgba(255,255,255,0.9)",
    gridYFontSize: 14,
    gridYFontColor: "white",
    gridXFontSize: 17,
    gridXFontColor: "black",
    gridXFontWeight: "bold",
    gridBorderColor: "#b8e5de",
    gridYAxisBorderWidth: 0,
    gridXAxisBorderWidth: 1,
    gridXAxisBorderColor: "white",
    gridTickBorderSize: 0,
    gridTickPadding: 10,
    tooltipPointRadius: 0,
    tooltipPointBorderWidth: 0,
    tooltipPointFontSize: "17px",
    barBorderRadius: 0,
    mapPathBackgroundColor: "rgb(170,223,215)",
    mapPathBorderColor: "#1abc9c",
    mapPathBorderWidth: 0.5,
    mapBubbleBackgroundOpacity: 0.6,
    mapSelectorHoverColor: "rgb(255,255,255)",
    mapSelectorActiveColor: "rgb(255,255,255)"
}
</script>

<template>
    <div class="apmmarket">
        <div id="logo"><img :src="img('logo.png')" @click="() => window.open('http://jennifersoft.com')" /></div>
        <div id="header">
            <span class="link" @click="() => window.open('http://jui.io')">jui.io</span><br />
            <p>Create your own chart with JUI.</p>
        </div>
        <center>
            <div class="text">
                <h1>Application<br />Performance Monitoring<br />Market Status</h1>
                <h2>JENNIFER5 is a smart APM solution for Application Performance Monitoring</h2>
            </div>
            <div class="item">
                <div class="summary">
                    <div
                        v-for="(card, i) in CARDS"
                        :key="i"
                        class="summary-box"
                        :style="{ left: `${i * 258}px` }"
                        @mouseenter="hoveredIndex = i"
                        @mouseleave="hoveredIndex = null"
                    >
                        <div v-show="hoveredIndex !== i" class="summary-normal">
                            <div class="imagesfield"><img :alt="card.title" :src="card.image" /></div>
                            <div class="summary-info">
                                <div class="title">{{ card.title }}</div>
                                <div class="content">{{ card.content }}</div>
                            </div>
                        </div>
                        <div v-show="hoveredIndex === i" class="summary-hover flipInY animated" :style="{ backgroundColor: card.hoverBg }">
                            <div class="info">{{ card.hoverInfo }}</div>
                            <div class="title">{{ card.hoverTitle }}</div>
                            <div class="content">{{ card.hoverContent }}</div>
                            <a href="#" class="btn btn-default" @click.prevent="openPopup(i)">READ MORE</a>
                        </div>
                    </div>
                </div>
            </div>
        </center>

        <div id="footer">
            Like this? Your friends will, too. Share on.
            <i class="social-icon facebook"></i>
            <i class="social-icon twitter"></i>
            <i class="social-icon googleplus"></i>
            <i class="social-icon linkedin"></i>
        </div>

        <!-- Teleported to <body> - this page renders inside the site's own shell (header/nav as
             a sibling somewhere up the tree), and THAT ancestor's own stacking context caps any
             z-index set here no matter how high, the same reason jui-ui-vue's own Window.vue
             modal teleports to <body> instead of relying on z-index alone. -->
        <Teleport to="body">
        <Transition name="popup-grow">
            <div v-if="isOpen" class="popupcontent" :style="{ backgroundColor: CARDS[openIndex!].popupBg }">
                <i class="close close-default" @click="closePopup"></i>
                <center>
                    <div class="slide" :class="{ dark: CARDS[openIndex!].popupDark }">
                        <div class="text">
                            <h3>{{ CARDS[openIndex!].popupInfo }}</h3>
                            <h1>{{ CARDS[openIndex!].popupTitle }}</h1>
                            <h2>{{ CARDS[openIndex!].popupDesc }}</h2>
                        </div>
                    </div>
                </center>
                <div ref="chartWrapEl" class="chart-wrap">
                    <Chart v-if="openIndex === 0" :width="mapScale.width" :height="mapScale.height" :padding="0" :axis="popup1Axis" :brush="popup1Brush" :widget="popup1Widget" :style="popup1Style" />
                    <Chart v-else-if="openIndex === 1" :width="mapScale.width" :height="mapScale.height" :padding="0" :axis="popup2Axis" :brush="popup2Brush" :style="popup2Style" />
                    <Chart v-else-if="openIndex === 2" :width="mapScale.width" :height="mapScale.height" :padding="{ top: 0, bottom: 0 }" :axis="popup3Axis" :brush="popup3Brush" :style="popup3Style" />
                </div>
            </div>
        </Transition>
        </Teleport>
    </div>
</template>

<style scoped>
.apmmarket {
    position: relative;
    background-image: v-bind("`url(${img('bg_2.jpg')})`");
    background-size: cover;
    background-attachment: fixed;
    font-family: "noto sans", sans-serif;
    font-weight: 400;
    color: #8a8683;
    background-color: #2b3340;
    min-height: 900px;
    overflow: hidden;
}
#logo {
    padding: 40px 0 0 40px;
    cursor: pointer;
}
#logo img {
    max-width: 160px;
}
#header {
    float: right;
    color: #fff;
    text-align: right;
    margin: -45px 30px 0 0;
    line-height: 8px;
}
#header .link {
    color: #fff;
    cursor: pointer;
    font-size: 0.8em;
    font-weight: 700;
}
#header p {
    font-size: 0.7em;
    color: rgba(255, 255, 255, 0.5);
    font-weight: lighter;
}
.text {
    color: #fff;
    padding: 53px 0 0 0;
}
.text h1 {
    font-size: 3em;
    letter-spacing: -2px;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 700;
}
.text h2 {
    font-size: 1.125em;
    color: #fff;
    font-weight: lighter;
}
.item {
    margin: 20px 20px 60px 20px;
    position: relative;
}
.item > .summary {
    position: relative;
    width: 800px;
    height: 320px;
    margin: 0 auto;
}
.summary-box {
    position: absolute;
    box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.22);
    width: 240px;
    height: 320px;
    border-radius: 5px;
    display: inline-block;
    margin: 20px 18px;
}
.summary-normal {
    background-color: #fff;
    color: #666;
    border-radius: 5px;
    height: 100%;
    box-sizing: border-box;
}
.summary-normal .imagesfield {
    height: 180px;
}
.summary-normal .imagesfield img {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    opacity: 0.9;
    height: 180px;
    width: 100%;
    object-fit: cover;
}
.summary-normal .title {
    font-weight: 700;
    font-size: 1.2em;
    padding: 15px 20px 0 20px;
    color: #333;
    text-align: left;
}
.summary-normal .content {
    font-size: 0.75em;
    padding: 6px 20px;
    text-align: left;
    color: #a2a2a2;
}
.summary-hover {
    color: #fff;
    border-radius: 5px;
    height: 100%;
    box-sizing: border-box;
}
.summary-hover .info {
    font-size: 0.7em;
    padding: 30px 20px 0 20px;
    text-align: center;
    font-weight: 700;
}
.summary-hover .title {
    font-weight: 700;
    font-size: 1.5em;
    padding: 25px 20px 0 20px;
    text-align: center;
}
.summary-hover .content {
    font-size: 0.75em;
    padding: 18px 20px;
    text-align: center;
    line-height: 1.45em;
    color: rgba(255, 255, 255, 0.7);
}
#footer {
    margin: 0 auto;
    font-size: 13px;
    text-align: center;
    padding: 20px 20px;
    color: #fff;
    box-sizing: border-box;
    background-color: rgba(27, 33, 41, 0.8);
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 100;
}
.social-icon {
    background-image: v-bind("`url(${img('social.png')})`");
    background-repeat: no-repeat;
    width: 23px;
    height: 23px;
    display: inline-block;
    cursor: pointer;
    vertical-align: middle;
    margin-left: 15px;
}
.social-icon.facebook {
    background-position: 0 0;
}
.social-icon.twitter {
    background-position: -45px 0;
}
.social-icon.googleplus {
    background-position: -85px 0;
}
.social-icon.linkedin {
    background-position: -120px 0;
}
.btn {
    display: inline-block;
    padding: 6px 20px;
    font-size: 11px;
    letter-spacing: 2px;
    text-align: center;
    white-space: nowrap;
    cursor: pointer;
    border: 1px solid transparent;
    border-radius: 20px;
    text-decoration: none;
}
.btn-default {
    color: #fff;
    background-color: transparent;
    border-color: #fff;
    transition: 0.3s;
}
.btn-default:hover {
    color: #8a8683;
    background-color: #fff;
    border-color: #fff;
}
.popupcontent {
    position: fixed;
    /* Higher than the legacy's own 101 - that value assumed the demo was the WHOLE page (its own
       standalone site), with nothing else to be above. Embedded inside this site's own shell,
       above the persistent nav header's OWN z-index:10000 (confirmed via computed style) to
       guarantee true full-screen coverage. */
    z-index: 10001;
    border-radius: 5px;
    inset: 0;
    overflow: auto;
}
.popup-grow-enter-active,
.popup-grow-leave-active {
    transition: opacity 0.4s ease-in;
}
.popup-grow-enter-from,
.popup-grow-leave-to {
    opacity: 0;
}
.close {
    background-image: v-bind("`url(${img('img_close.png')})`");
    background-repeat: no-repeat;
    width: 39px;
    height: 39px;
    right: 0;
    position: absolute;
    cursor: pointer;
    margin: 15px;
    opacity: 0.3;
    transition: 0.3s;
    z-index: 1;
}
.close:hover {
    opacity: 1;
}
.slide {
    color: #fff;
    padding: 20px 0 0 0;
}
.slide.dark {
    color: #666;
}
.slide .text {
    padding: 54px 0 0 0;
    color: inherit;
}
.slide h1 {
    font-size: 2.2em;
    letter-spacing: -1px;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 700;
    padding: 0 40px;
}
.slide.dark h1 {
    color: rgba(0, 0, 0, 0.7);
}
.slide h2 {
    font-size: 1em;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 200;
    line-height: 1.45em;
    padding: 0 40px;
}
.slide.dark h2 {
    color: rgba(0, 0, 0, 0.5);
}
.slide h3 {
    font-size: 0.95em;
    letter-spacing: 2px;
    color: rgba(255, 255, 255, 0.8);
    font-weight: normal;
}
.slide.dark h3 {
    color: rgba(0, 0, 0, 0.5);
}
.chart-wrap {
    margin: 20px auto 60px auto;
    display: flex;
    justify-content: center;
}
</style>
