<template lang="pug">
  div#app
    spinner(position="center" fixed=true :show="$store.state.loader.visible")
    router-view
</template>

<style src="./scss/main.scss" lang="scss"></style>

<script>
import { mapActions } from 'vuex';
import AuthStorage from './services/auth';

export default {
  name: 'app',
  created() {
    let usuario = AuthStorage.getUser();

    if(usuario) {
      if(AuthStorage.hasExpirated(usuario)) {
        AuthStorage.removeUser();
        this.$router.push("/");
      }
      else {
        this.initUsuario(usuario);
      }
    }

    toastr.options = this.$store.state.toastrConfig;
  },
  watch: {
    '$route' (to, from) {
      //console.log("$route (to/from):", to, from);
    }
  },
  methods: {
    ...mapActions (['initUsuario']),
    ...mapActions ({initUsuario: 'initUsuario'})
  }
}
</script>

