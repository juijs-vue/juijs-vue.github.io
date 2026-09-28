import { computed } from "vue"
import menuJson from "../../../play/ui/menu.json"

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

// Port of app.py's load_menu() (itself a port of play/header.php + play/menu.php):
// group items by `type`, keep the first group ("Common Styles") first and sort
// the rest alphabetically by title, drop hidden items.
export function usePlayUiMenu(currentCode: () => string) {
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
