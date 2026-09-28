import { computed } from "vue"
import { useRoute } from "vue-router"

export type Lang = "en" | "ko"

// Language switching stays a full page reload (matching the original's
// changeLanguage()) rather than an in-SPA transition - res/chart.js (kept
// untouched per the port's scope) lazily initializes charts via a single
// `$(window).scroll` handler bound once when its <script> tag first runs, and
// a real reload is the only way to guarantee that rebinding happens cleanly
// on every visit to the chart page, exactly like today.
export function useLang() {
    const route = useRoute()
    const lang = computed<Lang>(() => {
        // An explicit `?lang=` always wins (this is also how a page reload after
        // clicking the language toggle keeps its chosen language across
        // in-site navigation - see AppNav.vue's `pageHref()`, which forwards the
        // current `lang` onto every link it renders).
        if (route.query.lang === "ko") return "ko"
        if (route.query.lang === "en") return "en"
        // No explicit choice yet: default to the visitor's own browser language
        // (Korean -> ko, anything else -> en, matching this site's only two
        // supported languages).
        return navigator.language.toLowerCase().startsWith("ko") ? "ko" : "en"
    })

    function changeLanguage(next: Lang) {
        const page = route.query.p
        const base = import.meta.env.BASE_URL
        location.href = page ? `${base}?lang=${next}&p=${page}` : `${base}?lang=${next}`
    }

    return { lang, changeLanguage }
}
