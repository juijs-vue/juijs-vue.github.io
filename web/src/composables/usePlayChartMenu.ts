import { computed } from "vue"
import menuJson from "../../../play/chart/menu.json"

export interface MenuItem {
    type: string
    title: string
    code: string
    hide?: boolean
}
export interface MenuGroup {
    type: string
    title: string
    list: MenuItem[]
}

// Port of usePlayUiMenu.ts for play/chart's own play/chart/menu.json (same
// group/list shape as play/ui's menu.json).
export function usePlayChartMenu(currentCode: () => string) {
    const groups = computed(() => {
        const rawGroups = menuJson.group as MenuGroup[]
        const flatList = menuJson.list as MenuItem[]

        const withItems = rawGroups.map((g) => ({
            ...g,
            list: flatList.filter((item) => item.type === g.type && !item.hide)
        }))

        const [first, ...rest] = withItems
        rest.sort((a, b) => a.title.localeCompare(b.title))
        return first ? [first, ...rest] : rest
    })

    const activeCode = computed(() => currentCode())
    const activeGroupType = computed(() => {
        for (const g of groups.value) {
            if (g.list.some((item) => item.code === activeCode.value)) return g.type
        }
        return groups.value[0]?.type
    })

    return { groups, activeCode, activeGroupType }
}
