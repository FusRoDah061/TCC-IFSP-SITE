<template lang="pug">
    div.simbolo-picker
        categorias(v-bind:auth="usuario.api_token" @selected="mudaCategoria")

        simbolos(:usuario="usuario.hid" :auth="usuario.api_token" :categoria="categoria" :sentenca="simbolosSentenca.length > 0" @selected="simboloSelecionado")

        sentenca(v-if="sentenca" :simbolos="simbolosSentenca" @simboloRemovido="simboloRemovidoSentenca" @limpar="limparSentenca" @interpretar="interpretarSentenca")
</template>

<script>
import Sentenca from '../Sentenca/Sentenca';
import Categorias from "../Categorias/Categorias";
import Simbolos from "../Simbolos/Simbolos";

export default {
    name:'simbolos-board',
    data() {
        return {
            categoria: null,
            simbolosSentenca: []
        }
    },
    props: {
        usuario: Object,
        sentenca: Boolean
    },
    components: {
        Sentenca, Categorias, Simbolos
    },
    methods: {
        simboloSelecionado(simbolo) {
            this.$emit('simboloSelected', simbolo);
        },

        mudaCategoria(categoria) {
            this.categoria = categoria;
        },

        simboloSelecionado(simbolo) {
            if(this.sentenca)
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
