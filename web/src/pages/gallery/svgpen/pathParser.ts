// @ts-nocheck
// Port of legacy gallery/svgpen/util/PathParser.js's REACHABLE surface only. The original also
// defines translate()/scale()/rotate()/skewX()/skewY()/reflection*() matrix-transform methods
// (via its own `matrix` helper) - genuinely dead code, confirmed: nothing anywhere in this whole
// demo (drawing.mode.pointer.js/pen.js/move.js) ever calls any of them, only
// init/parse/trim/getSegments/setSegments/update/length/each are ever used. Not ported - and for
// good reason: the original `matrix` helper is itself broken (`multiply()` multiplies ALL 3
// homogeneous coordinates by the same `x` value instead of `x,y,1` respectively; `rotate()`'s
// matrix literal is missing a comma between its first two rows, a real syntax quirk that silently
// evaluates to `undefined` instead of throwing) - preserving unreachable, already-broken code
// would add nothing.
const PARSE_REG_FOR_PATH = /([mMlLvVhHcCsSqQtTaAzZ]([^mMlLvVhHcCsSqQtTaAzZ]*))/g
const SPLIT_REG = /[\b\t ,]/g

export interface PathSegment {
    command: string
    values?: string[]
}

export class PathParser {
    private pathElement: SVGPathElement | null = null
    private segments: (PathSegment | null)[] = []

    init(el: SVGPathElement): void {
        this.pathElement = el
        this.parse()
    }

    private trim(str: string): string[] {
        return str.split(SPLIT_REG).filter((s) => s !== "")
    }

    parse(): void {
        const pathString = this.pathElement!.getAttribute("d") || ""
        const arr = pathString.match(PARSE_REG_FOR_PATH) || []
        this.segments = []

        for (const s of arr) {
            const command = "mMlLvVhHcCsSqQtTaA".split("").find((c) => s.indexOf(c) > -1)
            if (command) {
                this.segments.push({ command, values: this.trim(s.replace(command, "")) })
            } else if (s.indexOf("Z") > -1 || s.indexOf("z") > -1) {
                this.segments.push({ command: "Z" })
            }
        }
    }

    length(): number {
        return this.segments.length
    }

    setSegments(index: number, seg: PathSegment | null): void {
        this.segments[index] = seg
    }

    getSegments(index?: number): PathSegment | (PathSegment | null)[] {
        if (index !== undefined) return this.segments[index] as PathSegment
        return this.segments
    }

    joinPath(): string {
        const arr: string[] = []
        for (const s of this.segments) {
            if (!s) continue
            if (s.command === "Z" || s.command === "z") arr.push(s.command)
            else arr.push([s.command, (s.values || []).join(" ")].join(" "))
        }
        return arr.join(" ")
    }

    update(): void {
        this.pathElement!.setAttribute("d", this.joinPath())
    }

    each(callback: (seg: PathSegment | null) => PathSegment | null): void {
        for (let i = 0; i < this.segments.length; i++) {
            this.segments[i] = callback(this.segments[i])
        }
    }
}
