<template lang="pug">
    div.body
        cabecalho

        pranchas(v-bind:usuario="usuario.hid" v-bind:auth="usuario.api_token")

        categorias(v-bind:auth="usuario.api_token")
</template>

<script>

export default {
    name: 'home',
    data() {
        return {
            usuario: null
        };
    },
    created() {
        this.usuario = JSON.parse(localStorage.usuario);
    }
}
</script>

<style lang="scss" scoped>
    .pranchas {
        margin-bottom: 10px;
    }
</style>
