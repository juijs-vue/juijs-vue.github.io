// @ts-nocheck
// Port of gallery/gps/widget/radar.js ("chart.widget.radar", extend: "chart.widget.core") - a
// demo-specific widget (not part of jui-chart-vue's own shared registry, per explicit decision:
// this exact rotating-sweep visual is specific to this one gallery demo, not a broadly reusable
// chart primitive). Registered directly against jui-graph-ts's real registry, exactly like
// jui-chart-vue's own register/widget/*.ts files do, just living here instead.
//
// The legacy widget's own sweep animation is a setInterval that's NEVER cleared except by the
// NEXT draw() call (`clearInterval(window.timer)` - a literal global). jui-graph-ts's own
// `Core.destroy()` is an intentional no-op (preserved from the original engine), so there's no
// framework hook that would ever stop this timer on unmount - GPS.vue's own onBeforeUnmount calls
// `stopRadarSweep()` explicitly instead, exactly filling the gap `window.timer` filled by being
// globally reachable at all (module-scoped here instead of on `window`).
import { CoreWidget, registerWidget, mathUtil } from "jui-graph-ts"

let activeTimer: ReturnType<typeof setInterval> | null = null
export function stopRadarSweep(): void {
    if (activeTimer) {
        clearInterval(activeTimer)
        activeTimer = null
    }
}

export class RadarWidget extends CoreWidget {
    private g: any
    private guide: any
    private line: any
    private linear: any
    private circle3: any
    private angle = 0

    drawBefore = (): void => {
        this.g = this.svg.g({ class: "radar" })
        this.guide = this.svg.g({ class: "radar-guide" })
        this.g.append(this.guide)

        this.linear = this.svg.linearGradient({ id: "grad1", x1: "0%", y1: "0%", x2: "100%", y2: "0%" })
        this.linear.append(this.svg.stop({ offset: "0%", "stop-color": "rgba(255, 255, 255, 0.5)", "stop-opacity": 1 }))
        this.linear.append(this.svg.stop({ offset: "100%", "stop-color": "rgba(255, 255, 255, 0.01)", "stop-opacity": 1 }))

        this.line = this.svg.path({ "stroke-width": 0, stroke: "#fff", fill: "url(#grad1)" })
        this.guide.append(this.line)

        const circle = this.svg.circle({ fill: "#fff", "fill-opacity": 0.7, stroke: "#fff", cx: 0, cy: 0, r: 10 })
        this.guide.append(circle)

        const circle2 = this.svg.circle({ fill: "#fff", cx: 0, cy: 0, r: 4 })
        this.guide.append(circle2)

        this.circle3 = this.svg.circle({ stroke: "rgba(255, 255, 255, 0.5)", "stroke-width": 2, fill: "transparent", cx: 0, cy: 0 })
        this.g.append(this.circle3)
    }

    updateGuide = (): void => {
        this.guide.rotate(this.angle)
    }

    updateTail = (): void => {
        const w = this.axis.area("width")
        const h = this.axis.area("height")
        const r = Math.min(w, h) / 2

        this.line.MoveTo(0, 0)
        this.line.lineTo(0, r)
        const obj = mathUtil.rotate(0, r, mathUtil.radian(30))
        this.line.Arc(r, r, 0, 0, 1, obj.x, obj.y)
        this.line.join()
    }

    draw = (): any => {
        const w = this.axis.area("width")
        const h = this.axis.area("height")
        const r = Math.min(w, h) / 2

        ;(this.chart as unknown as { appendDefs(elem: unknown): void }).appendDefs(this.linear)

        const startPosX = w / 2 + this.chart.padding("left")
        const startPosY = h / 2 + this.chart.padding("top")
        this.guide.translate(startPosX, startPosY)

        this.updateTail()

        this.circle3.attr({ r, cx: startPosX, cy: startPosY })

        stopRadarSweep()
        activeTimer = setInterval(() => {
            this.angle += 0.7
            if (this.angle >= 360) this.angle = 0
            this.updateGuide()
        }, 1000 / 60)

        return this.g
    }
}

registerWidget("radar", RadarWidget)
