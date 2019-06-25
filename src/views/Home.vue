<template lang="pug">
    div.body
        cabecalho

        div.nav
            pranchas(v-bind:usuario="usuario.hid" v-bind:auth="usuario.api_token")
            categorias(v-bind:auth="usuario.api_token" v-on:selected="mudaCategoria")

        simbolos(v-bind:usuario="usuario.hid" v-bind:auth="usuario.api_token" v-bind:categoria="categoria" v-on:selected="simboloSelecionado")
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
            this.categoria = categoria;
        },

        simboloSelecionado(simbolo) {
            //TODO: Adicionar símbolo na sentença
            console.log(simbolo);
        }
    }
}
</script>

<style lang="scss" scoped>
    .pranchas, .categorias, .simbolos {
        margin-bottom: 10px;
    }

</style>
