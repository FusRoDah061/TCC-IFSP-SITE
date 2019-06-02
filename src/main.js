import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Toast from "./components/Toast/Toast";
import Spinner from "./components/Spinner/Spinner";

Vue.component('toast', Toast);
Vue.component('spinner', Spinner);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
