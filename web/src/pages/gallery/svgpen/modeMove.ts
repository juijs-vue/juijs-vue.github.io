// @ts-nocheck
// Port of legacy gallery/svgpen/widget/drawing.mode.move.js - clicking a drawn item shows resize/
// move handles (8 small squares) around its bounding box.
//
// **PRESERVED GAP, not an omission**: the legacy `drag()` is a literal stub ("구현 해야함" -
// "needs to be implemented") - clicking shows the handles, but nothing ever actually moves/
// resizes the element (confirmed: `drag()`'s body is just a comment, and it's the only place that
// could have read `moveElement`/`moveDirection`/`moveStart` to do so). Ported faithfully as the
// same no-op - this is what the real, shipped demo actually does, not a bug this port introduces.
import { DrawingModeBase } from "./drawingCore"

export class ModeMove extends DrawingModeBase {
    private canvas: any
    private guidRect: any = null
    private readonly guidRectWidth = 8
    private readonly guidRectPoint = this.guidRectWidth / 2
    private events: any = null

    constructor(canvas: any) {
        super()
        this.canvas = canvas
    }

    init(): void {
        this.guidRect = this.canvas.svg.g({ className: "guid-rect" })
        this.canvas.appendToGroup(this.guidRect)
    }

    initMode(): void {
        if (this.disabled) {
            if (this.events) this.canvas.offMouseEvent(this.events)
            this.guidRect.element.innerHTML = ""
        } else {
            this.events = this.canvas.setMouseEvent(
                (e: MouseEvent) => this.dragStart(e),
                () => {
                    /* preserved gap - see header comment */
                },
                () => this.dragEnd(),
            )
        }
    }

    private dragStart(e: MouseEvent): void {
        this.clickElement(e.target as Element, e)
    }

    private clickElement(el: Element, _e: MouseEvent): void {
        const className = el.getAttribute("className")
        if (className === "item") {
            this.showMovePoint(el)
        }
    }

    private createGuidRect(obj: Record<string, unknown>): any {
        return this.canvas.svg.rect({
            width: this.guidRectWidth,
            height: this.guidRectWidth,
            fill: "#4F80FF",
            stroke: "rgba(0,0,0,0)",
            "stroke-width": 2,
            ...obj
        })
    }

    private getY(y: number): number {
        return y - this.guidRectPoint - this.canvas.getDistY()
    }

    private getX(x: number): number {
        return x - this.guidRectPoint - this.canvas.getDistX()
    }

    private showMovePoint(el: Element): void {
        const rect = el.getBoundingClientRect()

        const fullRect = this.canvas.svg.rect({
            className: "move-segment",
            x: rect.left - this.canvas.getDistX(),
            y: rect.top - this.canvas.getDistY(),
            width: rect.width,
            height: rect.height,
            fill: "transparent",
            stroke: "#4F80FF"
        })
        this.append(this.guidRect, fullRect)

        const leftTop = this.createGuidRect({ className: "move-segment-left-top", x: this.getX(rect.left), y: this.getY(rect.top) })
        const rightTop = this.createGuidRect({ className: "move-segment-right-top", x: this.getX(rect.right), y: this.getY(rect.top) })
        const leftBottom = this.createGuidRect({ className: "move-segment-left-bottom", x: this.getX(rect.left), y: this.getY(rect.bottom) })
        const rightBottom = this.createGuidRect({ className: "move-segment-right-bottom", x: this.getX(rect.right), y: this.getY(rect.bottom) })
        const left = this.createGuidRect({ className: "move-segment-left", x: this.getX(rect.left), y: this.getY(rect.top + rect.height / 2) })
        const right = this.createGuidRect({ className: "move-segment-right", x: this.getX(rect.right), y: this.getY(rect.top + rect.height / 2) })
        const top = this.createGuidRect({ className: "move-segment-top", x: this.getX(rect.left + rect.width / 2), y: this.getY(rect.top) })
        const bottom = this.createGuidRect({ className: "move-segment-bottom", x: this.getX(rect.left + rect.width / 2), y: this.getY(rect.bottom) })
        ;[leftTop, rightTop, leftBottom, rightBottom, left, right, top, bottom].forEach((h) => this.append(this.guidRect, h))
    }

    private dragEnd(): void {}
}
