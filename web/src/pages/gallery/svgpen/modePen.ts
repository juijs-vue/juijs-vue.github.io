// @ts-nocheck
// Port of legacy gallery/svgpen/widget/drawing.mode.pen.js - freehand drawing: mousedown starts a
// new <path>, every mousemove appends another point (rebuilding the whole `d` string from
// scratch each time - simple, not incremental, matches the original exactly), mouseup finalizes.
import { DrawingModeBase } from "./drawingCore"

export class ModePen extends DrawingModeBase {
    private canvas: any
    private currentPen: { x: number; y: number }[] = []
    private currentPath: any = null
    private events: any = null

    constructor(canvas: any) {
        super()
        this.canvas = canvas
    }

    init(): void {}

    initMode(): void {
        if (this.disabled) {
            if (this.events) this.canvas.offMouseEvent(this.events)
        } else {
            this.events = this.canvas.setMouseEvent(
                (e: MouseEvent) => this.dragStart(e),
                (e: MouseEvent) => this.drag(e),
                (e: MouseEvent) => this.dragEnd(e),
            )
        }
    }

    private drag(e: MouseEvent): void {
        this.currentPen.push(this.canvas.pos(e))
        this.drawCurrentPen()
    }

    private dragStart(e: MouseEvent): void {
        this.currentPen = [this.canvas.pos(e)]

        this.currentPath = this.canvas.svg
            .path({ className: "item", fill: "transparent", stroke: "black", "stroke-width": 3, "stroke-linejoin": "round" })
            .css({ "pointer-events": "visibleStroke" })
        this.canvas.appendToCanvas(this.currentPath)
    }

    private dragEnd(e: MouseEvent): void {
        this.currentPen.push(this.canvas.pos(e))
        this.drawCurrentPen()
        this.drawEnd()
    }

    private drawCurrentPen(): void {
        for (let i = 0; i < this.currentPen.length; i++) {
            const pen = this.currentPen[i]
            if (i === 0) this.currentPath.MoveTo(pen.x, pen.y)
            else this.currentPath.LineTo(pen.x, pen.y)
        }
        this.currentPath.join()
    }

    private drawEnd(): void {
        this.currentPath = null
        this.currentPen = []
    }
}
