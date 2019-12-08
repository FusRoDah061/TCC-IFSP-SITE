import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Spinner from "./components/Spinner/Spinner";
import Header from "./components/Header/Header";
import Simbolo from "./components/Simbolo/Simbolo";
import SimbolosBoard from "./components/SimbolosBoard/SimbolosBoard";

Vue.component("spinner", Spinner);
Vue.component("cabecalho", Header);
Vue.component("simbolo", Simbolo);
Vue.component("simbolos-board", SimbolosBoard);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
