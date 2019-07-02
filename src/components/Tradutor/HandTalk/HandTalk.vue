<template lang="pug">
    div.handtalk#handtalk-parent
</template>

<style lang="scss">
    #handtalk-parent {
        position: relative;
        display: block;

        ._2KZ3eJtGgPe0N0PiC6Cdie {
            top: 0 !important; 
            left: 0;
            position: absolute;
            right: 0;
            width: 264px;
            margin: auto;
        }

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
                console.log(process.env.VUE_APP_HANDTALK_KEY);

                this.handTalk = new HT({
                    token: process.env.VUE_APP_HANDTALK_KEY,
                    parentElement: parent,
                    exceptions: ['#app']
                });

                console.log(this.handTalk);

                parent.lastElementChild.children[2].click();

                this.handTalk.on('activated', function () {
                    console.log('Feature de texto ou vídeo ativada');
                });

                this.handTalk.on('translated', function () {
                    console.log('Texto traduzido corretamente no Servidor da Hand Talk');
                });

                this.handTalk.on('signalized', function () {
                    console.log('Sentença sinalizada por completo');
                });

                this.handTalk.on('errorOnTranslate', function () {
                    console.error('Erro ao traduzir texto no servidor da Hand Talk');
                });
            }
        }
    }
}
</script>
