<template lang="pug">
    div.body
        cabecalho

        div.nav
            pranchas(v-bind:usuario="usuario.hid" v-bind:auth="usuario.api_token")
            categorias(v-bind:auth="usuario.api_token" v-on:selected="mudaCategoria")
</template>

<script>

export default {
    name: 'home',
    data() {
        return {
            usuario: null,
            categoria: null
        };
    },
    created() {
        this.usuario = JSON.parse(localStorage.usuario);
    },
    methods: {
        mudaCategoria(categoria) {
            console.log(categoria);
            this.categoria = categoria;
        }
    }
}
</script>

<style lang="scss" scoped>
    .pranchas {
        margin-bottom: 10px;
    }
</style>
