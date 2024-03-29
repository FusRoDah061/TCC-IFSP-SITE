<template lang="pug">
    div.simbolos
        p.component-title Símbolos

        form.simbolos-busca.form-inline(@submit.prevent="buscarSimbolos")
            div.form-inputs
                label(for="js-palavra") Buscar símbolo por palavra
                div.form-control.form-search.input--w-icon
                    input#js-palavra(v-model="busca" type="text" maxlength="255" autofocus)

            button.btn.btn-green Buscar

        ul.simbolos-box(:class="{'sentenca-aberta': sentenca}")
            li(v-for="(simbolo, i) in simbolos" :id="simbolo.hid")
                simbolo.simbolo-responsive(:key="simbolo.hid" :simbolo="simbolo" removable=false deletable=true @click.native.stop="simboloSelecionado(simbolo)" @deleted="simboloDeletado" :style="{'z-index': 15000 - i}")

            li.simbolos-load-more#js-simbolos-load-more
                spinner.spinner-border-sm.width-100(position="center" v-bind:show="buscandoPagina")
</template>

<script>
import DOMUtils from '../../util/dom';
import { mapActions } from 'vuex';

//TODO: Por performance, manter as categorias em cache assim que forem buscadas, junto das cores já calculadas, para não calcular denovo toda hora.

export default {
    name: 'simbolos',
    data() {
        return {
            simbolos: [],
            pagina: 1,
            busca: null,
            buscandoPagina: false,
            disparouBuscaPagina: false
        }
    },
    props: {
        prancha: String,
        categoria: String,
        sentenca: Boolean
    },
    mounted() {
        if(this.categoria != null)
            this.fetchSimbolos();

        document.addEventListener('scroll', this.handleOnScroll);
    },
    destroyed() {
        document.removeEventListener('scroll', this.handleOnScroll);
    },
    methods: {
        ...mapActions (['showLoader']),
        ...mapActions ({
            showLoader: 'showLoader'  
        }),

        handleOnScroll() {
            let estaVisivel = DOMUtils.isElementInViewport('js-simbolos-load-more');

            if( estaVisivel && 
                this.simbolos.length > 0 && 
                !this.buscandoPagina &&
                !this.disparouBuscaPagina
            ){
                this.disparouBuscaPagina = true;
                this.carregaNovaPagina();
            }
            else if (!estaVisivel){
                this.disparouBuscaPagina = false
            }
        },

        buscarSimbolos() {
            this.simbolos = [];
            this.pagina = 1;
            this.fetchSimbolos();
        },

        fetchSimbolos() {
            this.showLoader(true);

            axios({
                method: 'get',
                url: `${process.env.VUE_APP_API_URL}/usuarios/${this.$store.state.usuario.hid}/simbolos`,
                params: {
                    prancha: this.prancha || '',
                    categoria: this.categoria || '',
                    busca: this.busca || '',
                    page: this.pagina
                },
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${this.$store.state.usuario.api_token}`
                }
            })
            .then(response => {
                this.showLoader(false);
                this.buscandoPagina = false;

                if(response.status == 200 && typeof(response.data) === 'object'){
                    this.simbolos = this.simbolos.concat(response.data || []);
                }

            })
            .catch(error => {
                this.showLoader(false);
                this.buscandoPagina = false;

                if (error.response) {
                    toastr.error(error.response.data.message, 'Erro ao obter símbolos');
                }
                else {
                    toastr.error(error.message, 'Erro ao obter símbolos');
                }
            });
        },

        simboloSelecionado(simbolo) {
            this.$emit('selected', simbolo);
        },

        carregaNovaPagina() {
            this.buscandoPagina = true;
            this.pagina++;
            this.fetchSimbolos();
        },

        reset() {
            this.simbolos = [];
            this.pagina = 1;
            this.busca = null,
            this.buscandoPagina = false
        },

        simboloDeletado(simbolo) {
            document.getElementById(simbolo.hid).style.display = "none";
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
            this.reset();
            this.fetchSimbolos();
        }
    }
}
</script>
