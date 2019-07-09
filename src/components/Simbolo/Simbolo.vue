<template lang="pug">
    div.simbolo(@click="simboloClicado" :style="{ 'background-color':simbolo.categoria.cor, 'border-color':escurecerCor(simbolo.categoria.cor), 'color':contraste(simbolo.categoria.cor) }")
        div.simbolo-content
            span.simbolo-indice(v-if="simbolo.indice") {{simbolo.indice}}
            img.simbolo-icone(:src="getUrlIcone(simbolo.imagem)")
            p.simbolo-palavra {{ simbolo.nome }}
</template>

<script>
import ColorUtils from '../../util/color';

export default {
    name: 'simbolo',
    props: {
        simbolo: Object
    },
    methods: {
        escurecerCor(cor) {
            return ColorUtils.lightenDarkenColor(-.15, cor);
        },

        getUrlIcone(simbolo){ 
            return `${process.env.VUE_APP_IMAGEM_URL}/${this.simbolo.arquivo}`;
        },

        contraste(cor){
            return ColorUtils.higherContrast(cor);
        },

        simboloClicado() {
            this.$emit('selecionado', this.simbolo);
        }
    }
}
</script>
