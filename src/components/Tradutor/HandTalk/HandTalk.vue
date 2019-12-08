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
            traduzindo: false,
            palavra: null
        }
    },
    props: {
        bus: Object
    },
    mounted() {
        this.bus.$on('initialize', this.initTradutor);
        this.bus.$on('traduzir', this.traduzir);
    },
    methods: {
        initTradutor() {
            if(!this.handTalk){
                let parent = document.getElementById('handtalk-parent');

                this.handTalk = new HT({
                    token: process.env.VUE_APP_HANDTALK_KEY,
                    parentElement: parent,
                    exceptions: ['#app'],
                    mobileEnabled: true
                });

                parent.lastElementChild.children[2].click();

                this.handTalk.on('errorOnAuth', () => {
                    this.loading = false;
                    this.$emit('onloaderror', 'Erro ao autenticar');
                });

                this.handTalk.on('hugoLoaded', () => {
                    this.loading = false;
                    this.$emit('onload', 'Hugo carregado');
                });

                this.handTalk.on('translated', () => {
                    this.loading = false;
                    this.$emit('ontranslated', this.palavra);
                });

                this.handTalk.on('errorOnTranslate', () => {
                    this.loading = false;
                    this.traduzindo = false;
                    this.$emit('ontranslatederror', 'Erro ao traduzir texto no servidor da Hand Talk');
                });

                this.handTalk.on('signalized', () => {
                    this.loading = false;
                    this.traduzindo = false;
                    this.$emit('onsignalized', this.palavra);
                });
            }
        },

        traduzir(event) {
            this.traduzindo = true;
            this.palavra = event.palavra;
            this.$emit('ontranslating', event.palavra);

            let ht = this.handTalk;
            ht.textManager.lastText = event.palavra;
            ht.textManager.emit('validElementClicked', { target: document.getElementById(event.elemento) }, event.palavra);
        }
    }
}
</script>
