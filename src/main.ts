import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { store } from "@/stores/index";

import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";

const app = createApp(App);

app.use(store).mount("#app");
