<template lang="pug">
    div.handtalk#handtalk-parent
</template>

<style lang="scss">
    #handtalk-parent {
        position: relative;
        display: block;

        ._2KZ3eJtGgPe0N0PiC6Cdie {
            position: relative;
            display: block;
            width: 264px;
            top: auto !important;
            left: auto;
            right: auto;
        }

        /*.Z3VP_ow4tw0rnDnoiLykZ {
            position: relative;
            bottom: auto;
            right: auto;

            .ht-md-actions {
                display: none;
            }
        }*/

        ._2VauUVQw9BdMxBDl8GX4GQ, ._3Q4E6l7PtCF-ICONC1-lT_ {
            opacity: 0;
            visibility: hidden;
        }
    }
</style>

<script>
import { setTimeout } from 'timers';
export default {
    name: 'hand-talk',
    data() {
        return {
            handTalk: null,
            traduzindo: false
        }
    },
    props: {
        ativo: Boolean,
        frase: String,
        elemento: String
    },
    mounted() {
        this.initTradutor();
    },
    watch: {
        ativo: function(novoValor, antigoValor) {
            if(novoValor) {
                this.initTradutor();
            }
        },

        frase: function(novoValor, antigoValor) {
            if(novoValor && novoValor != antigoValor) {
                this.traduzindo = true;
                this.traduzir();
            }
        }
    },
    methods: {
        initTradutor() {
            if(this.ativo && !this.handTalk){
                let parent = document.getElementById('handtalk-parent');

                this.handTalk = new HT({
                    token: process.env.VUE_APP_HANDTALK_KEY,
                    parentElement: parent,
                    exceptions: ['#app'],
                    mobileEnabled: true
                });

                parent.lastElementChild.children[2].click();

                this.handTalk.on('errorOnAuth', () => {
                    this.$emit('onloaderror', 'Erro ao autenticar');
                });

                this.handTalk.on('hugoLoaded', () => {
                    this.$emit('onload', 'Hugo carregado');
                });

                this.handTalk.on('translated', () => {
                    this.$emit('ontranslated', 'Texto traduzido corretamente no Servidor da Hand Talk');
                });

                this.handTalk.on('errorOnTranslate', () => {
                    this.$emit('ontranslatederror', 'Erro ao traduzir texto no servidor da Hand Talk');
                });

                this.handTalk.on('signalized', () => {
                    this.$emit('onsignalized', 'Sentença sinalizada por completo');
                });
            }
        },

        traduzir() {
            console.log('Traduzindo: ', this.frase);

            let ht = this.handTalk;
            ht.textManager.lastText = this.frase;
            ht.textManager.emit('validElementClicked', { target: document.getElementById(this.elemento) }, this.frase);
        }
    }
}
</script>
