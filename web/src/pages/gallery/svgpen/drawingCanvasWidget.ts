// @ts-nocheck
// Port of legacy gallery/svgpen/widget/drawing.canvas.js ("chart.widget.drawing.canvas") - the
// top-level orchestrator widget: owns the drawing area's background/ruler rendering, wires the
// shared mousedown/move/up plumbing every "mode" (pointer/pen/move) rides on top of, and switches
// between modes on a "drawing.canvas.change.mode" chart event (emitted by the toolbar buttons).
//
// Registered as a LOCAL widget (`registerWidget("drawing.canvas", ...)`), not contributed to
// jui-chart-vue's own shared registry - same precedent as gallery/gps's "radar"/"compass"
// widgets: this is a whole bespoke drawing-tool engine specific to this one demo, not a broadly
// reusable chart primitive.
//
// **Adaptation, not a legacy quirk**: the original's `pos(e)`/`getDistX()`/`getDistY()` used
// HARDCODED offsets (50, 30px) baked in from its own fixed, full-viewport page layout (menu bar
// 30px + left toolbar 50px, with nothing else above/beside the drawing area at all). Embedded
// inside this site's own shell (nav header, page heading, etc.), the drawing area's real screen
// position is different, so those constants would misalign every mouse coordinate. Replaced with
// the SVG root's own live `getBoundingClientRect()` - the same "mouse position relative to the
// drawing surface's own top-left corner" intent, generalized to work regardless of surrounding
// chrome (same category of fix as gps's Teleport-to-body/apmmarket's z-index work).
import { CoreWidget, registerWidget } from "jui-chart-vue"
import { ModeMove } from "./modeMove"
import { ModePen } from "./modePen"
import { ModePointer } from "./modePointer"
import { RenderCanvas } from "./renderCanvas"
import { RenderRule } from "./renderRule"

export class DrawingCanvasWidget extends CoreWidget {
    private group: any
    private pathArea: any
    private currentMode = "pointer"
    // Matches the legacy default exactly - genuinely disconnected from the toolbar's own static
    // "560"/"480" display text (SvgPen.vue's own template) - confirmed: `setCanvasSize()` is
    // never actually called anywhere in this whole demo, so that toolbar text was always just
    // decorative, never real state. Preserved as-is, not reconciled into one true value.
    private canvasWidth = 800
    private canvasHeight = 800

    private renderCanvas = new RenderCanvas(this)
    private renderRule = new RenderRule(this)
    private modeConfig: Record<string, any>

    constructor(...args: unknown[]) {
        super(...(args as []))
        this.modeConfig = {
            pointer: new ModePointer(this),
            move: new ModeMove(this),
            pen: new ModePen(this)
        }
    }

    getCanvasSize(): { width: number; height: number } {
        return { width: this.canvasWidth, height: this.canvasHeight }
    }

    setCanvasSize(w: number, h: number): void {
        this.canvasWidth = w
        this.canvasHeight = h
        this.renderCanvas.initSize()
        this.renderRule.initSize()
    }

    getDistX(): number {
        return (this.svg.root.element as SVGSVGElement).getBoundingClientRect().left
    }

    getDistY(): number {
        return (this.svg.root.element as SVGSVGElement).getBoundingClientRect().top
    }

    drawBefore = (): void => {
        this.group = this.svg.g()

        this.renderCanvas.init()
        this.renderRule.init()

        this.initPathArea()
        this.initEvent()
        this.initMode()
    }

    private initPathArea(): void {
        this.pathArea = this.svg.g({ className: "path-area" })
        this.group.append(this.pathArea)
    }

    appendToGroup(el: any): void {
        this.group.append(el)
    }

    private initEvent(): void {
        this.chart.on("drawing.canvas.change.mode", (mode: string) => this.setMode(mode))
    }

    private initMode(): void {
        for (const k in this.modeConfig) {
            this.modeConfig[k].init()
        }
        this.setMode("pointer")
    }

    setMode(mode: string): void {
        if (this.currentMode !== mode) {
            this.modeConfig[this.currentMode].setDisabled(true)
        }
        this.currentMode = mode
        this.modeConfig[this.currentMode].setDisabled(false)
    }

    getMode(mode: string): any {
        return this.modeConfig[mode] || {}
    }

    pos(e: MouseEvent): { x: number; y: number } {
        return { x: e.clientX - this.getDistX(), y: e.clientY - this.getDistY() }
    }

    appendToCanvas(elem: any): void {
        // Real, necessary difference from the legacy original's own `appendToCanvas` (a bare
        // `pathArea.element.appendChild(elem.element)`, no tracking at all): this port's own
        // `SVG.render()` unconditionally `clear()`s and rebuilds a group's DOM content FROM its
        // tracked `children[]` array on every render pass (see jui-graph-ts's svg.ts - a
        // deliberate, documented design, not a bug) - an element appended only via raw DOM
        // `appendChild()`, bypassing that tracking, is invisible to it and gets silently dropped
        // the next time anything triggers a render. `pathArea.append(elem)` registers it into
        // that tracked tree (so it survives); the raw `appendChild` alongside it is still needed
        // for it to appear immediately, without waiting on some later render pass - exactly the
        // same two-step `DrawingModeBase.append()` this whole demo's OTHER live-append call sites
        // (ModePointer's segment handles, ModeMove's guide rect) already use correctly.
        this.pathArea.append(elem)
        this.pathArea.element.appendChild(elem.element)
    }

    setMouseEvent(
        mousedown: (e: MouseEvent) => void,
        mousemove: (e: MouseEvent) => void,
        mouseup: (e: MouseEvent) => void,
    ): { mousedown: (e: MouseEvent) => void; mousemove: (e: MouseEvent) => void; mouseup: (e: MouseEvent) => void } {
        const de = (downEvent: MouseEvent) => {
            mousedown.call(this, downEvent)
            this.chart.on("chart.mousemove", me)
            this.chart.on("chart.mouseup", ue)
        }
        const me = (moveEvent: MouseEvent) => mousemove.call(this, moveEvent)
        const ue = (upEvent: MouseEvent) => {
            mouseup.call(this, upEvent)
            this.chart.off(me)
            this.chart.off(ue)
        }

        this.chart.on("chart.mousedown", de)

        return { mousedown: de, mousemove: me, mouseup: ue }
    }

    offMouseEvent(event: { mousedown: (e: MouseEvent) => void }): void {
        this.chart.off(event.mousedown)
    }

    draw = (): any => {
        return this.group
    }

    static setup(): Record<string, unknown> {
        return {}
    }
}

registerWidget("drawing.canvas", DrawingCanvasWidget)
