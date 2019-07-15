<template lang="pug">
    div.simbolos
        p Símbolos
            spinner(position="text" v-bind:show="isLoading")

        form.simbolos-busca.form-inline
            div.form-inputs
                label(for="js-palavra") Buscar símbolo por palavra
                div.form-control.form-search.input--w-icon
                    input#js-palavra(v-model="busca" type="text" maxlength="255" autofocus)

            button.btn.btn-green.py-2.px-4(@click.stop="fetchSimbolos") Buscar

        ul.simbolos-box(:class="{'sentenca-aberta': sentenca}")
            li(v-for="(simbolo, i) in simbolos")
                simbolo(:key="simbolo.hid" :simbolo="simbolo" @selecionado="simboloSelecionado")

            li.simbolos-load-more#js-simbolos-load-more
                spinner.spinner-border-sm.width-100(position="center" v-bind:show="isLoading")
</template>

<script>
import DOMUtils from '../../util/dom';

//TODO: Por performance, manter as categorias em cache assim que forem buscadas, junto das cores já calculadas, para não calcular denovo toda hora.

export default {
    name: 'simbolos',
    data() {
        return {
            simbolos: [],
            pagina: 1,
            isLoading: true,
            busca: null,
            buscandoPagina: false,
            disparouBuscaPagina: false
        }
    },
    props: {
        usuario: String,
        auth: String,
        prancha: String,
        categoria: String,
        sentenca: Boolean
    },
    mounted() {
        if(this.categoria != null)
            this.fetchSimbolos();

        document.addEventListener('scroll', () => {
            let estaVisivel = DOMUtils.isElementInViewport('js-simbolos-load-more');

            if( estaVisivel && 
                this.simbolos.length > 0 && 
                !this.buscandoPagina &&
                !this.disparouBuscaPagina
            ){
                this.buscandoPagina = true;
                this.disparouBuscaPagina = true;
                this.carregaNovaPagina();
            }
            else if (!estaVisivel){
                this.disparouBuscaPagina = false
            }
        });
    },
    methods: {

        fetchSimbolos() {
            this.isLoading = true;

            axios({
                method: 'get',
                url: `${process.env.VUE_APP_API_URL}/usuarios/${this.usuario}/simbolos`,
                params: {
                    prancha: this.prancha || '',
                    categoria: this.categoria || '',
                    busca: this.busca || '',
                    page: this.pagina
                },
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${this.auth}`
                }
            })
            .then(response => {
                this.isLoading = false;
                this.buscandoPagina = false;

                if(response.status == 200 && typeof(response.data) === 'object'){
                    this.simbolos = this.simbolos.concat(response.data || []);
                }

            })
            .catch(error => {
                this.isLoading = false;
                this.buscandoPagina = false;

                if (error.response) {
                    console.log(error.response.data.message);
                }
                else {
                    console.log(error.message, error.stack);
                }
            });
        },

        simboloSelecionado(simbolo) {
            this.$emit('selected', simbolo);
        },

        carregaNovaPagina() {
            this.pagina++;
            this.fetchSimbolos();
        },

        reset() {
            this.simbolos = [];
            this.pagina = 1;
            this.busca = null,
            this.buscandoPagina = false
        }
    },
    watch: {
        categoria: function(novoValor, antigoValor) {
            if(novoValor && novoValor != antigoValor) {
                this.reset();
                this.fetchSimbolos();
            }
        },

        prancha: function(valor) {
            if(valor) {
                this.reset();
                this.fetchSimbolos();
            }
        }
    }
}
</script>
