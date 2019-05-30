import Vue from "vue";
import Router from "vue-router";
import Login from "./views/Login.vue";
import Cadastro from "./views/Cadastro.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "login",
      component: Login
    },
    {
      path: "/cadastrar",
      name: "cadastrar",
      component: Cadastro
    }
  ]
});
