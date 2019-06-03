import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Toast from "./components/Toast/Toast";
import Spinner from "./components/Spinner/Spinner";
import Header from "./components/Header/Header";

Vue.component('toast', Toast);
Vue.component('spinner', Spinner);
Vue.component('cabecalho', Header);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
