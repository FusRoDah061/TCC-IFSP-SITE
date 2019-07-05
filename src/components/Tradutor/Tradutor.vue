<template lang="pug">
    div.tradutor(:class="{'tradutor--shown': interpretar}")
        div.tradutor-content
            button.tradutor-close(@click="fechar") 
                span &times;

            div.interprete
                hand-talk(:ativo="interpretar" 
                    :frase="palavra"
                    :elemento="`js-simbolo-${simboloAtual}`"
                    @onload="tradutorLoad" 
                    @onloaderror="tradutorLoadError"
                    @ontranslated="tradutorTranslated" 
                    @ontranslatederror="tradutorTranslatedError" 
                    @onsignalized="tradutorSignalized")

            p.palavra-atual {{ palavra }}

            div.simbolos-interpretar
                div.simbolos-botoes
                    button.btn.btn-white(@click="simboloAnterior")
                        i.icon.ion-md-skip-backward
                        span Anterior 
                    button.btn.btn-white(@click="proximoSimbolo")
                        i.icon.ion-md-skip-forward
                        span Próximo
                    button.btn.btn-white(@click="repetirTudo")
                        i.icon.ion-md-refresh
                        span Repetir tudo 
                
                ul.simbolos-sentenca(id="js-simbolos-interpretar")
                    li(v-for="(simbolo, i) in simbolos")
                        simbolo(:id="`js-simbolo-${i}`" :key="simbolo.hid + simbolo.indice" :simbolo="simbolo" @selecionado="selecionarSimbolo(i)" :class="{ 'simbolo--ativo': (simboloAtual == i) }")

</template>

<script>
import Vlibras from './Vlibras/Vlibras';
import HandTalk from './HandTalk/HandTalk';
import DOMUtils from '../../util/dom';

export default {
    name:'tradutor',
    data() {
        return {
            tradutorPronto: false,
            palavra: null,
            simboloAtual: 0
        }
    },
    props: {
        interpretar: Boolean,
        simbolos: Array
    },
    components: {
        Vlibras, HandTalk
    },
    watch: {
        interpretar: function(novoValor, antigoValor) {
            console.log('interpretar: ', novoValor, antigoValor);
        },

        simboloAtual: function(novoValor, antigoValor) {
            this.palavra = this.simbolos[this.simboloAtual].nome;
            console.log('Vai traduzir: ', this.palavra);
            DOMUtils.scrollCenterOnElem('js-simbolos-interpretar', `js-simbolo-${this.simboloAtual}`);
        }
    },
    methods: {
        fechar() {
            if(this.interpretar) {
                this.$emit('terminou', 'canceled');
            }
        },

        tradutorLoad(result) {
            this.tradutorPronto = true;

            if (this.simbolos.length > 0)
                this.palavra = this.simbolos[this.simboloAtual].nome;
        }, 

        tradutorLoadError(result) {
            console.log(result);
        },

        tradutorTranslated(result) {
            console.log(result);
        },
        
        tradutorTranslatedError(result) {
            console.log(result);
        },

        tradutorSignalized(result) {
            console.log(result);
            this.proximoSimbolo();
        },

        simboloAnterior() {
            this.simboloAtual = this.simboloAtual - 1 < 0 ? 0 : this.simboloAtual - 1;
        },

        proximoSimbolo() {
            this.simboloAtual = this.simboloAtual + 1 >= this.simbolos.length ? this.simbolos.length - 1 : this.simboloAtual + 1;
        },

        repetirTudo() {
            this.simboloAtual = 0;
        },

        selecionarSimbolo(indice) {
            this.simboloAtual = indice;
        }
    }
}
</script>
 