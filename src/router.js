import Vue from "vue";
import Router from "vue-router";
import Theme from "./views/Theme.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/theme",
      name: "theme",
      component: Theme
    }
  ]
});
