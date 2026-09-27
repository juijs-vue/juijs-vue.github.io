// @ts-nocheck
// Data-generator helpers ported 1:1 from legacy gallery/realtime/data.js. Only the
// self-contained random-data-generation functions live here - the 3 setInterval loops that call
// them stay in RealTime.vue itself (they're glue tightly coupled to each <Chart>'s own
// getBuilder()/axis()/updateBrush() calls, not reusable data logic).
import { timeUtil } from "jui-chart-vue"

export function randomValue(start: number, limit: number): number {
    return Math.floor(Math.random() * limit) + start
}

export function pastTimeInterval(min: number): [Date, Date] {
    return [new Date(Date.now() - timeUtil.MINUTE * min), new Date()]
}

export function getTimeToIndex(): number {
    const now = new Date()
    return now.getHours() * 60 + now.getMinutes()
}

export function getDataForActiveService() {
    const data = []
    for (let i = 1; i <= 5; i++) {
        data.push({
            server: "W" + i,
            normal: randomValue(0, 20),
            warning: randomValue(0, 10),
            fatal: randomValue(0, 5)
        })
    }
    return data
}

export function getDataForResponseTime(count: number) {
    const data = []
    for (let i = 0; i < count; i++) {
        data.push({
            w1: randomValue(4000, 1000),
            w2: randomValue(3000, 1500),
            w3: randomValue(6000, 500),
            w4: randomValue(2000, 750),
            w5: randomValue(7000, 250)
        })
    }
    return data
}

export function getDataForTPS(count: number) {
    const data = []
    for (let i = 0; i < count; i++) {
        data.push({
            w1: randomValue(50, 5),
            w2: randomValue(70, 5),
            w3: randomValue(60, 5),
            w4: randomValue(50, 5),
            w5: randomValue(30, 5)
        })
    }
    return data
}

export function getDataForToday(count: number) {
    const data = []
    for (let i = 0; i < count; i++) {
        data.push({
            tps: randomValue(50, 5),
            user: randomValue(1000, 100)
        })
    }
    return data
}

export function getDataForHours() {
    const data = []
    const now = new Date()
    for (let i = 0; i < 24; i++) {
        data.push({
            hours: i,
            callcount: randomValue(10000, 2000),
            visitor: randomValue(5000, 1000),
            today: i <= now.getHours()
        })
    }
    return data
}

export function getDataForWorldMap() {
    const keys = ["KR", "CN", "US", "FR", "BR", "AU", "JP", "IN", "RU", "GB"]
    const data = []
    for (let i = 0; i < keys.length; i++) {
        let value = randomValue(1000, 5000)
        if (keys[i] === "KR") value = randomValue(5000, 1000)
        else if (keys[i] === "CN" || keys[i] === "RU") value = randomValue(3000, 2000)
        else if (keys[i] === "JP" || keys[i] === "IN") value = randomValue(2000, 3000)
        data.push({ id: keys[i], value })
    }
    return data
}

export function getDataForVisitor() {
    const desktopRate = randomValue(50, 50)
    const visits = randomValue(10000, 5000)
    return [
        { title: "OVERALL VISITS", value: visits, max: 15000, min: 0 },
        { title: "MOBILE RATE", value: 100 - desktopRate, max: 100, min: 0 },
        { title: "DESKTOP RATE", value: desktopRate, max: 100, min: 0 }
    ]
}

// --- Transaction view data (canvas.scatter "delay" points) --------------------------------------
// The legacy version keeps `txData` as a bare module-level global, mutated in place by
// `initTransactionData`/`addTransactionData`. Wrapped in a factory here instead of a second
// module-level array, since a Vue page component (unlike a one-shot static HTML demo) can in
// principle mount/unmount more than once per page load.
export interface TxDataPoint {
    delay: number
    level: "normal" | "warning" | "fatal"
    time: Date
}

function randomLevel(): TxDataPoint["level"] {
    const type = Math.floor(Math.random() * 6)
    if (type > 2 && type < 5) return "warning"
    if (type > 4) return "fatal"
    return "normal"
}

export function createTxDataStore() {
    let txData: TxDataPoint[] = []

    return {
        get data() {
            return txData
        },
        init(domain: [Date, Date]) {
            const tenMinutes = 1000 * 60 * 10
            for (let i = 0; i < tenMinutes; i++) {
                const seq = Math.floor(Math.random() * 500)
                if (seq !== 0) continue
                txData.push({
                    delay: Math.floor(Math.random() * 10000),
                    level: randomLevel(),
                    time: new Date(domain[0].getTime() + i)
                })
            }
        },
        add(domain: [Date, Date]) {
            const count = Math.floor(Math.random() * 10)
            while (txData.length > 0 && txData[0].time.getTime() < domain[0].getTime()) {
                txData.shift()
            }
            for (let i = 0; i < count; i++) {
                txData.push({
                    delay: Math.floor(Math.random() * 10000),
                    level: randomLevel(),
                    time: domain[1]
                })
            }
        }
    }
}
