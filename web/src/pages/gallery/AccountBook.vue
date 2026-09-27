<script setup lang="ts">
// @ts-nocheck
// Native Vue3 port of gallery/accountbook (legacy jQuery + jui.chart/jui.grid/jui.ui demo, still
// at gallery/accountbook/index.html on `main`). Ported 1:1 in behavior: an editable Expense grid
// (with a column chart summarizing totals by type), an editable Income grid, and a "Summary"
// calendar tab showing a daily expense/income badge per day (click a day to open a modal with
// that day's full breakdown) - using <Chart>/<DataGrid>/<Tab>/<Datepicker>/<Slider>/<Dropdown>/
// <Window>/<Notify> instead of the legacy jQuery+jui stack.
//
// The legacy demo pre-allocates a fixed number of blank rows (`addDefaultData`) - editing one of
// those blanks (double-click, same as any other row) IS how you add a new entry. There's no
// separate "add row" button, ported faithfully.
import { computed, reactive, ref } from "vue"
import { Chart } from "jui-chart-vue"

const COMMON_MONTH = 3
const EXPENSE_TYPES = ["Food", "Mobile", "Provision", "Clothing", "Culture", "Education", "Car", "Event", "Tax", "ETC"]
const INCOME_TYPES = ["Salary", "Bonus"]

function blankRow() {
    return { date: "", memo: "", cash: 0, card: 0, type: "" }
}

const expenseData = reactive([
    { date: "2016/03/04", memo: "Mcdonald - lunch", cash: 0, card: 8900, type: 0 },
    { date: "2016/03/04", memo: "7 eleven - buy snack", cash: 0, card: 6250, type: 0 },
    { date: "2016/03/07", memo: "7 eleven - buy snack", cash: 5360, card: 0, type: 0 },
    { date: "2016/03/07", memo: "Homeplus - month's purchase food", cash: 0, card: 50530, type: 0 },
    { date: "2016/03/07", memo: "Holly Beer - old boy network", cash: 0, card: 47500, type: 0 },
    { date: "2016/03/19", memo: "Coupang - buy jeans", cash: 0, card: 33340, type: 3 },
    { date: "2016/03/19", memo: "Coupang - buy SD card adapter", cash: 0, card: 10500, type: 5 },
    { date: "2016/03/19", memo: "CGV - Movies", cash: 0, card: 18000, type: 4 },
    { date: "2016/03/22", memo: "GS Caltex - transportation", cash: 50000, card: 0, type: 6 },
    { date: "2016/03/24", memo: "KT - mobile phone charges", cash: 79000, card: 0, type: 1 },
    ...Array.from({ length: 40 }, blankRow)
])
const incomeData = reactive([
    { date: "2016/03/24", memo: "Apple Corporation - salary", cash: 10000000, card: 0, type: 0 },
    ...Array.from({ length: 49 }, blankRow)
])

// --- Header: month slider + period display ------------------------------------------------
const month = ref(COMMON_MONTH)
const periodStart = computed(() => {
    const now = new Date()
    const start = new Date(now.getFullYear(), month.value - 1, 1)
    return start
})
const periodEnd = computed(() => new Date(periodStart.value.getFullYear(), periodStart.value.getMonth() + 1, 0))
function fmtDate(d: Date) {
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`
}

// --- Notify (toast) -------------------------------------------------------------------------
const notifyRef = ref<InstanceType<typeof import("jui-ui-vue").Notify> | null>(null)
function onMonthChange() {
    notifyRef.value?.add({ type: "danger", message: "Monthly data filtering does not work." })
}
function onHelpClick() {
    notifyRef.value?.add({ type: "warning", message: "Toolbar buttons are not working." })
}

// --- Totals + chart (reactive to grid edits) ----------------------------------------------
const expenseTotal = computed(() => expenseData.reduce((sum, d) => ({ cash: sum.cash + d.cash, card: sum.card + d.card }), { cash: 0, card: 0 }))
const incomeTotal = computed(() => incomeData.reduce((sum, d) => ({ cash: sum.cash + d.cash, card: sum.card + d.card }), { cash: 0, card: 0 }))

const expenseChartData = computed(() => {
    const byType: Record<number, { cash: number; card: number }> = {}
    for (const d of expenseData) {
        if (d.date === "") continue
        const t = d.type as number
        if (!byType[t]) byType[t] = { cash: 0, card: 0 }
        byType[t].cash += d.cash
        byType[t].card += d.card
    }
    return EXPENSE_TYPES.map((_, i) => byType[i] ?? { cash: 0, card: 0 })
})
const expenseChartAxis = computed(() => [{
    x: { type: "block", domain: EXPENSE_TYPES },
    y: {
        type: "range",
        domain: (d: Record<string, number>) => Math.max(d.card, d.cash) * 1.2,
        format: (d: number) => `${Math.floor(d / 1000)}K`,
        step: 3,
        line: "solid"
    },
    data: expenseChartData.value
}])
const expenseChartBrush = { type: "column", target: ["cash", "card"], outerPadding: 25, minSize: 5, colors: [8, 9] }
const expenseChartWidget = [{ type: "tooltip" }]
const expenseChartStyle = { gridXAxisBorderWidth: 1, gridYAxisBorderWidth: 0, gridTickBorderSize: 0, gridTickPadding: 7 }

// --- Editable grids ---------------------------------------------------------------------------
const expenseColumns = [
    { key: "date", label: "Date", width: 190, editable: true },
    { key: "memo", label: "Memo", editable: true },
    { key: "cash", label: "Cash", editable: true, align: "right" as const },
    { key: "card", label: "Card", editable: true, align: "right" as const },
    { key: "type", label: "Type", width: 190, editable: true }
]
const expenseRows = computed(() => expenseData.map((d, i) => ({ id: i, data: d })))
const incomeRows = computed(() => incomeData.map((d, i) => ({ id: i, data: d })))

const expenseGridRef = ref()
const incomeGridRef = ref()

// Matches the legacy grid.table's own `editend` contract exactly (confirmed by reading
// grid.min.js directly): the handler can reject an incomplete row and the grid keeps editing
// open instead of closing (jui-grid-vue's DataGrid.vue was extended with an `editValidate` prop
// for this - see its own comment). `data` is the still-uncommitted draft, safe to coerce in place
// since DataGrid only merges it into the real row after a `true` return.
function validateRow(_row: { id: number; data: Record<string, unknown> }, data: Record<string, unknown>) {
    if (data.date === "" || data.memo === "" || isNaN(Number(data.cash)) || isNaN(Number(data.card)) || data.type === "") {
        alert("Please enter the correct value.")
        return false
    }
    data.cash = Number(data.cash)
    data.card = Number(data.card)
    return true
}

function deleteChecked(table: "expense" | "income") {
    const gridRef = table === "expense" ? expenseGridRef : incomeGridRef
    const data = table === "expense" ? expenseData : incomeData
    const ids: number[] = gridRef.value?.listChecked() ?? []
    for (const id of ids) Object.assign(data[id], blankRow())
    gridRef.value?.uncheckAll()
}

function typeLabel(table: "expense" | "income", type: number | "") {
    if (type === "") return ""
    const names = table === "expense" ? EXPENSE_TYPES : INCOME_TYPES
    return names[type as number] ?? ""
}

// --- Shared floating datepicker/dropdown for date/type edit cells ------------------------------
// The readonly edit-cell <input>s intentionally do NOT commit on their own blur: focus is
// EXPECTED to move away to the floating Datepicker/Dropdown below (an external, differently-
// positioned element), and DataGrid.vue's commitEdit unconditionally finalizes+exits edit mode -
// committing on that blur would close the row before the picker's own selection ever lands in
// `draft`. Instead, the picked `commit` callback (captured from the slot at open-time, since it's
// specific to whichever row is currently being edited) runs explicitly once a real value is
// chosen, exactly when the legacy jQuery version's own datepicker/dropdown `select`/`change`
// handlers wrote the new value into the DOM input.
const datepickerOpen = ref(false)
const datepickerPos = ref({ left: 0, top: 0 })
const datepickerTarget = ref<Record<string, unknown> | null>(null)
let datepickerCommit: (() => void) | null = null

const dropdownRef = ref()
const dropdownOpen = ref(false)
const dropdownTarget = ref<Record<string, unknown> | null>(null)
const dropdownItems = ref<{ value: number; text: string }[]>([])
let dropdownCommit: (() => void) | null = null

function openDatepicker(e: FocusEvent, draft: Record<string, unknown>, commit: () => void) {
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    datepickerPos.value = { left: rect.left + window.scrollX, top: rect.top + window.scrollY }
    datepickerTarget.value = draft
    datepickerCommit = commit
    datepickerOpen.value = true
}
function onDatepickerSelect(formatted: string) {
    if (datepickerTarget.value) datepickerTarget.value.date = formatted
    datepickerOpen.value = false
    datepickerCommit?.()
}
function openDropdown(e: FocusEvent, draft: Record<string, unknown>, table: "expense" | "income", commit: () => void) {
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    dropdownItems.value = (table === "expense" ? EXPENSE_TYPES : INCOME_TYPES).map((text, value) => ({ value, text }))
    dropdownTarget.value = draft
    dropdownCommit = commit
    dropdownRef.value?.show(rect.left + window.scrollX, rect.top + window.scrollY + rect.height)
}
function onDropdownChange(data: { value: number }) {
    if (dropdownTarget.value) dropdownTarget.value.type = data.value
    dropdownCommit?.()
}

// --- Tabs -----------------------------------------------------------------------------------
const activeTab = ref(0)
const tabItems = [
    { text: "Expense", value: 0 },
    { text: "Income", value: 1 },
    { text: "Calender", value: 2 }
]

// --- Summary calendar + modal -----------------------------------------------------------------
// Datepicker owns its OWN internal viewYear/viewMonth (navigable independently via its prev/next
// arrows) and doesn't expose them as reactive state - so daySummary/dayKey track a local copy,
// kept in sync via @prev/@next (mirroring Datepicker.vue's own wraparound logic), rather than
// assuming the calendar always shows whatever month the header slider is currently on.
const calendarYear = ref(periodStart.value.getFullYear())
const calendarMonth = ref(periodStart.value.getMonth() + 1)
function onCalendarPrev() {
    if (calendarMonth.value === 1) {
        calendarYear.value -= 1
        calendarMonth.value = 12
    } else {
        calendarMonth.value -= 1
    }
}
function onCalendarNext() {
    if (calendarMonth.value === 12) {
        calendarYear.value += 1
        calendarMonth.value = 1
    } else {
        calendarMonth.value += 1
    }
}
function dayKey(no: number) {
    const mm = String(calendarMonth.value).padStart(2, "0")
    const dd = String(no).padStart(2, "0")
    return `${calendarYear.value}/${mm}/${dd}`
}
function daySummary(no: number) {
    const key = dayKey(no)
    const exp = expenseData.filter((d) => d.date === key)
    const inc = incomeData.filter((d) => d.date === key)
    if (exp.length === 0 && inc.length === 0) return null
    return {
        expense: { count: exp.length, total: exp.reduce((s, d) => s + d.cash + d.card, 0), list: exp },
        income: { count: inc.length, total: inc.reduce((s, d) => s + d.cash + d.card, 0), list: inc }
    }
}

const summaryOpen = ref(false)
const summaryTab = ref(0)
const summaryExpenseRows = ref<{ id: number; data: Record<string, unknown> }[]>([])
const summaryIncomeRows = ref<{ id: number; data: Record<string, unknown> }[]>([])
const summaryColumns = [
    { key: "date", label: "Date" },
    { key: "memo", label: "Memo", width: 240 },
    { key: "cash", label: "Cash", align: "right" as const },
    { key: "card", label: "Card", align: "right" as const },
    { key: "type", label: "Type" }
]

function onCalendarDayClick(no: number) {
    const summary = daySummary(no)
    if (!summary) return
    summaryExpenseRows.value = summary.expense.list.map((d, i) => ({ id: i, data: { ...d, type: typeLabel("expense", d.type as number) } }))
    summaryIncomeRows.value = summary.income.list.map((d, i) => ({ id: i, data: { ...d, type: typeLabel("income", d.type as number) } }))
    summaryTab.value = 0
    summaryOpen.value = true
}
</script>

<template>
    <div class="header">
        <div class="center">
            <div class="title"><span class="start-date">{{ fmtDate(periodStart) }}</span> - <span class="end-date">{{ fmtDate(periodEnd) }}</span></div>
            <div class="slider-wrap" style="width: 250px; display: inline-block; margin: 0 20px">
                <Slider type="single" v-model:from="month" :min="1" :max="12" :step="1" :tooltip="false" @change="onMonthChange" />
            </div>
            <div class="slider-scale">
                <span v-for="n in 12" :key="n">{{ n }}</span>
            </div>
        </div>

        <ul class="tab top" style="display: none"></ul>
        <Tab v-model="activeTab" :items="tabItems" variant="tab" position="top" />

        <div class="toolbar">
            <div class="group">
                <a class="btn mini"><i class="icon-table"></i></a>
                <a class="btn mini"><i class="icon-tool"></i></a>
                <a class="btn mini"><i class="icon-printer"></i></a>
            </div>
            <a class="btn mini" @click="onHelpClick">Help</a>
        </div>
    </div>

    <Notify ref="notifyRef" position="top-right" :timeout="2000" />

    <div class="contents">
        <div v-show="activeTab === 0">
            <Chart width="100%" :height="300" :padding="{ top: 25, right: 25, bottom: 25 }" :axis="expenseChartAxis" :brush="[expenseChartBrush]" :widget="expenseChartWidget" :style="expenseChartStyle" />

            <DataGrid
                ref="expenseGridRef"
                :columns="expenseColumns"
                :rows="expenseRows"
                editable
                checkable
                variant="simple"
                headline
                :scroll-height="220"
                :edit-validate="validateRow"
            >
                <template #edit-date="{ draft, commit }">
                    <input readonly class="edit" :value="draft.date" @focus="openDatepicker($event, draft, commit)" @click.stop />
                </template>
                <template #edit-type="{ draft, commit }">
                    <input readonly class="edit" :value="typeLabel('expense', draft.type)" @focus="openDropdown($event, draft, 'expense', commit)" @click.stop />
                </template>
                <template #cell-cash="{ value }">{{ value === 0 ? "" : value }}</template>
                <template #cell-card="{ value }">{{ value === 0 ? "" : value }}</template>
                <template #cell-type="{ value }">{{ typeLabel("expense", value) }}</template>
            </DataGrid>
            <table class="table simple small headline footer">
                <thead>
                    <tr>
                        <th width="28"><i class="icon-trashcan" title="Remove selected data" style="cursor: pointer" @click="deleteChecked('expense')"></i></th>
                        <th width="190"></th>
                        <th width="40%">Total</th>
                        <th>{{ expenseTotal.cash }}</th>
                        <th>{{ expenseTotal.card }}</th>
                        <th width="190"></th>
                    </tr>
                </thead>
            </table>
        </div>

        <div v-show="activeTab === 1">
            <DataGrid
                ref="incomeGridRef"
                :columns="expenseColumns"
                :rows="incomeRows"
                editable
                checkable
                variant="simple"
                headline
                :scroll-height="540"
                :edit-validate="validateRow"
            >
                <template #edit-date="{ draft, commit }">
                    <input readonly class="edit" :value="draft.date" @focus="openDatepicker($event, draft, commit)" @click.stop />
                </template>
                <template #edit-type="{ draft, commit }">
                    <input readonly class="edit" :value="typeLabel('income', draft.type)" @focus="openDropdown($event, draft, 'income', commit)" @click.stop />
                </template>
                <template #cell-cash="{ value }">{{ value === 0 ? "" : value }}</template>
                <template #cell-card="{ value }">{{ value === 0 ? "" : value }}</template>
                <template #cell-type="{ value }">{{ typeLabel("income", value) }}</template>
            </DataGrid>
            <table class="table simple small headline footer">
                <thead>
                    <tr>
                        <th width="28"><i class="icon-trashcan" title="Remove selected data" style="cursor: pointer" @click="deleteChecked('income')"></i></th>
                        <th width="190"></th>
                        <th width="40%">Total</th>
                        <th>{{ incomeTotal.cash }}</th>
                        <th>{{ incomeTotal.card }}</th>
                        <th width="190"></th>
                    </tr>
                </thead>
            </table>
        </div>

        <div v-show="activeTab === 2">
            <Datepicker variant="calendar" size="large" :model-value="periodStart" :move-year="false" style="height: 580px" @prev="onCalendarPrev" @next="onCalendarNext">
                <template #cell="{ type, no }">
                    <div>{{ no }}</div>
                    <div v-if="type !== 'none' && daySummary(no)" class="task" style="cursor: pointer" @click="onCalendarDayClick(no)">
                        <span v-if="daySummary(no).income.count > 0" style="background: #28a7db">
                            <i class="icon-plus"></i> ({{ daySummary(no).income.count }} calls)
                            <span class="num">{{ daySummary(no).income.total }}</span>
                        </span>
                        <span v-if="daySummary(no).expense.count > 0" style="background: #ff847c">
                            <i class="icon-minus"></i> ({{ daySummary(no).expense.count }} calls)
                            <span class="num">{{ daySummary(no).expense.total }}</span>
                        </span>
                    </div>
                </template>
            </Datepicker>
        </div>
    </div>

    <!-- Shared floating pickers for editable date/type cells -->
    <div v-if="datepickerOpen" class="floating-datepicker" :style="{ position: 'absolute', left: datepickerPos.left + 'px', top: datepickerPos.top + 'px', zIndex: 2000 }">
        <Datepicker format="yyyy/MM/dd" @select="onDatepickerSelect" />
    </div>
    <Dropdown ref="dropdownRef" v-model="dropdownOpen" :items="dropdownItems" :width="190" @change="onDropdownChange" />

    <Window v-model="summaryOpen" modal :width="600" :height="400" title="Summary">
        <Tab v-model="summaryTab" :items="[{ text: 'Expense', value: 0 }, { text: 'Income', value: 1 }]" variant="pill" style="margin-bottom: 10px">
            <template #panel-0>
                <DataGrid :columns="summaryColumns" :rows="summaryExpenseRows" variant="simple" headline>
                    <template #cell-cash="{ value }">{{ value === 0 ? "" : value }}</template>
                    <template #cell-card="{ value }">{{ value === 0 ? "" : value }}</template>
                </DataGrid>
            </template>
            <template #panel-1>
                <DataGrid :columns="summaryColumns" :rows="summaryIncomeRows" variant="simple" headline>
                    <template #cell-cash="{ value }">{{ value === 0 ? "" : value }}</template>
                    <template #cell-card="{ value }">{{ value === 0 ? "" : value }}</template>
                </DataGrid>
            </template>
        </Tab>
    </Window>
</template>

<style scoped>
.header {
    position: relative;
}
.header .center {
    text-align: center;
    padding: 10px 0;
}
.header .title {
    display: inline-block;
    font-weight: bold;
    margin-right: 20px;
}
.slider-scale {
    display: inline-flex;
    justify-content: space-between;
    width: 250px;
}
.toolbar {
    position: absolute;
    top: 10px;
    right: 0;
}
.floating-datepicker {
    background: #fff;
}
</style>
