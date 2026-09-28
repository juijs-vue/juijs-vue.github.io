// @ts-nocheck
// Port of legacy gallery/svgpen/widget/drawing.render.rule.js - the horizontal/vertical ruler
// ticks (Photoshop/Illustrator-style) framing the drawing area, with a tick+label every 50px
// (`ruleBase`), spanning outward from center in both directions until off the visible chart area.
import { DrawingModeBase } from "./drawingCore"

export class RenderRule extends DrawingModeBase {
    private canvas: any
    private ruleBase = 50
    private ruleSize = 15
    private ruleSizeV = 30

    constructor(canvas: any) {
        super()
        this.canvas = canvas
    }

    init(): void {
        this.initRule()
    }

    initSize(): void {
        this.initRule()
    }

    private initRule(): void {
        this.initRuleH()
        this.initRuleV()
    }

    private initRuleH(): void {
        const ruleH = this.canvas.svg.g()
        const totalWidth = this.canvas.chart.area("width")
        const size = this.canvas.getCanvasSize()

        let start = this.canvas.chart.area("width") / 2 - size.width / 2
        let start2 = start

        ruleH.append(this.canvas.svg.line({ x1: this.ruleSizeV, y1: this.ruleSize, x2: totalWidth, y2: this.ruleSize, stroke: "#656565" }))

        let point = 0
        while (start < totalWidth) {
            ruleH.append(this.canvas.svg.line({ x1: start, y1: 0, x2: start, y2: this.ruleSize, stroke: "#656565" }))
            ruleH.append(this.canvas.chart.text({ x: start + 2, y: 9, fill: "#656565", "text-anchor": "start", "font-size": "11px" }, point))
            start += this.ruleBase
            point += this.ruleBase
        }

        let point2 = 0
        while (start2 > this.ruleSizeV + this.ruleBase) {
            start2 -= this.ruleBase
            point2 -= this.ruleBase
            ruleH.append(this.canvas.svg.line({ x1: start2, y1: 0, x2: start2, y2: this.ruleSize, stroke: "#656565" }))
            ruleH.append(this.canvas.chart.text({ x: start2 + 2, y: 9, fill: "#656565", "text-anchor": "start", "font-size": "11px" }, point2))
        }

        this.canvas.appendToGroup(ruleH)
    }

    private initRuleV(): void {
        const ruleV = this.canvas.svg.g()
        const totalHeight = this.canvas.chart.area("height")
        const size = this.canvas.getCanvasSize()

        let start = totalHeight / 2 - size.height / 2
        let start2 = start

        ruleV.append(this.canvas.svg.line({ x1: this.ruleSizeV, y1: this.ruleSize, x2: this.ruleSizeV, y2: totalHeight, stroke: "#656565" }))

        let point = 0
        while (start < totalHeight) {
            ruleV.append(this.canvas.svg.line({ x1: 0, y1: start, x2: this.ruleSizeV, y2: start, stroke: "#656565" }))
            ruleV.append(this.canvas.chart.text({ x: this.ruleSizeV - 2, y: start + 10, fill: "#656565", "text-anchor": "end", "font-size": "11px" }, point))
            start += this.ruleBase
            point += this.ruleBase
        }

        let point2 = 0
        start2 -= this.ruleBase
        point2 -= this.ruleBase

        while (start2 > this.ruleSize) {
            ruleV.append(this.canvas.svg.line({ x1: 0, y1: start2, x2: this.ruleSizeV, y2: start2, stroke: "#656565" }))
            ruleV.append(this.canvas.chart.text({ x: this.ruleSizeV - 2, y: start2 + 10, fill: "#656565", "text-anchor": "end", "font-size": "11px" }, point2))
            start2 -= this.ruleBase
            point2 -= this.ruleBase
        }

        this.canvas.appendToGroup(ruleV)
    }
}
