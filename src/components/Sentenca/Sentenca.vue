<template lang="pug">
    div.sentenca(:class="{ 'sentenca--show': simbolos.length > 0 }")
        ul.sentenca-simbolos
            li(v-for="(simbolo, i) in simbolosReais")
                simbolo.simbolo-sm(:key="simbolo.hid" :simbolo="simbolo" @selecionado="removerSimbolo")
        
        div.sentenca-buttons
            button.btn.btn-blue.btn-block(@click="interpretar") Interpretar
            button.btn.btn-blue.btn-block(@click="limparSentenca") Limpar
</template>

<script>
export default {
    name: 'sentenca',
    data() {
        return {
            simbolosReais: []
        }
    },
    props: {
        simbolos: Array
    },
    methods: {
        removerSimbolo(simbolo) {
            this.$emit('simboloRemovido', simbolo);
        },

        limparSentenca() {
            this.$emit('limpar');
        },

        interpretar() {
            this.$emit('interpretar', this.simbolosReais);
        }
    },
    watch: { 
      	simbolos: function(newVal, oldVal) { 
            //TODO: Adicionar o índice do símbolo na sentença

            this.simbolosReais = newVal.map(e => e['hid'])
            .map((e, i, final) => final.indexOf(e) === i && i)
            .filter(e => newVal[e]).map(e => newVal[e]);
        }
    }
}
</script>

