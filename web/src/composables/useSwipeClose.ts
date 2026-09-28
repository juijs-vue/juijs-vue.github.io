import { onBeforeUnmount, onMounted, type Ref } from "vue"

// Ported from res/event.js's ontouch() - trimmed to just the one behavior this
// site actually uses it for (swipe right closes the mobile menu drawer), not
// the full generic 4-direction/callback API of the original utility.
export function useSwipeClose(target: Ref<HTMLElement | null>, onSwipeRight: () => void) {
    const threshold = 150
    const restraint = 100
    const allowedTime = 500

    let startX = 0
    let startY = 0
    let startTime = 0

    function onTouchStart(e: TouchEvent) {
        const t = e.changedTouches[0]
        startX = t.pageX
        startY = t.pageY
        startTime = Date.now()
    }

    function onTouchEnd(e: TouchEvent) {
        const t = e.changedTouches[0]
        const distX = t.pageX - startX
        const distY = t.pageY - startY
        const elapsed = Date.now() - startTime

        if (elapsed <= allowedTime && distX >= threshold && Math.abs(distY) <= restraint) {
            onSwipeRight()
        }
    }

    onMounted(() => {
        target.value?.addEventListener("touchstart", onTouchStart)
        target.value?.addEventListener("touchend", onTouchEnd)
    })
    onBeforeUnmount(() => {
        target.value?.removeEventListener("touchstart", onTouchStart)
        target.value?.removeEventListener("touchend", onTouchEnd)
    })
}
