<template lang="pug">
    div.vlibras(vp)
        div(vp-message-box)
        div(vp-settings)
        div(vp-settings-btn)
        div(vp-info-screen)
        div(vp-dictionary)
        div(vp-controls)
</template>

<style lang="scss">
    .interprete {
        height: 50vh;
    }

    .vlibras > .message-box, .vlibras > div[vp-message-box] {
        position: absolute;
    }

    .vlibras .settings, .vlibras div[vp-settings], 
    .vlibras .settings-btn, .vlibras div[vp-settings-btn], 
    .vlibras .controls, .vlibras div[vp-controls],
    .vlibras .message, .vlibras div[vp-message-box], .vlibras .message-box  {
        display: none !important;
    }
</style>


<script>
export default {
    name: 'vlibras',
    data() {
        return {
            vlibras: null,
            traduzindo: false,
            palavra: null,
            animationPlay: false
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
            /*
                #Sem pausa
                translate:start
                animation:end
                animation:end
                animation:play *
                translate:end
                animation:end *

                # Com pausa
                translate:start
                animation:end
                animation:end
                animation:play *
                translate:end
                translate:pause
                translate:pause
                translate:play
                animation:end *
            */

            if(!this.vlibras){
                this.vlibras = (window.vlibras || new VLibras.Plugin());

                this.vlibras.player.on('load', () => { 
                    this.$emit('onload', 'VLibras carregado');
                });

                this.vlibras.player.on('error', error => {

                    switch(error) {
                        case 'compatibility_error':
                            this.traduzindo = false;
                            this.$emit('onloaderror', 'O seu computador não suporta o WebGL. Por favor, atualize os drivers de vídeo.');
                            break;
                        case 'translation_error':
                            this.$emit('ontranslated', this.palavra);
                            //this.$emit('ontranslatederror', 'Erro ao traduzir texto no servidor do VLibras');
                            break;
                        case 'internal_error':
                            this.traduzindo = false;
                            this.$emit('onloaderror', 'Ocorreu um problema ao iniciar o VLibras.');
                            break;
                    }
                });

                this.vlibras.player.on('translate:start', () => { });

                this.vlibras.player.on('translate:end', () => {
                    this.$emit('ontranslated', this.palavra);
                });

                this.vlibras.player.on('animation:play', () => {
                    this.animationPlay = true;
                });

                this.vlibras.player.on('animation:pause', () => { });

                this.vlibras.player.on('animation:end', () => {
                    console.log(this.traduzindo, this.animationPlay);

                    if(this.traduzindo && this.animationPlay){
                        this.animationPlay = false;
                        this.traduzindo = false;
                        this.$emit('onsignalized', this.palavra);
                    }
                });
            }
        },

        traduzir(event) {
            this.traduzindo = true;
            this.palavra = event.palavra;
            this.$emit('ontranslating', event.palavra);

            this.vlibras.translate(event.palavra);
        }
    }
}
</script>
