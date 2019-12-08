<template lang="pug">
    div.tradutor(:class="{'tradutor--shown': interpretar}")
        div.tradutor-content
            button.tradutor-close(@click="fechar") 
                span &times;

            div.interprete(:class="{ 'd-none': isVideo }")
                vlibras-widget(:bus="busImagem"
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

            div.video(:class="{ 'd-none': !isVideo }")
                videoplayer(:bus="busVideo"
                    @onload="tradutorLoad" 
                    @onloaderror="tradutorLoadError"
                    @ontranslated="tradutorTranslated" 
                    @ontranslatederror="tradutorTranslatedError" 
                    @onsignalized="tradutorSignalized"
                    @ontranslating="tradutorTraduzindo")

            p.mt-2.mb-0.text-center.font-italic(:class="{ 'text-danger': error }") {{ palavra }} &nbsp;

            div.simbolos-interpretar
                
                div.simbolos-botoes.my-2
                    button.btn.btn-white(@click="simboloAnteriorClick" :disabled="tradutorLoading")
                        i.icon.ion-md-skip-backward
                        span Anterior 
                    button.btn.btn-white(@click="repetirTudoClick" :disabled="tradutorLoading")
                        i.icon.ion-md-refresh
                        span Repetir tudo 
                    button.btn.btn-white(@click="continuarAutomatico" :disabled="tradutorLoading || traducaoAutomatica || traduzindo")
                        i.icon.ion-md-fastforward
                        span Continuar
                    button.btn.btn-white(@click="proximoSimboloClick" :disabled="tradutorLoading")
                        i.icon.ion-md-skip-forward
                        span Próximo

                ul.simbolos-sentenca.mt-2.mb-0(id="js-simbolos-interpretar")
                    li(v-for="(simbolo, i) in simbolos")
                        simbolo.simbolo-tradutor(:id="`js-simbolo-${i}`" :key="simbolo.hid" removable=false deletable=false :simbolo="simbolo" @click.native.stop="selecionarSimbolo(i)" :class="{ 'simbolo--ativo': (indiceAtual == i) }")

</template>

<script>
// import Vlibras from './Vlibras/Vlibras';
// import HandTalk from './HandTalk/HandTalk';
import VlibrasWidget from './VlibrasWidget/VlibrasWidget';
import Videoplayer from './Videoplayer';
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
            busImagem: new Vue(),
            busVideo: new Vue(),
            traducaoAutomatica: true,
            palavra: null,
            tradutorLoading: false,
            pararTraducao: false,
            esperandoTraducao: false,
            error: false,
            isVideo: false
        }
    },
    props: {
        interpretar: Boolean,
        simbolos: Array
    },
    components: {
        // Vlibras, 
        // HandTalk, 
        Videoplayer, 
        VlibrasWidget
    },
    computed: {
        palavraTraduzir: function() {
            if(this.indiceAtual >= 0)
                return `"${this.simbolos[this.indiceAtual].nome}"`;
            
            return null;
        }
    },
    watch: {
        interpretar: function(novoValor, antigoValor) { 
            if(novoValor) {
                this.pararTraducao = false;

                //Verifica se existem símbolos de imagem para inicializar o interprete
                if(this.simbolos.find(item => item.tipo == process.env.VUE_APP_SIMBOLO_IMAGEM)) {
                    if(!this.tradutorPronto)
                        this.busImagem.$emit('initialize', null);
                    else
                        setTimeout(() => {
                            this.tradutorLoad();
                        }, 300);
                }
                else {
                    this.isVideo = true;
                    this.tradutorLoad();
                }
            }
            else {
                this.pararTraducao = true;
                this.reset();
            }
        },
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
            this.busVideo.$emit('stop');
            this.indiceAtual = 0;
            this.traduzindo = false;
            this.palavra = null;
            this.tradutorLoading = false;
            this.esperandoTraducao = false;
            this.isVideo = false;
        },

        continuarAutomatico() {
            this.traducaoAutomatica = true;
            if(!this.pararTraducao && !this.traduzindo) {
                this.proximoSimbolo();
            }
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
            
            toastr.error(result, 'Erro ao carregar tradutor');
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
            this.esperandoTraducao = false;

            toastr.error(result, 'Erro durante a tradução');
        },

        tradutorSignalized(result) {
            console.log('tradutorSignalized', result);

            /* Ao clicar nos botões anterior ou próximo, o VLibras vai 
            sinalizar o evento translate:start antes do gloss:end,
            o que faz com que o loading suma antes de traduzir a palavra
            resultante do clique no botão. Então processa a tradução finalizada
            apenas se não houver uma em progresso. */
            if(this.tradutorLoading) return;

            this.tradutorLoading = false;
            this.traduzindo = false;
            this.error = false;
            this.palavra = result;

            if(this.traducaoAutomatica && !this.pararTraducao && this.indiceAtual < this.simbolos.length) {
                console.log('Tradução automática ligada');
                this.proximoSimbolo();
            }
        },

        tradutorTraduzindo(result) {
            console.log('tradutorTraduzindo ', result);
            this.tradutorLoading = true;
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
            this.traducaoAutomatica = true;
            this.traduzir(0);
        },

        selecionarSimbolo(indice) {
            this.traducaoAutomatica = false;
            this.indiceAtual = indice;
            this.traduzir(indice);
        },

        traduzir(indice) {
            console.log(indice);
            this.indiceAtual = indice;

            if(this.esperandoTraducao || this.pararTraducao) return;

            this.esperandoTraducao = true;
            this.traduzindo = true;
            this.tradutorLoading = true;

            let simbolo = this.simbolos[indice];

            DOMUtils.scrollCenterOnElem('js-simbolos-interpretar', `js-simbolo-${indice}`); 

            // Para o vídeo se estiver reproduzindo
            this.busVideo.$emit('stop');

            switch(simbolo.tipo) {
                case parseInt(process.env.VUE_APP_SIMBOLO_IMAGEM):
                    this.isVideo = false;
                    this.traduzirImagem(simbolo);
                    break;

                case parseInt(process.env.VUE_APP_SIMBOLO_VIDEO):
                    this.isVideo = true;
                    this.traduzirVideo(simbolo);
                    break;
            }
        },

        traduzirImagem(simbolo) {
            if(this.tradutorPronto) {
                this.busImagem.$emit('traduzir', {
                    palavra: simbolo.nome,
                    elem: `js-simbolo-${this.indiceAtual}`
                });
            }
        },

        traduzirVideo(simbolo) {
            this.busVideo.$emit('traduzir', {
                palavra: simbolo.nome,
                arquivo: simbolo.arquivo
            });
        }
    }
}
</script>
 
