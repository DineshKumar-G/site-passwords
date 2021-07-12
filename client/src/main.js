import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/router";
import store from "./store/store";
import { Quasar, Loading, Notify, Dialog } from "quasar";
import quasarUserOptions from "@/quasar-user-options.js";

createApp(App)
  .use(Quasar, {
    plugins: {
      Loading,
      Dialog,
      Notify,
    },
  })
  .use(quasarUserOptions)
  .use(store)
  .use(router)
  .mount("#app");
