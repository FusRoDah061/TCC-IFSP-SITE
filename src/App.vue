<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style src="./scss/main.scss" lang="scss"></style>

<script>
import runtimeEnv from '@mars/heroku-js-runtime-env';

export default {
  name: 'app',
  mounted() {
    const env = runtimeEnv();
    console.log(env.JS_RUNTIME_MESSAGE || 'JS_RUNTIME_MESSAGE is empty.');
  }
}
</script>

