<template lang="pug">
    div.tradutor(:class="{'tradutor--shown': interpretar}")
        div.tradutor-content
            vlibras(:ativo="interpretar")
</template>

<script>
import Vlibras from './Vlibras/Vlibras';

export default {
    name:'tradutor',
    props: {
        interpretar: Boolean,
        simbolos: Array
    },
    components: {
        Vlibras
    },
    watch: {
        interpretar: function(novoValor, antigoValor) {
            console.log('interpretar: ', novoValor, antigoValor);
        }
    },
    methods: {

    }
}
</script>
