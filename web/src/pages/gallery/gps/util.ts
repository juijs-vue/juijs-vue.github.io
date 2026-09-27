// Port of gallery/gps/util.js's data-generation helpers (the demo's own fake real-time data - no
// actual GPS/weather API, same as the original) + setRadarClip (a one-time DOM setup applying a
// circular clip-path to the radar map). moment.js (3687 lines, only ever used here for one
// "LL"-format date string) was NOT ported/vendored - replaced with the equivalent native
// Intl.DateTimeFormat call in GPS.vue itself, same visible output without the legacy dependency.

export function getRandomValue(start: number, limit: number): number {
    return Math.floor(Math.random() * limit) + start
}

export function getTimeToIndex(): number {
    return new Date().getHours() * 6
}

export function getRadarDomain(): number[] {
    const domain: number[] = []
    for (let i = 0; i < 360; i += 30) domain.push(i)
    return domain
}

export function getCompassData() {
    const d = Math.floor(Math.random() * 360)
    let dStr = "NE"
    if (d > 270) dStr = "SE"
    else if (d > 180) dStr = "SW"
    else if (d > 90) dStr = "NW"

    return {
        type: "compass",
        degree: d,
        title: `10.${Math.floor(Math.random() * 9)}`,
        topText: `${d}° ${dStr}`,
        supText: "mph",
        bottomText: `WIND GUST 10.${Math.floor(Math.random() * 9)}mph`
    }
}

export function getWindData() {
    const values = [3, 2, 4, 1, 18, 10, 12, 9, 10, 9, 3, 5, 4, 3, 16, 10, 12, 11, 8, 9, 3, 2, 4, 3, 4]
    const data: { second: number; speed: number }[] = []
    for (let i = 0; i <= 25; i++) data.push({ second: i, speed: values[i] })
    return data
}

export function getTPSData() {
    const data: { tps: number }[] = []
    for (let i = 0; i < 144; i++) {
        const randoms = [
            getRandomValue(10, 25), getRandomValue(10, 20), getRandomValue(10, 15),
            getRandomValue(10, 15), getRandomValue(10, 10), getRandomValue(10, 10),
            getRandomValue(10, 10), getRandomValue(20, 20), getRandomValue(30, 30),
            getRandomValue(40, 30), getRandomValue(50, 35), getRandomValue(60, 40),
            getRandomValue(45, 35), getRandomValue(40, 35), getRandomValue(35, 40),
            getRandomValue(35, 45), getRandomValue(45, 40), getRandomValue(40, 35),
            getRandomValue(40, 35), getRandomValue(35, 30), getRandomValue(30, 30),
            getRandomValue(25, 20), getRandomValue(20, 20), getRandomValue(15, 20)
        ]
        data.push({ tps: randoms[Math.floor(i / 6)] })
    }
    return data
}

export function getKNOTDataForFlight() {
    const data: { KNOT: number }[] = []
    const t = 0.3
    const v = 8
    let acc = 0
    let dis = 0
    for (let i = 0; i < 300; i++) {
        acc += 5 * t
        dis += (v + acc) * t
        data.push({ KNOT: dis })
    }
    return data
}

export function getFTDataForFlight() {
    const data: { FT: number }[] = []
    const t = 0.1
    const v = 4
    let acc = 0
    let dis = 20
    for (let i = 0; i < 300; i++) {
        acc += 5 * t
        dis += (v + acc) * t
        data.push({ FT: dis > 350 ? 350 : dis })
    }
    return data
}

// `chart` here is whatever <Chart>'s getBuilder() returns - untyped (matches the legacy's own
// untyped jui.chart.builder instance passed into this same function).
export function setRadarClip(chart: any): void {
    const clipPath = chart.svg.clipPath({ id: "map-clip" })
    const area = chart.axis(0).area()
    const size = Math.min(area.width, area.height)

    const clipCircle = chart.svg.circle({ cx: area.width / 2, cy: area.height / 2, r: size / 2, fill: "black" })
    clipPath.append(clipCircle)

    chart.appendDefs(clipPath)
    chart.axis(0).map.root.attr({ "clip-path": "url(#map-clip)" })
}
