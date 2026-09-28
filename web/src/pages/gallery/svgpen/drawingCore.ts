// @ts-nocheck
// Port of legacy gallery/svgpen/widget/drawing.core.js - a small mixin every "mode"/"render" class
// (ModePointer/ModePen/ModeMove/RenderCanvas/RenderRule) extended via jui's own module `extend:`
// chain. Real TS inheritance here instead (matches this whole project's own established
// convention for translating a jui.define(..., "someBase") extend chain).
export class DrawingModeBase {
    disabled = true

    // Overridden by each concrete mode - resets to/from its initial state when the mode is
    // enabled/disabled (wires or tears down its own mouse events).
    initMode(): void {}

    append(parent: any, child: any): void {
        parent.append(child)
        parent.element.appendChild(child.element)
    }

    remove(child: any): void {
        child.remove()
        child.element.parentNode.removeChild(child.element)
    }

    setDisabled(value: boolean): void {
        this.disabled = value
        this.initMode()
    }

    getDisabled(): boolean {
        return !!this.disabled
    }
}
