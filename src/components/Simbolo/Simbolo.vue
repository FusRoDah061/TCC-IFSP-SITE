<template lang="pug">
    div.simbolo(:class="{ 'simbolo-deletable':deletable }" :style="{ 'background-color':simbolo.categoria.cor, 'border-color':escurecerCor(simbolo.categoria.cor), 'color':contraste(simbolo.categoria.cor) }")
        div.simbolo-content
            span.simbolo-indice(v-if="simbolo.indice") {{simbolo.indice}}
            img.simbolo-icone(:src="(preview) ? simbolo.imagem : getUrlIcone(simbolo.imagem)")
            p.simbolo-palavra {{ simbolo.nome }}
</template>

<script>
import ColorUtils from '../../util/color';

export default {
    name: 'simbolo',
    props: {
        simbolo: Object,
        deletable: Boolean,
        preview: Boolean
    },
    methods: {
        escurecerCor(cor) {
            return ColorUtils.lightenDarkenColor(-.15, cor);
        },

        getUrlIcone(simbolo){ 
            if(this.simbolo.arquivo.includes("users")) {
                return `${process.env.VUE_APP_IMAGEM_URL}/${this.simbolo.arquivo}?api_token=${this.$store.state.usuario.api_token}`;
            }
            else {
                return `${process.env.VUE_APP_IMAGEM_URL}/${this.simbolo.arquivo}`;
            }
        },

        contraste(cor){
            return ColorUtils.higherContrast(cor);
        },
    }
}
</script>
