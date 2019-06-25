<template lang="pug">
    div.simbolo(@click="simboloClicado" :style="{ 'background-color':simbolo.categoria.cor, 'border-color':escurecerCor(simbolo.categoria.cor), 'color':contraste(simbolo.categoria.cor) }")
        div.simbolo-content
            img.simbolo-icone(:src="getUrlIcone(simbolo.imagem)")
            p.simbolo-palavra {{ simbolo.nome }}
</template>

<script>
import { Values } from '../../env';
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
            return `${Values.IMAGEM_URL}/${this.simbolo.arquivo}`;
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
