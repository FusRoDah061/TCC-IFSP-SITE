<template>
    <div id="vlibras" vw class="vlibras enabled">
		<div vw-access-button class="active"></div>
		<div vw-plugin-wrapper>
			<div class="vw-plugin-top-wrapper"></div>
		</div>
    </div>
</template>

<style lang="scss">
    .interprete {
        height: 60vh;
    }

    #vlibras {
        position: relative;
        display: block;
        height: 100%;
        top: 0;
        margin-top: 0;
        z-index: 1;

        div[vw-plugin-wrapper] {
            position: relative;
            height: 100% !important;
            width: 100% !important;
            border-radius: 0;
            box-shadow: none;

            div[vp] {
                min-height: 100%;

                #gameContainer {
                    top: 0 !important; 
                    left: 0 !important;   
                    width: 100%;
                    height: 100%;
                    min-height: 100%;
                    min-width: 100%;    
                    padding-top: 20px !important;
                }

                .vpw-box {
                    height: auto;

                    .vpw-message-box {
                        .vpw-message {
                            margin: 0 !important;
                        }
                    }

                    .vpw-mes {
                        position: relative;
                        left: 0 !important;
                        top: 0;
                        transform: none;
                        width: 100%;
                        text-align: start;
                        padding: 3px 10px;
                        font-size: 12px !important;
                    }
                }

                .vpw-settings-btn,
                .vpw-btn-close,
                .vpw-settings,
                .vpw-info-screen,
                .vpw-dictionary,
                .vpw-controls,
                .vpw-subtitles,
                div[vp-settings-btn],
                div[vp-suggestion-screen],
                div[vp-suggestion-button],
                div[vp-rate-box],
                div[vp-rate-button],
                div[vp-change-avatar] {
                    display: none;
                    opacity: 0;
                    pointer-events: none;
                }
            }
        }
    }
</style>

<script>
export default {
    name:'vlibras-widget',
    data() {
        return {
            vlibras: null,
            traduzindo: false,
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
            if(!this.vlibras){
                let parent = document.getElementById('vlibras');
                new window.VLibras.Widget('https://vlibras.gov.br/app');
                parent.firstElementChild.click();

                this.vlibras = window.plugin;

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

                this.vlibras.player.on('gloss:start', () => {
                    this.animationPlay = true;
                });

                this.vlibras.player.on('gloss:end', () => { });

                this.vlibras.player.on('stop:welcome', () => {
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

            window.plugin.player.translate(event.palavra);
            // this.vlibras.translate(event.palavra);
        }
    }
}
</script>