<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style src="./scss/main.scss" lang="scss"></style>

<script>
import runtimeEnv from '@mars/heroku-js-runtime-env';

export default {
  name: 'app',
  mounted() {
    const env = runtimeEnv();
  },
  watch: {
    '$route' (to, from) {
      //console.log("$route (to/from):", to, from);
    }
  }
}
</script>

