<template lang="pug">
    div.body
        cabecalho

        div.nav
            pranchas(v-bind:usuario="usuario.hid" v-bind:auth="usuario.api_token")
            categorias(v-bind:auth="usuario.api_token" v-on:selected="mudaCategoria")

        simbolos(:usuario="usuario.hid" :auth="usuario.api_token" :categoria="categoria" :sentenca="simbolosSentenca.length > 0" @selected="simboloSelecionado")

        sentenca(:simbolos="simbolosSentenca" @simboloRemovido="simboloRemovidoSentenca" @limpar="limparSentenca" @interpretar="interpretarSentenca")
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
            this.simbolosSentenca.push(simbolo);
        },

        simboloRemovidoSentenca(simbolo) {
            let i = this.simbolosSentenca.findIndex(s => s.hid == simbolo.hid);
            this.simbolosSentenca.splice(i, 1);
        },

        limparSentenca() {
            this.simbolosSentenca = [];
        },

        interpretarSentenca(simbolos){
            console.log(simbolos);
        }
    }
}
</script>

<style lang="scss" scoped>
    .pranchas, .categorias, .simbolos {
        margin-bottom: 10px;
    }

</style>
