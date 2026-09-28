import { createApp } from "vue"
import App from "./App.vue"
import { router } from "./router"
import JuiUiVue from "jui-ui-vue"
import JuiGridVue from "jui-grid-vue"
import "jui-ui-vue/style.css"
import "jui-grid-vue/style.css"
import "./styles/index.css"
import "./styles/responsive.css"

const app = createApp(App)
app.use(router)
// play/ui demos use <Tooltip>, <DataGrid>, etc. without importing them -
// matches the old loader.html's `app.use(JuiUiVue); app.use(JuiGridVue)`
// (global registration), which every play/ui/json/*.js demo was written
// against.
app.use(JuiUiVue)
app.use(JuiGridVue)
app.mount("#app")
