<template lang="pug">
    video#js-video.col-md-12.p-0(
        type="video/mp4" autoplay controls
        @canplay="onTranslated"
        @ended="onSignalized"
        @error="onTranslatedError"
    )
        source#js-video-preview(type="video/mp4")
</template>

<script>
export default {
    name:'videoplayer',
    data() {
        return {            
            traduzindo: false,
            palavra: null,
            disparouCanPlay: false
        }
    },
    props: {
        bus: Object
    },
    mounted() {
        this.bus.$on('traduzir', this.reproduzir);
        this.bus.$on('stop', this.paraReproducao);
    },
    methods: {
        reproduzir(event) {
            this.traduzindo = true;
            this.palavra = event.palavra;
            this.$emit('ontranslating', event.palavra);
            this.disparouCanPlay = false;

            let source = document.getElementById('js-video-preview');
            source.src = event.arquivo;
            source.parentElement.load();
        },

        paraReproducao() {
            let video = document.getElementById('js-video');
            video.pause();
            let source = document.getElementById('js-video-preview');
            source.src = "";
        },

        onTranslated(event) {
            if(!this.disparouCanPlay) {
                this.disparouCanPlay = true;
                this.$emit('ontranslated', this.palavra);
            }
        },

        onSignalized(event) {
            this.traduzindo = false;
            this.$emit('onsignalized', this.palavra);
        },

        onTranslatedError(event) {
            this.traduzindo = false;
            this.$emit('ontranslatederror', 'Erro ao obter arquivo de vídeo para reprodução');
        }
    }
}
</script>

