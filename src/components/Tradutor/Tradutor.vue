<template lang="pug">
    div.tradutor(:class="{'tradutor--shown': interpretar}")
        div.tradutor-content
            button.tradutor-close(@click="fechar") 
                span &times;

            div.interprete
                vlibras(:bus="bus"
                    @onload="tradutorLoad" 
                    @onloaderror="tradutorLoadError"
                    @ontranslated="tradutorTranslated" 
                    @ontranslatederror="tradutorTranslatedError" 
                    @onsignalized="tradutorSignalized"
                    @ontranslating="tradutorTraduzindo")

                //-
                    hand-talk(:bus="bus"
                        @onload="tradutorLoad" 
                        @onloaderror="tradutorLoadError"
                        @ontranslated="tradutorTranslated" 
                        @ontranslatederror="tradutorTranslatedError" 
                        @onsignalized="tradutorSignalized"
                        @ontranslating="tradutorTraduzindo")
                
                div.interprete-load(v-if="tradutorLoading")
                    p.text-center Aguarde, traduzindo {{ palavraTraduzir }}...
                    div.text-center
                        span.spinner-grow.spinner-grow-sm(role="status" aria-hidden="true")
                        span.spinner-grow.spinner-grow-sm(role="status" aria-hidden="true")
                        span.spinner-grow.spinner-grow-sm(role="status" aria-hidden="true")

            p.mt-2.mb-0.text-center.font-italic(:class="{ 'text-danger': error }") {{ palavra }}

            div.simbolos-interpretar
                
                div.simbolos-botoes.my-2
                    button.btn.btn-white(@click="simboloAnteriorClick" :disabled="tradutorLoading")
                        i.icon.ion-md-skip-backward
                        span Anterior 
                    button.btn.btn-white(@click="proximoSimboloClick" :disabled="tradutorLoading")
                        i.icon.ion-md-skip-forward
                        span Próximo
                    button.btn.btn-white(@click="repetirTudoClick" :disabled="tradutorLoading")
                        i.icon.ion-md-refresh
                        span Repetir tudo 
                
                div.traducao-automatica
                    div.switch
                        input#js-trad-auto.switch__checkbox(type="checkbox" v-model="traducaoAutomatica" :disabled="tradutorLoading")
                        span
                    label.mb-0.ml-2(for="#js-trad-auto") {{ traducaoAutomaticaTexto }}

                ul.simbolos-sentenca.mt-2.mb-0(id="js-simbolos-interpretar")
                    li(v-for="(simbolo, i) in simbolos")
                        simbolo(:id="`js-simbolo-${i}`" :auth="auth" :key="simbolo.hid + simbolo.indice" :simbolo="simbolo" @selecionado="selecionarSimbolo(i)" :class="{ 'simbolo--ativo': (indiceAtual == i) }")

</template>

<script>
import Vlibras from './Vlibras/Vlibras';
import HandTalk from './HandTalk/HandTalk';
import DOMUtils from '../../util/dom';
import Vue from "vue";
import { setTimeout } from 'timers';

export default {
    name:'tradutor',
    data() {
        return {
            tradutorPronto: false,
            indiceAtual: -1,
            traduzindo: false,
            bus: new Vue(),
            traducaoAutomatica: true,
            palavra: null,
            tradutorLoading: true,
            pararTraducao: false,
            esperandoTraducao: false,
            error: false
        }
    },
    computed: {
        traducaoAutomaticaTexto: function() {
            return `Interpretar automáticamente? ${ (this.traducaoAutomatica) ? 'Sim!' : 'Não.' }`;
        },

        palavraTraduzir: function() {
            if(this.indiceAtual >= 0)
                return `"${this.simbolos[this.indiceAtual].nome}"`;
            
            return null;
        }
    },
    props: {
        interpretar: Boolean,
        simbolos: Array,
        auth: String
    },
    components: {
        Vlibras, HandTalk
    },
    watch: {
        interpretar: function(novoValor, antigoValor) { 
            console.log("Abriu");

            if(novoValor) {
                this.pararTraducao = false;

                if(!this.tradutorPronto)
                    this.bus.$emit('initialize', null);
                else
                    setTimeout(() => {
                        this.tradutorLoad();
                    }, 300);
            }
            else {
                this.pararTraducao = true;
                this.reset();
            }
        },

        traducaoAutomatica: function(novoValor, antigoValor) {
            if(novoValor && !this.pararTraducao && !this.traduzindo) {
                consoel.log("Automático ligado");
                this.proximoSimbolo();
            }
        }
    },
    methods: {
        fechar() {
            if(this.interpretar) {
                this.pararTraducao = true;
                this.reset();
                this.$emit('terminou', 'canceled');
            }
        },

        reset() {
            this.indiceAtual = 0;
            this.traduzindo = false;
            this.palavra = null;
            this.tradutorLoading = false;
            this.esperandoTraducao = false;
        },

        tradutorLoad(result) {
            console.log('tradutorLoad');
            this.tradutorPronto = true;
            this.tradutorLoading = false;
            this.error = false;

            if (this.simbolos.length > 0 && this.traducaoAutomatica) {
                this.traduzir(0);
            }
        }, 

        tradutorLoadError(result) {
            console.log('tradutorLoadError');
            this.tradutorLoading = false;
            this.palavra = result;
            this.error = true;
        },

        tradutorTranslated(result) {
            console.log('tradutorTranslated');
            this.tradutorLoading = false;
            this.palavra = result;
            this.esperandoTraducao = false;
            this.error = false;
        },
        
        tradutorTranslatedError(result) {
            console.log('tradutorTranslatedError');
            this.tradutorLoading = false;
            this.traduzindo = false;
            this.palavra = result;
            this.error = true;
        },

        tradutorSignalized(result) {
            console.log('tradutorSignalized', result);
            this.tradutorLoading = false;
            this.traduzindo = false;
            this.error = false;
            this.palavra = result;

            if(this.traducaoAutomatica && !this.pararTraducao && this.indiceAtual < this.simbolos.length)
                this.proximoSimbolo();
        },

        tradutorTraduzindo(result) {
            console.log('tradutorTraduzindo');
            this.traduzindo = true;
        },

        simboloAnteriorClick () {
            let indice = this.indiceAtual;

            if(indice >= this.simbolos.length)
                indice = this.simbolos.length - 1;
            else 
                indice -= 1;

            this.traducaoAutomatica = false;
            this.traduzir(indice);
        },

        proximoSimbolo () {
            let indice = this.indiceAtual + 1;
            
            if(indice >= this.simbolos.length) return;

            this.traduzir(indice);
        },

        proximoSimboloClick ()  {
            this.traducaoAutomatica = false;
            this.proximoSimbolo();
        },

        repetirTudoClick () {
            this.traduzir(0);
        },

        selecionarSimbolo(indice) {
            this.traducaoAutomatica = false;
            this.indiceAtual = indice;
            this.traduzir(indice);
        },

        traduzir(indice) {
            if(this.esperandoTraducao) return;

            let simbolo = this.simbolos[indice];

            this.indiceAtual = indice;
            this.esperandoTraducao = true;
            this.traduzindo = true;
            this.tradutorLoading = true;

            DOMUtils.scrollCenterOnElem('js-simbolos-interpretar', `js-simbolo-${indice}`); 

            if(this.tradutorPronto) {
                console.log('Vai traduzir: ', simbolo.nome);
                this.bus.$emit('traduzir', {
                    palavra: simbolo.nome,
                    elem: `js-simbolo-${this.indiceAtual}`
                });
            }
        }
    }
}
</script>
 