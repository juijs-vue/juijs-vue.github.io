/// <reference types="vite/client" />

// jui-ui-vue/jui-grid-vue ship no .d.ts (their dist/ only has the UMD/ES JS +
// CSS) - loose ambient declarations so imports type-check. Component types
// are `any`-shaped on purpose (matches how loosely play/ui's demos use them).
declare module "jui-ui-vue" {
    import type { Plugin } from "vue"
    export const Dropdown: any
    export const Tooltip: any
    export const Tab: any
    export const Window: any
    export const Colorpicker: any
    export const Notify: any
    const plugin: Plugin
    export default plugin
}

declare module "jui-grid-vue" {
    import type { Plugin } from "vue"
    export const DataGrid: any
    export const VirtualGrid: any
    export const ColumnMenu: any
    export function rowsToCsv(...args: any[]): string
    export function downloadCsv(...args: any[]): void
    // play/chart's Style tab (PlayChart.vue) types its theme/color grid rows
    // against these - loose shapes matching jui-grid-vue's real src/types.ts
    // (not re-declared in full; this ambient module only needs to satisfy
    // vue-tsc, not replace the real package's own typings).
    export interface GridColumn {
        key: string
        label?: string
        width?: number
        sortable?: boolean
        resizable?: boolean
        editable?: boolean
        align?: "left" | "center" | "right"
        visible?: boolean
        children?: GridColumn[]
    }
    export interface GridRow<T = Record<string, any>> {
        id: string | number
        data: T
        children?: GridRow<T>[]
    }
    const plugin: Plugin
    export default plugin
}
