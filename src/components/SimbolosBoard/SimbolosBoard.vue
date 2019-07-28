<template lang="pug">
    div.simbolo-picker
        categorias(@selected="mudaCategoria")

        simbolos(:prancha="prancha" :categoria="categoria" :sentenca="simbolosSentenca.length > 0" @selected="simboloSelecionado")

        sentenca(v-if="sentenca" :simbolos="simbolosSentenca" @simboloRemovido="simboloRemovidoSentenca" @limpar="limparSentenca" @interpretar="interpretarSentenca")

        tradutor(v-if="sentenca" :simbolos="simbolosSentenca" :interpretar="interpretar" @terminou="interpretarAcabou")
</template>

<script>
import Sentenca from '../Sentenca/Sentenca';
import Categorias from "../Categorias/Categorias";
import Simbolos from "../Simbolos/Simbolos";
import Tradutor from "../Tradutor/Tradutor";

export default {
    name:'simbolos-board',
    data() {
        return {
            categoria: null,
            simbolosSentenca: [],
            interpretar: false
        }
    },
    props: {
        usuario: Object,
        sentenca: Boolean,
        prancha: String
    },
    components: {
        Sentenca, Categorias, Simbolos, Tradutor
    },
    methods: {
        mudaCategoria(categoria) {
            if(typeof(categoria) === 'object')
                this.categoria = categoria.hid;
            else 
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
            this.interpretar = true;
        },

        interpretarAcabou(result) {
            this.interpretar = false;
        }
    }
}
</script>
