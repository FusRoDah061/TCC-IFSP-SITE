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
            handTalk: null
        }
    },
    props: {
        ativo: Boolean,
        palavra: String
    },
    mounted() {
        this.initTradutor();
    },
    watch: {
        ativo: function(novoValor, antigoValor) {
            if(novoValor) {
                this.initTradutor();
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
                    console.log('Erro ao autenticar');
                    this.$emit('onload', 'Erro ao autenticar');
                });

                this.handTalk.on('hugoLoaded', () => {
                    console.log('Hugo carregado');
                    this.$emit('onload', 'Hugo carregado');
                });

                this.handTalk.on('activated', () => {
                    console.log('Feature de texto ou vídeo ativada');
                });

                this.handTalk.on('translated', () => {
                    console.log('Texto traduzido corretamente no Servidor da Hand Talk');
                });

                this.handTalk.on('errorOnTranslate', () => {
                    console.log('Erro ao traduzir texto no servidor da Hand Talk');
                });

                this.handTalk.on('signalized', () => {
                    console.log('Sentença sinalizada por completo');
                });
            }
        },

        traduzir() {
            /*
            ht = this.handTalk
            ht.textManager.lastText = "Allex"
            ht.textManager.emit('validElementClicked', { target: document.getElementById('js-teste') }, "Allex")
            emit('validElementClicked', clickEventObj, targetText)
            */
        }
    }
}
</script>
