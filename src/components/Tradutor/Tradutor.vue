<template lang="pug">
    div.tradutor(:class="{'tradutor--shown': interpretar}")
        div.tradutor-content
            hand-talk(:ativo="interpretar")
            div.espaco
</template>

<script>
import Vlibras from './Vlibras/Vlibras';
import HandTalk from './HandTalk/HandTalk';

export default {
    name:'tradutor',
    props: {
        interpretar: Boolean,
        simbolos: Array
    },
    components: {
        Vlibras, HandTalk
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
