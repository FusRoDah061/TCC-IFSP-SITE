import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Toast from "./components/Toast/Toast";

Vue.component('toast', Toast);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
