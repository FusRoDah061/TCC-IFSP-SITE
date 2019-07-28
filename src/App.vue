<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style src="./scss/main.scss" lang="scss"></style>

<script>
    import { mapActions } from 'vuex';

export default {
  name: 'app',
  created() {
    let usuario = localStorage.usuario;

    if(usuario) {
      	this.initUsuario(JSON.parse(usuario));
    }
  },
  watch: {
    '$route' (to, from) {
      //console.log("$route (to/from):", to, from);
    }
  },
  methods: {
    ...mapActions (['initUsuario']),
    ...mapActions ({initUsuario: 'initUsuario'}),
  }
}
</script>

