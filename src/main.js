import { createApp } from "vue";
import { clerkPlugin } from "vue-clerk/plugin";
// or for headless mode:
// import { clerkPlugin } from 'vue-clerk/headless'

import router from "./router";
import "./css/index.css";
import App from "./App.vue";

createApp(App)
  .use(router)
  .use(clerkPlugin, {
    publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  })
  .mount("#app");
