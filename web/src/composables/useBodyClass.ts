import { onMounted, onBeforeUnmount } from "vue"

// Sets <body class="..."> for as long as the calling page is mounted, then
// restores whatever was there before. The shell uses plain "jui" (matches
// doc/*.html) but play/ui's pages default to the "jennifer" theme (matches
// loader.html's initial changeTheme("jennifer") call) - jui-ui-vue's
// .jui.jennifer-scoped theme rules (heading colors, the boxed table/"well"
// background typography.html's demos rely on, etc.) don't apply without it.
export function useBodyClass(className: string) {
    let previous = ""
    onMounted(() => {
        previous = document.body.className
        document.body.className = className
    })
    onBeforeUnmount(() => {
        document.body.className = previous
    })
}
