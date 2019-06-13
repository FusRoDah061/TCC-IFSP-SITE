import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Toast from "./components/Toast/Toast";
import Spinner from "./components/Spinner/Spinner";
import Header from "./components/Header/Header";
import Pranchas from "./components/Pranchas/Pranchas";
import Categorias from "./components/Categorias/Categorias";

Vue.component("toast", Toast);
Vue.component("spinner", Spinner);
Vue.component("cabecalho", Header);
Vue.component("pranchas", Pranchas);
Vue.component("categorias", Categorias);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
