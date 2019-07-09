import Vue from "vue";
import Router from "vue-router";
import Login from "./views/Login.vue";
import Cadastro from "./views/Cadastro.vue";
import Recuperar from "./views/Recuperar.vue";
import Senha from "./views/Senha.vue";
import Home from "./views/Home.vue";

Vue.use(Router);

function authGuard(to, from, next) {
  if (localStorage.usuario) {
    next();
  }
  else {
    next('/');
  }
}

function loginGuard(to, from, next) {
  if (localStorage.usuario) {
    next('/home');
  }
  else {
    next();
  }
}

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "login",
      beforeEnter: loginGuard,
      component: Login
    },
    {
      path: "/cadastrar",
      name: "cadastrar",
      beforeEnter: loginGuard,
      component: Cadastro
    },
    {
      path: "/recuperar",
      name: "recuperar",
      beforeEnter: loginGuard,
      component: Recuperar
    },
    {
      path: "/senha/:pedido",
      name: "senha",
      beforeEnter: loginGuard,
      component: Senha
    },
    {
      path: "/home",
      name: "home",
      beforeEnter: authGuard,
      component: Home
    },
    {
      path: "/:anything"
    }

    //prancha/:hid   visualizar
    //prancha/      criar
  ]
});
