// @ts-nocheck
// Port of gallery/gps/widget/compass.js ("chart.widget.compass", extend: "chart.widget.core") -
// a demo-specific widget (not part of jui-chart-vue's own shared registry, per explicit decision -
// see radarWidget.ts's own header comment for the same reasoning).
import { CoreWidget, registerWidget, mathUtil } from "jui-chart-vue"

export const COMPASS_WIDGET_DEFAULTS = {
    degree: 255,
    title: "10.2",
    topText: "255° WSW",
    supText: "mph",
    bottomText: "WIND GUST 10.4mph"
}

export class CompassWidget extends CoreWidget {
    private g: any
    private guide: any
    private line: any
    private line2: any
    private circle: any

    static setup(): Record<string, unknown> {
        return { ...COMPASS_WIDGET_DEFAULTS }
    }

    drawBefore = (): void => {
        this.g = this.svg.g({ class: "radar2" })
        this.guide = this.svg.g({ class: "radar-guide" })
        this.g.append(this.guide)

        const linear = this.svg.linearGradient({ id: "grad2", x1: "0%", y1: "100%", x2: "0%", y2: "0%" })
        linear.append(this.svg.stop({ offset: "0%", "stop-color": "rgba(255, 255, 255, 0.2)", "stop-opacity": 1 }))
        linear.append(this.svg.stop({ offset: "100%", "stop-color": "rgba(255, 255, 255, 0.01)", "stop-opacity": 1 }))
        ;(this.chart as unknown as { appendDefs(elem: unknown): void }).appendDefs(linear)

        this.line = this.svg.path({ "stroke-width": 0, stroke: "#fff", fill: "url(#grad2)" })
        this.guide.append(this.line)

        this.line2 = this.svg.path({ "stroke-width": 1, stroke: "#fff", "stroke-opacity": 0.5, fill: "transparent" })
        this.guide.append(this.line2)

        this.circle = this.svg.circle({ fill: "transparent", stroke: "#fff", "stroke-width": 12 })
        this.g.append(this.circle)
    }

    drawCircle = (): void => {
        const w = this.chart.area("width")
        const h = this.chart.area("height")
        const r = Math.min(w, h) / 2 - 40

        const len = 2 * Math.PI * r
        const unitLength = len / 8
        const lineCount = 6
        const firstLine = 3
        const secondLine = 1
        const emptyLength = (unitLength - (secondLine * (lineCount - 1) + firstLine)) / lineCount

        const arr = [firstLine, emptyLength]
        for (let i = 1; i < lineCount; i++) {
            arr.push(secondLine, emptyLength)
        }

        this.circle
            .attr({ r, cx: w / 2, cy: h / 2, "stroke-dasharray": arr.join(" ") })
            .rotate((-((firstLine + secondLine) / 2) / len) * 360, w / 2, h / 2)
    }

    drawRange = (): void => {
        const w = this.chart.area("width")
        const h = this.chart.area("height")
        const r = Math.min(w, h) / 2 - 50

        const startPosX = w / 2 + this.chart.padding("left")
        const startPosY = h / 2 + this.chart.padding("top")
        const widget = this.widget as Record<string, unknown>
        this.guide.translate(startPosX, startPosY).rotate(-(widget.degree as number) + 250)

        this.line.MoveTo(0, 0)
        this.line.lineTo(0, r)
        const obj = mathUtil.rotate(0, r, mathUtil.radian(40))
        this.line.Arc(r, r, 0, 0, 1, obj.x, obj.y)
        this.line.join()

        this.line2.MoveTo(0, 0)
        this.line2.moveTo(0, r)
        this.line2.Arc(r, r, 0, 0, 1, obj.x, obj.y)
        this.line2.join()
    }

    drawText = (): void => {
        const w = this.chart.area("width")
        const h = this.chart.area("height")
        const r = Math.min(w, h) / 2 - 40
        const centerX = w / 2
        const centerY = h / 2
        const left = centerX - r
        const right = centerX + r
        const top = centerY - r
        const bottom = centerY + r
        const dist = 25
        const widget = this.widget as Record<string, unknown>

        this.g.append(this.chart.text({ "font-size": "14px", fill: "#ffffff", x: centerX, y: top - dist - 5, "text-anchor": "middle", "alignment-baseline": "central" }, "N"))
        this.g.append(this.chart.text({ "font-size": "14px", fill: "#ffffff", x: centerX, y: bottom + dist + 5, "text-anchor": "middle", "alignment-baseline": "central" }, "S"))
        this.g.append(this.chart.text({ "font-size": "14px", fill: "#ffffff", x: right + dist, y: centerY, "text-anchor": "start", "alignment-baseline": "central" }, "E"))
        this.g.append(this.chart.text({ "font-size": "14px", fill: "#ffffff", x: left - dist, y: centerY, "text-anchor": "end", "alignment-baseline": "central" }, "W"))

        this.g.append(this.chart.text({ "font-size": "42px", fill: "#ffffff", x: centerX + 30, y: centerY, "text-anchor": "end", "alignment-baseline": "central" }, String(widget.title)))
        this.g.append(this.chart.text({ "font-size": "12px", fill: "#ffffff", x: centerX + 30, y: centerY - 15, "text-anchor": "start", "alignment-baseline": "central" }, String(widget.supText)))
        this.g.append(this.chart.text({ "font-size": "11px", fill: "#ffffff", x: centerX, y: centerY - 40, "text-anchor": "middle", "alignment-baseline": "central" }, String(widget.topText)))
        this.g.append(this.chart.text({ "font-size": "11px", fill: "#ffffff", x: centerX, y: centerY + 40, "text-anchor": "middle", "alignment-baseline": "central" }, String(widget.bottomText)))
    }

    drawArrow = (): void => {
        const w = this.chart.area("width")
        const h = this.chart.area("height")
        const r = Math.min(w, h) / 2 - 40
        const centerX = w / 2
        const centerY = h / 2
        const top = centerY - r

        const triangle = this.svg.path({ fill: "red" })
        const height = 8
        const width = 8

        triangle.MoveTo(centerX, top - 14).moveTo(0, -height / 2).lineTo(width / 2, height).lineTo(-width, 0).lineTo(width / 2, -height)
        triangle.join()

        this.g.append(triangle)
    }

    draw = (): any => {
        this.drawCircle()
        this.drawRange()
        this.drawText()
        this.drawArrow()
        return this.g
    }
}

registerWidget("compass", CompassWidget)
