// @ts-nocheck
// Port of legacy gallery/svgpen/widget/drawing.render.canvas.js - draws the white, drop-shadowed
// "page" rectangle behind the drawing area (purely decorative background, centered within the
// widget's own area).
import { DrawingModeBase } from "./drawingCore"

export class RenderCanvas extends DrawingModeBase {
    private canvas: any
    private rect: any = null

    constructor(canvas: any) {
        super()
        this.canvas = canvas
    }

    private initFilter(): void {
        const filter = this.canvas.svg.filter({ id: "drop-shadow", height: "130%" })

        filter.append(
            this.canvas.svg.feGaussianBlur({ in: "SourceAlpha", stdDeviation: 5, result: "blur" }),
        )
        filter.append(this.canvas.svg.feOffset({ in: "blur", dx: 5, dy: 5, result: "offsetBlur" }))

        const feMerge = this.canvas.svg.feMerge()
        filter.append(feMerge)
        feMerge.append(this.canvas.svg.feMergeNode({ in: "offsetBlur" }))
        feMerge.append(this.canvas.svg.feMergeNode({ in: "SourceGraphic" }))

        this.canvas.chart.appendDefs(filter)
    }

    init(): void {
        this.initFilter()

        this.rect = this.canvas.svg
            .rect({ fill: "white", filter: "url(#drop-shadow)", "pointer-events": "inherit" })
            .css({ cursor: "pointer" })

        this.canvas.appendToGroup(this.rect)
        this.initSize()
    }

    setSize(width: number, height: number): void {
        this.canvas.setCanvasSize(width, height)
        this.initSize()
    }

    initSize(): void {
        const size = this.canvas.getCanvasSize()
        const width = this.canvas.chart.area("width")
        const height = this.canvas.chart.area("height")

        this.rect.attr({
            x: width / 2 - size.width / 2,
            y: height / 2 - size.height / 2,
            width: size.width,
            height: size.height
        })
    }
}
