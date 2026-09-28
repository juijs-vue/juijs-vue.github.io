// @ts-nocheck
// Query helpers ported 1:1 from legacy gallery/stockinfo/util.js. Each function takes the full
// `data` array explicitly (the legacy version reads it off a module-level global instead) plus a
// `start`/`end` ROW-INDEX range - these indices come straight from either a bubble-chart year
// click (getYearIndexes) or a zoomscroll drag (jui-chart-vue's own `zoomscroll.dragend` event,
// which already emits [start, end] as row indices into the axis's own backing array).
import { timeUtil } from "jui-chart-vue"

export interface StockRow {
    date: Date
    open: number
    close: number
    volume: number
    total: number
    avg: number
    quarter: number
    day: number
}

export function getPerformanceData(data: StockRow[], start: number, end: number) {
    const cache: Record<number, Record<string, number>> = {}

    for (let i = start; i <= end; i++) {
        const v = data[i]
        const y = v.date.getFullYear()
        let p = cache[y]

        if (!p) {
            p = { year: y, count: 0, absGain: 0, fluctuation: 0, sumIndex: 0, avgIndex: 0, percentageGain: 0, fluctuationPercentage: 0 }
        }

        p.count += 1
        p.absGain += v.close - v.open
        p.fluctuation += Math.abs(v.close - v.open)
        p.sumIndex += (v.open + v.close) / 2
        p.avgIndex = p.sumIndex / p.count
        p.percentageGain = p.avgIndex ? (p.absGain / p.avgIndex) * 100 : 0
        p.fluctuationPercentage = p.avgIndex ? (p.fluctuation / p.avgIndex) * 100 : 0

        cache[y] = p
    }

    return Object.values(cache)
}

export function getLossAndGainData(data: StockRow[], start: number, end: number) {
    const result = [{ loss: 0, gain: 0 }]

    for (let i = start; i <= end; i++) {
        if (data[i].open > data[i].close) result[0].loss += 1
        else result[0].gain += 1
    }

    result[0].loss = Math.round((result[0].loss / (end - start)) * 100)
    result[0].gain = Math.round((result[0].gain / (end - start)) * 100)

    return result
}

export function getQuarterData(data: StockRow[], start: number, end: number) {
    const result: Record<number, number>[] = [{ 1: 0, 2: 0, 3: 0, 4: 0 }]
    for (let i = start; i <= end; i++) result[0][data[i].quarter] += 1
    return result
}

export function getDayOfWeekData(data: StockRow[], start: number, end: number) {
    const keys = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const result = keys.map((dayStr, day) => ({ day, dayStr, value: 0 }))

    for (let i = start; i <= end; i++) result[data[i].day].value += 1

    result.shift()
    result.pop()

    return result
}

export function getFluctuationData(data: StockRow[], start: number, end: number) {
    const cache: Record<number, number> = {}

    for (let i = start; i <= end; i++) {
        const per = Math.round(((data[i].close - data[i].open) / data[i].open) * 100)
        cache[per] = (cache[per] ?? 0) + 1
    }

    return Object.keys(cache).map((key) => ({ percent: parseInt(key, 10), count: cache[Number(key)] }))
}

export function getDailyTableData(data: StockRow[], start: number, end: number) {
    const result = []
    for (let i = start; i <= end; i++) {
        const d = data[i]
        result.push({ ...d, date: timeUtil.format(d.date, "yyyy-MM-dd"), change: (d.close - d.open).toFixed(2) })
    }
    return result
}

export function getYearIndexes(data: StockRow[], year: number) {
    let start: number | null = null
    let end: number | null = null

    for (let i = 0; i < data.length; i++) {
        if (data[i].date.getFullYear() === year) {
            if (start === null) start = i
        } else if (start !== null && end === null) {
            end = i
        }
    }

    return { start, end: end ?? data.length - 1 }
}
