// @ts-nocheck
// Port of legacy gallery/svgpen/widget/drawing.mode.pointer.js - clicking a drawn <path> parses
// its `d` attribute into segments (PathParser) and shows a draggable circle handle per
// vertex/control-point (red for M, blue for L, red/green/blue triangle for C's two control points
// + endpoint); dragging a handle live-edits that segment's coordinates and re-joins the path.
// Ctrl-click a handle deletes that point.
import { DrawingModeBase } from "./drawingCore"
import { PathParser } from "./pathParser"

export class ModePointer extends DrawingModeBase {
    private canvas: any
    private parser = new PathParser()
    private selectElement: SVGElement | null = null
    private seg: any = null
    private segPath: any = null
    private events: any = null

    constructor(canvas: any) {
        super()
        this.canvas = canvas
    }

    init(): void {
        this.segPath = this.canvas.svg.g({ className: "seg-path" })
        this.canvas.appendToGroup(this.segPath)

        this.seg = this.canvas.svg.g({ className: "seg" })
        this.canvas.appendToGroup(this.seg)
    }

    initMode(): void {
        if (this.disabled) {
            if (this.events) this.canvas.offMouseEvent(this.events)
            this.seg.element.innerHTML = ""
            this.segPath.element.innerHTML = ""
        } else {
            this.events = this.canvas.setMouseEvent(
                (e: MouseEvent) => this.dragStart(e),
                (e: MouseEvent) => this.drag(e),
                () => this.dragEnd(),
            )
        }
    }

    private drag(e: MouseEvent): void {
        if (!this.selectElement) return

        const pos = this.canvas.pos(e)
        const index = Number(this.selectElement.getAttribute("index"))
        const type = this.selectElement.getAttribute("type")
        const segment = this.parser.getSegments(index) as { command: string; values: string[] }

        if (type) {
            if (segment.command === "S") {
                if (type === "curve") {
                    segment.values[0] = String(pos.x)
                    segment.values[1] = String(pos.y)
                } else {
                    segment.values[2] = String(pos.x)
                    segment.values[3] = String(pos.y)
                }
            } else if (segment.command === "C") {
                if (type === "curve") {
                    segment.values[0] = String(pos.x)
                    segment.values[1] = String(pos.y)
                } else if (type === "curve-end") {
                    segment.values[2] = String(pos.x)
                    segment.values[3] = String(pos.y)
                } else {
                    segment.values[4] = String(pos.x)
                    segment.values[5] = String(pos.y)
                }
            }
            this.selectElement.setAttribute("cx", String(pos.x))
            this.selectElement.setAttribute("cy", String(pos.y))
        } else {
            segment.values[0] = String(pos.x)
            segment.values[1] = String(pos.y)
            this.selectElement.setAttribute("cx", String(pos.x))
            this.selectElement.setAttribute("cy", String(pos.y))
        }

        this.parser.update()
        this.showSegmentLine(this.parser.getSegments() as any[])
    }

    private dragStart(e: MouseEvent): void {
        this.parsingElement(e.target as SVGElement, e)
    }

    private dragEnd(): void {
        this.selectElement = null
    }

    private parsingElement(el: SVGElement, e: MouseEvent): void {
        if (el.getAttribute("className") === "segment") {
            if (e.ctrlKey) {
                // The index came off a DOM attribute (always a string) - `index + 1` in the
                // original legacy source STRING-CONCATENATES ("3"+1 -> "31") instead of adding,
                // which then reads a wildly out-of-bounds segment and throws on `.command`. A
                // real, reachable crash on totally ordinary use (ctrl-click any point), not a
                // deliberate quirk worth preserving - `Number(...)` here is the obvious fix.
                const index = Number(el.getAttribute("index"))
                const s = this.parser.getSegments(index) as { command: string }

                if (s.command === "M") {
                    const next = this.parser.getSegments(index + 1) as { command: string }
                    next.command = "M"
                    this.parser.setSegments(index + 1, next as any)
                }

                this.parser.setSegments(index, null)
                this.parser.update()
                el.parentNode!.removeChild(el)
            } else {
                this.selectElement = el
            }
        } else if (el.nodeName === "path") {
            this.parser.init(el as unknown as SVGPathElement)
            this.showSegment(this.parser.getSegments() as any[])
        } else {
            this.showSegment(null)
        }
    }

    private createSegment(o: Record<string, unknown>): any {
        return this.canvas.svg.circle({ className: "segment", fill: "white", "fill-opacity": 0.9, stroke: "blue", r: 5, ...o })
    }

    private clearGroup(group: any): void {
        group.children = []
        const clone = group.element.cloneNode(false)
        group.element.parentNode.replaceChild(clone, group.element)
        group.element = clone
    }

    private showSegmentLine(s: { command: string; values: string[] }[] | null): void {
        this.clearGroup(this.segPath)
        const list = s || []

        for (let i = 0; i < list.length; i++) {
            const segment = list[i]

            if (segment.command === "S") {
                const line = this.canvas.svg.path({ stroke: "blue", "stroke-dasharray": "5 5", "stroke-width": 1 })
                line.MoveTo(segment.values[0], segment.values[1])
                line.LineTo(segment.values[2], segment.values[3])
                line.join()
                this.append(this.segPath, line)
            } else if (segment.command === "C") {
                const line = this.canvas.svg.path({ stroke: "blue", "stroke-dasharray": "5 5", "stroke-width": 1 })
                line.MoveTo(segment.values[2], segment.values[3])
                line.LineTo(segment.values[4], segment.values[5])
                line.join()
                this.append(this.segPath, line)

                const line2 = this.canvas.svg.path({ stroke: "blue", "stroke-dasharray": "5 5", "stroke-width": 1 })
                const prev = list[i - 1]
                line2.MoveTo(prev.values[prev.values.length - 2], prev.values[prev.values.length - 1])
                line2.LineTo(segment.values[0], segment.values[1])
                line2.join()
                this.append(this.segPath, line2)
            }
        }
    }

    private showSegment(s: { command: string; values: string[] }[] | null): void {
        this.showSegmentLine(s)
        this.clearGroup(this.seg)

        const list = s || []
        for (let i = 0; i < list.length; i++) {
            const segment = list[i]

            if (segment.command === "M") {
                this.append(this.seg, this.createSegment({ index: i, stroke: "red", cx: segment.values[0], cy: segment.values[1] }))
            } else if (segment.command === "L") {
                this.append(this.seg, this.createSegment({ index: i, stroke: "blue", cx: segment.values[0], cy: segment.values[1] }))
            } else if (segment.command === "S") {
                this.append(this.seg, this.createSegment({ index: i, stroke: "red", type: "curve", cx: segment.values[0], cy: segment.values[1] }))
                this.append(this.seg, this.createSegment({ index: i, stroke: "blue", type: "pointer", cx: segment.values[2], cy: segment.values[3] }))
            } else if (segment.command === "C") {
                this.append(this.seg, this.createSegment({ index: i, stroke: "red", type: "curve", cx: segment.values[0], cy: segment.values[1] }))
                this.append(this.seg, this.createSegment({ index: i, stroke: "green", type: "curve-end", cx: segment.values[2], cy: segment.values[3] }))
                this.append(this.seg, this.createSegment({ index: i, stroke: "blue", type: "pointer", cx: segment.values[4], cy: segment.values[5] }))
            }
        }
    }
}
