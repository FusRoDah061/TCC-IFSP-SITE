<template lang="pug">
    div.vlibras(vp)
        div(vp-message-box)
        div(vp-settings)
        div(vp-settings-btn)
        div(vp-info-screen)
        div(vp-dictionary)
        div(vp-controls)
</template>

<script>
export default {
    name: 'vlibras',
    data() {
        return {
            vlibras: null
        }
    },
    props: {
        ativo: Boolean
    },
    mounted() {
        if(this.ativo && !this.vlibras)
            this.vlibras = (window.vlibras || new VLibras.Plugin());
    },
    watch: {
        ativo: function(novoValor, antigoValor) {
            if(novoValor && this.ativo && !this.vlibras) {
                this.vlibras = (window.vlibras || new VLibras.Plugin());
            }
        }
    }
}
</script>
