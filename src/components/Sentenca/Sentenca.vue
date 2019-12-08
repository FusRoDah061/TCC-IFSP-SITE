<template lang="pug">
    div.sentenca(:class="{ 'sentenca--show': simbolos.length > 0 }")
        p.component-title.mb-2 Frase atual

        ul.sentenca-simbolos#js-sentenca-simbolos
            li(v-for="(simbolo, i) in simbolosReais")
                simbolo.simbolo-sentenca(:key="simbolo.hid" :simbolo="simbolo" @click.native.stop="removerSimbolo(simbolo)" removable=true deletable=false)
        
        div.sentenca-buttons
            button.btn.btn-blue.btn-block(@click="interpretar") Interpretar
            button.btn.btn-blue.btn-block(@click="limparSentenca") Limpar
</template>

<script>
import { setTimeout } from 'timers';
import DOMUtils from '../../util/dom';

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

            this.simbolosReais = newVal.map(e => e['hid'])
            .map((e, i, final) => final.indexOf(e) === i && i)
            .filter(e => newVal[e]).map(e => newVal[e]);

            setTimeout(function () {
                DOMUtils.scrollToEnd('js-sentenca-simbolos');
            }, 200);            
        }
    }
}
</script>

