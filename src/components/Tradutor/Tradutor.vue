<template lang="pug">
    div.tradutor(:class="{'tradutor--shown': interpretar}" @click="fechar")
        div.tradutor-content
            hand-talk(:ativo="interpretar" @onload="tradutorCarregou")
</template>

<script>
import Vlibras from './Vlibras/Vlibras';
import HandTalk from './HandTalk/HandTalk';

export default {
    name:'tradutor',
    data() {
        return {
            tradutorPronto: false
        }
    },
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
        fechar() {
            if(this.interpretar && this.tradutorPronto) {
                this.$emit('terminou', 'canceled');
            }
        },

        tradutorCarregou(result) {
            this.tradutorPronto = true;
        }
    }
}
</script>
