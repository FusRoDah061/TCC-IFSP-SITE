<template lang="pug">
    div.body
        cabecalho

        div.nav
            pranchas(v-bind:usuario="usuario.hid" v-bind:auth="usuario.api_token")
            categorias(v-bind:auth="usuario.api_token" v-on:selected="mudaCategoria")

        simbolos(v-bind:usuario="usuario.hid" v-bind:auth="usuario.api_token" v-bind:categoria="categoria" v-on:selected="simboloSelecionado")

        sentenca(:simbolos="simbolosSentenca")
</template>

<script>
import Sentenca from '../components/Sentenca/Sentenca';

export default {
    name: 'home',
    data() {
        return {
            usuario: null,
            categoria: null,
            simbolosSentenca: []
        };
    },
    components: {
        Sentenca
    },
    created() {
        this.usuario = JSON.parse(localStorage.usuario);
    },
    methods: {
        mudaCategoria(categoria) {
            this.categoria = categoria;
        },

        simboloSelecionado(simbolo) {
            console.log(simbolo);
            this.simbolosSentenca.push(simbolo);
        }
    }
}
</script>

<style lang="scss" scoped>
    .pranchas, .categorias, .simbolos {
        margin-bottom: 10px;
    }

</style>
