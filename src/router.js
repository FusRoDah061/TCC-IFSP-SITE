import Vue from "vue";
import Router from "vue-router";
import Login from "./views/Login.vue";
import Cadastro from "./views/Cadastro.vue";
import Recuperar from "./views/Recuperar.vue";
import Senha from "./views/Senha.vue";
import Home from "./views/Home.vue";

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
    },
    {
      path: "/recuperar",
      name: "recuperar",
      component: Recuperar
    },
    {
      path: "/senha/:pedido",
      name: "senha",
      component: Senha
    },
    {
      path: "/home",
      name: "home",
      component: Home
    }
  ]
});
