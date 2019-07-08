<template lang="pug">
    div.tradutor(:class="{'tradutor--shown': interpretar}")
        div.tradutor-content
            button.tradutor-close(@click="fechar") 
                span &times;

            div.interprete
                hand-talk(:ativo="interpretar" 
                    :bus="bus"
                    @onload="tradutorLoad" 
                    @onloaderror="tradutorLoadError"
                    @ontranslated="tradutorTranslated" 
                    @ontranslatederror="tradutorTranslatedError" 
                    @onsignalized="tradutorSignalized"
                    @ontranslating="tradutorTraduzindo")
                
                div.interprete-load(v-if="tradutorLoading")
                    p.text-center Aguarde...
                    div.text-center
                        span.spinner-grow.spinner-grow-sm(role="status" aria-hidden="true")
                        span.spinner-grow.spinner-grow-sm(role="status" aria-hidden="true")
                        span.spinner-grow.spinner-grow-sm(role="status" aria-hidden="true")

            p.palavra-atual {{ palavra }}

            div.simbolos-interpretar
                div.simbolos-botoes
                    button.btn.btn-white(@click="simboloAnteriorClick" :disabled="tradutorLoading")
                        i.icon.ion-md-skip-backward
                        span Anterior 
                    button.btn.btn-white(@click="proximoSimboloClick" :disabled="tradutorLoading")
                        i.icon.ion-md-skip-forward
                        span Próximo
                    button.btn.btn-white(@click="repetirTudoClick" :disabled="tradutorLoading")
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
import Vue from "vue";

export default {
    name:'tradutor',
    data() {
        return {
            tradutorPronto: false,
            simboloAtual: -1,
            traduzindo: false,
            bus: new Vue(),
            traducaoAutomatica: true,
            palavra: null,
            tradutorLoading: true
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
            
            if(novoValor) {
                this.bus.$emit('initialize', null);
            }
            else {
                this.reset();
            }
        },

        traducaoAutomatica: function(novoValor, antigoValor) {
            if(!antigoValor && novoValor) {
                this.proximoSimbolo();
            }
        },

        simboloAtual: function(novoValor, antigoValor) {
            if(novoValor < 0) return;

            DOMUtils.scrollCenterOnElem('js-simbolos-interpretar', `js-simbolo-${novoValor}`);            
            this.traduzir(this.simbolos[novoValor]);
        }
    },
    methods: {
        fechar() {
            if(this.interpretar) {
                this.reset();
                this.$emit('terminou', 'canceled');
            }
        },

        reset() {
            this.tradutorPronto = false;
            this.simboloAtual = 0;
            this.traduzindo = false;
            this.palavra = null;
            this.tradutorLoading = false;
        },

        tradutorLoad(result) {
            console.log(result);
            this.tradutorPronto = true;
            this.tradutorLoading = false;

            if (this.simbolos.length > 0 && this.traducaoAutomatica) {
                this.simboloAtual = 0;
            }
        }, 

        tradutorLoadError(result) {
            this.tradutorLoading = false;
        },

        tradutorTranslated(result) {
            console.log(result);
            this.tradutorLoading = false;
            this.palavra = result;
        },
        
        tradutorTranslatedError(result) {
            this.tradutorLoading = false;
            this.traduzindo = false;
            this.palavra = result;
        },

        tradutorSignalized(result) {
            this.tradutorLoading = false;
            this.traduzindo = false;

            if(this.traducaoAutomatica)
                this.proximoSimbolo();
        },

        tradutorTraduzindo(result) {
            this.traduzindo = true;
        },

        simboloAnteriorClick () {
            this.traducaoAutomatica = false;
            this.simboloAtual = this.simboloAtual - 1 < 0 ? 0 : this.simboloAtual - 1;
        },

        proximoSimbolo () {
            this.simboloAtual = this.simboloAtual + 1 >= this.simbolos.length ? this.simbolos.length - 1 : this.simboloAtual + 1;
        },

        proximoSimboloClick ()  {
            this.traducaoAutomatica = false;
            this.proximoSimbolo();
        },

        repetirTudoClick () {
            this.simboloAtual = -1;
            this.traducaoAutomatica = true;
        },

        selecionarSimbolo(indice) {
            this.traducaoAutomatica = false;
            this.simboloAtual = indice;
        },

        traduzir(simbolo) {
            console.log('Vai traduzir: ', simbolo.nome);
            this.tradutorLoading = true;

            if(this.tradutorPronto) {
                this.bus.$emit('traduzir', {
                    palavra: simbolo.nome,
                    elem: `js-simbolo-${this.simboloAtual}`
                });
            }
        }
    }
}
</script>
 