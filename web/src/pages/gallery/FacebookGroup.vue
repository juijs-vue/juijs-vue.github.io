<script setup lang="ts">
// @ts-nocheck
// Native Vue3 port of gallery/facebookgroup (legacy jQuery + jui.chart/jui.grid/jui.ui demo,
// still at gallery/facebookgroup/index.html on `main`). Ported 1:1 in behavior: same topology
// network (click to inspect a group, double-click to drill into its own sub-network, "Flush" to
// reset), same year/month/day statistics combo chart, same hour-of-day overview, same post/comment
// proportion pies, same status table. gallery/facebookgroup/data/*.json is untouched and fetched
// at runtime exactly like the legacy version's synchronous $.ajax did (just async here) - there are
// too many per-group/per-method files (344) to bundle them all via import.meta.glob.
import { ref, computed, onMounted } from "vue"
import { Chart } from "jui-chart-vue"

const base = import.meta.env.BASE_URL
const dataUrl = (name: string) => `${base}gallery/facebookgroup/data/${name}.json`
// The legacy demo used the old jQuery-jui-chart engine's "jennifer" icon/theme, which jui-chart-vue
// hasn't ported (only classic/dark/gradient/pastel themes and the classic icon set are registered
// - see register/theme/ and register/icon/). Using an unregistered icon type throws mid-render
// (JUI_CRITICAL_ERR) and corrupts every other node's rect/circle attributes drawn after it, so this
// uses "classic" (Chart.vue's own default icon font) instead of a custom path.

const ATTRIBUTES = ["id", "name", "updated_time", "users", "post_count", "comment_count", "owner", "privacy", "description"]
const METHOD_ITEMS = [
    { value: "year", text: "year" },
    { value: "month", text: "month" },
    { value: "day", text: "day" }
]

async function fetchJson(name: string) {
    const res = await fetch(dataUrl(name))
    return res.json()
}

function ceil(num: number) {
    const places = num < 100 ? 1 : 2
    const multiplier = 10 ** places
    return Math.ceil(num / multiplier) * multiplier
}

function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1)
}

// --- Data loaded once at mount ---------------------------------------------
const groups = ref<Record<string, any>>({})
const fullNode = ref<any[]>([])
const fullEdge = ref<any[]>([])

// --- Network (the topology graph currently shown - full or drilled-into) ---
const graphNode = ref<any[]>([])
const graphEdge = ref<any[]>([])
const activeKey = ref("")

// --- Selected group's detail panels -----------------------------------------
const method = ref<"year" | "month" | "day">("month")
const statisticsData = ref<any>(null)
const hourStatistics = ref<any[]>([])
const proportionData = ref<any>(null)

async function loadDetail(key: string) {
    activeKey.value = key

    const [stats, hour, prop] = await Promise.all([
        fetchJson(`${method.value}_${key}`),
        fetchJson(`hour_total_${key}`),
        fetchJson(`proportion_${key}`)
    ])

    statisticsData.value = stats
    hourStatistics.value = hour.statistics.map(({ date, ...rest }: any) => rest)
    proportionData.value = prop
}

function selectMethod(item: { value: string }) {
    method.value = item.value as typeof method.value
    if (activeKey.value) loadDetail(activeKey.value)
}

function pickDefaultNode(node: any[]) {
    let best = node[0]
    for (const item of node) {
        if (item.outgoing.length > best.outgoing.length) best = item
    }
    return best
}

function flush() {
    graphNode.value = fullNode.value
    graphEdge.value = fullEdge.value
    loadDetail(pickDefaultNode(fullNode.value).key)
}

function drillInto(data: { key: string }) {
    const target = fullNode.value.find((n) => n.key === data.key)
    if (!target) return

    const newNode = [{ ...target }]
    for (const n of fullNode.value) {
        if (target.outgoing.includes(n.key)) {
            newNode.push({ ...n, outgoing: [target.key] })
        }
    }
    const newEdge = fullEdge.value.filter((e) => e.key.includes(target.key))

    graphNode.value = newNode
    graphEdge.value = newEdge
    loadDetail(target.key)
}

onMounted(async () => {
    const [g, n, e] = await Promise.all([fetchJson("group"), fetchJson("node"), fetchJson("edge")])
    groups.value = g
    fullNode.value = n
    fullEdge.value = e
    graphNode.value = n
    graphEdge.value = e
    await loadDetail(pickDefaultNode(n).key)
})

// --- Network chart ------------------------------------------------------
const networkAxis = computed(() => ({
    c: { type: "topologytable", sort: "random" },
    data: graphNode.value
}))
const networkBrush = computed(() => ({
    type: "topologynode",
    colors: ["black"],
    edgeData: graphEdge.value,
    nodeText: (data: any) => (data.outgoing.length > 10 ? "{preview}" : ""),
    nodeTitle: (data: any) => data.name,
    nodeScale: (data: any) => {
        const len = data.outgoing.length
        if (len > 50) return 1.75
        if (len > 30) return 1.5
        if (len > 10) return 1
        return 0.5
    },
    edgeOpacity: (data: any) => data.value,
    activeNode: activeKey.value
}))
const networkWidget = { type: "topologyctrl" }
const networkEvent = {
    "topology.nodeclick": (data: any) => loadDetail(data.key),
    "dblclick": (data: any) => drillInto(data.data)
}

// --- Statistics chart (year/month/day) -----------------------------------
const statisticsAxis = computed(() => {
    if (!statisticsData.value) return []
    const postMax = ceil(statisticsData.value.post_max_cnt)
    const commentMax = ceil(statisticsData.value.comment_max_cnt)

    return [{
        data: statisticsData.value.statistics,
        x: {
            type: "block",
            domain: "date",
            textRotate: -30,
            format: (d: string, i: number) => {
                if (method.value === "day") return i % 60 === 0 ? d : ""
                if (method.value === "month") return i % 2 === 0 ? d : ""
                return d
            }
        },
        y: { type: "range", domain: [0, postMax * 1.2], step: 4, line: true },
        area: { width: "100%", height: "100%" }
    }, {
        x: { hide: true },
        y: { domain: [0, commentMax * 1.2], orient: "right" },
        area: { width: "100%", height: "100%" },
        extend: 0
    }]
})
const statisticsBrush = computed(() => {
    const scatterSize = method.value === "day" ? 0 : method.value === "year" ? 12 : 7
    return [
        { type: "column", target: "posts", axis: 0, colors: [0], animate: true },
        { type: "line", target: "comments", axis: 1, colors: [2], animate: true },
        { type: "scatter", target: "comments", size: scatterSize, axis: 1, colors: [2] }
    ]
})
const statisticsWidget = computed(() => [
    { type: "title", text: `${capitalize(method.value)} Statistics`, align: "start", dy: 5 },
    { type: "title", text: "Counts", align: "start", orient: "center", dx: -45, dy: -10 },
    { type: "tooltip", format: (_k: string, v: unknown) => v, brush: [0, 2, 3, 4] },
    { type: "zoom", axis: 0 }
])
const statisticsStyle = { scatterBorderWidth: 1.5, titleFontSize: 11, titleFontWeight: "bold" }
const statisticsEvent = {
    "zoom.end"(start: number, end: number) {
        this.axis(1).zoom(start, end)
    },
    "zoom.close"() {
        this.axis(1).screen(1)
    }
}

// --- Time overview (hour of day) -----------------------------------------
const timeOverviewAxis = computed(() => ({
    x: {
        type: "fullblock",
        domain: ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"],
        line: true
    },
    y: {
        type: "range",
        domain: (d: any) => Math.max(d.posts, d.comments) * 1.2,
        format: (d: number) => `${Math.floor(d / 1000)}k`,
        step: 4
    },
    data: hourStatistics.value
}))
const timeOverviewBrush = { type: "line", display: "max", active: "posts", activeEvent: "click", clip: false }
const timeOverviewWidget = [
    { type: "legend" },
    { type: "cross", yFormat: (d: number) => `${Math.floor(d / 1000)}k` }
]

// --- Proportion pies -------------------------------------------------------
const postProportionAxis = computed(() => ({ data: [proportionData.value?.posts ?? {}] }))
const commentProportionAxis = computed(() => ({ data: [proportionData.value?.comments ?? {}] }))
const proportionBrush = { type: "pie", showText: true, activeEvent: "click" }
const proportionStyle = { titleFontWeight: "bold", titleFontSize: 11 }
function proportionWidget(title: string) {
    return [
        { type: "title", text: `${title} Proprotion`, dy: -10 },
        { type: "tooltip", orient: "left" },
        { type: "legend" }
    ]
}

// --- Status table -----------------------------------------------------------
const statusColumns = [
    { key: "attribute", label: "Attribute", width: "30%" },
    { key: "value", label: "Value" }
]
const statusRows = computed(() => {
    const data = groups.value[activeKey.value]
    if (!data) return []
    return ATTRIBUTES.map((attribute) => ({ id: attribute, data: { attribute, value: data[attribute] } }))
})

// --- Method dropdown ---------------------------------------------------------
const methodOpen = ref(false)
const methodDropdown = ref<InstanceType<typeof import("jui-ui-vue").Dropdown> | null>(null)
const methodBtnEl = ref<HTMLElement | null>(null)

function onMethodButtonClick() {
    if (!methodBtnEl.value) return
    const rect = methodBtnEl.value.getBoundingClientRect()
    methodDropdown.value?.show(rect.left + window.scrollX, rect.top + window.scrollY + rect.height)
}
</script>

<template>
    <div class="row">
        <div class="panel">
            <div class="head">
                <strong>Network</strong>
                <div style="float: right">
                    <a class="btn small" @click="flush">Flush</a>
                </div>
            </div>
            <div class="body" style="text-align: center">
                <Chart
                    v-if="graphNode.length"
                    :height="768"
                    theme="classic"
                    :padding="5"
                    :axis="networkAxis"
                    :brush="networkBrush"
                    :widget="networkWidget"
                    :event="networkEvent"
                />
                <p><i class="icon-caution3"></i> You can use double click!</p>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="panel">
            <div class="head">
                <strong>Statistics</strong>
                <div style="float: right">
                    <a ref="methodBtnEl" class="btn small" @click.prevent.stop="onMethodButtonClick">
                        Method <i class="icon-arrow1"></i>
                    </a>
                    <Dropdown ref="methodDropdown" v-model="methodOpen" :items="METHOD_ITEMS" :width="120" anchor @change="selectMethod" />
                </div>
            </div>
            <div class="body">
                <Chart
                    v-if="statisticsData"
                    :padding="{ left: 60 }"
                    :height="300"
                    :axis="statisticsAxis"
                    :brush="statisticsBrush"
                    :widget="statisticsWidget"
                    :style="statisticsStyle"
                    :event="statisticsEvent"
                />
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col left">
            <div class="panel">
                <div class="head"><strong>Status</strong></div>
                <div class="body" style="height: 300px">
                    <DataGrid :columns="statusColumns" :rows="statusRows">
                        <template #empty>Data does not exist.</template>
                    </DataGrid>
                </div>
            </div>
        </div>
        <div class="right">
            <div class="row">
                <div class="panel">
                    <div class="head"><strong>Time Overview</strong></div>
                    <div class="body" style="height: 300px">
                        <Chart
                            v-if="hourStatistics.length"
                            :height="290"
                            :padding="{ top: 25, right: 25 }"
                            :axis="timeOverviewAxis"
                            :brush="timeOverviewBrush"
                            :widget="timeOverviewWidget"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="panel">
            <div class="head"><strong>Proportion</strong></div>
            <div class="body">
                <div align="center">
                    <div class="col col-6">
                        <Chart
                            v-if="proportionData"
                            :padding="{ bottom: 70 }"
                            :height="350"
                            :axis="postProportionAxis"
                            :brush="proportionBrush"
                            :widget="proportionWidget('Post')"
                            :style="proportionStyle"
                        />
                    </div>
                    <div class="col col-6">
                        <Chart
                            v-if="proportionData"
                            :padding="{ bottom: 70 }"
                            :height="350"
                            :axis="commentProportionAxis"
                            :brush="proportionBrush"
                            :widget="proportionWidget('Comment')"
                            :style="proportionStyle"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.left {
    width: 550px !important;
}
.right {
    left: 2%;
    width: auto;
    overflow: hidden;
    padding-left: 10px;
}
.right > .row:first-child {
    margin-bottom: 7px;
}
</style>
