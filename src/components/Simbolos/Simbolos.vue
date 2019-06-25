<template lang="pug">
    div.simbolos
        p Símbolos
            spinner(position="center" v-bind:show="isLoading")

        form.simbolos-busca.form-inline
            div.form-inputs
                label(for="js-palavra") Buscar símbolo por palavra
                div.form-control.form-search.input--w-icon
                    input#js-palavra(v-model="busca" type="text" maxlength="255" autofocus)

            button.btn.btn-green(@click="buscarSimbolos") Buscar

        ul.simbolos-box
            li.simbolo(v-for="(simbolo, i) in simbolos" :key="simbolo.hid" @click="simboloSeleciondo(i)" v-bind:style="{ 'background-color':simbolo.categoria.cor, 'border-color':escurecerCor(simbolo.categoria.cor), 'color':contraste(simbolo.categoria.cor) }")
                div.simbolo-content
                    img.simbolo-icone(v-bind:src="getUrlIcone(simbolo)")
                    p.simbolo-palavra {{ simbolo.nome }}

            li.simbolos-load-more#js-simbolos-load-more
                spinner(position="center" v-bind:show="isLoading")
</template>

<script>
import { Values } from '../../env';
import ColorUtils from '../../util/color';
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
            url: null,
            buscandoPagina: false
        }
    },
    props: {
        usuario: String,
        auth: String,
        prancha: String,
        categoria: String
    },
    mounted() {
        document.addEventListener('scroll', () => {
            if(DOMUtils.isElementInViewport('js-simbolos-load-more') && this.simbolos.length > 0 && !this.buscandoPagina){
                this.buscandoPagina = true;
                this.carregaNovaPagina();
            }
        });
    },
    methods: {
        carregarSimbolos() {
            let url = '';

            if(this.prancha){
                url = `${Values.API_URL}/usuarios/${this.usuario}/pranchas/${this.prancha}/simbolos?page=${this.pagina}`;
            }
            else if(this.categoria == Values.CATEGORIA_TODOS || !this.categoria){
                url = `${Values.API_URL}/usuarios/${this.usuario}/categorias/simbolos?page=${this.pagina}`;
            }
            else if (this.categoria == Values.CATEGORIA_MEUS) {
                url = `${Values.API_URL}/usuarios/${this.usuario}/simbolos?page=${this.pagina}`;
            }
            else if(this.categoria){
                url = `${Values.API_URL}/usuarios/${this.usuario}/categorias/${this.categoria}/simbolos?page=${this.pagina}`;
            }

            this.fetchSimbolos(url);
        },

        buscarSimbolos(event) {
            let url = '';

            event.preventDefault();

            if(!this.busca) {
                this.carregarSimbolos();
                return;
            }

            if(this.prancha){
                url = `${Values.API_URL}/usuarios/${this.usuario}/pranchas/${this.prancha}/simbolos?nome=${this.busca || ''}&page=${this.pagina}`;
            }
            else if(this.categoria && this.categoria != Values.CATEGORIA_TODOS && this.categoria != Values.CATEGORIA_MEUS) {
                url = `${Values.API_URL}/usuarios/${this.usuario}/simbolos/buscar?nome=${this.busca || ''}&categoria=${this.categoria}&page=${this.pagina}`;
            }
            else {
                url = `${Values.API_URL}/usuarios/${this.usuario}/simbolos/buscar?nome=${this.busca || ''}&page=${this.pagina}`;
            }

            this.fetchSimbolos(url);
        },

        fetchSimbolos(url) {
            this.url = url;
            this.isLoading = true;

            axios({
                method: 'get',
                url: url,
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

        getUrlIcone(simbolo){ 
            return `${Values.IMAGEM_URL}/${simbolo.arquivo}`;
        },

        simboloSeleciondo(indice) {
            let simbolo = this.simbolos[indice];
            this.$emit('selected', simbolo);
        },

        escurecerCor(cor) {
            return ColorUtils.lightenDarkenColor(-.15, cor);
        },

        contraste(cor){
            return ColorUtils.higherContrast(cor);
        },

        carregaNovaPagina() {
            this.pagina++;
            let url = this.url.substring(0, this.url.indexOf('page=')) + `page=${this.pagina}`;

            this.fetchSimbolos(url);
        }
    },
    watch: {
        categoria: function(novoValor, antigoValor) {
            if(novoValor && novoValor != antigoValor) {
                this.simbolos = [];
                this.pagina = 1;
                this.busca = null,
                this.url = null,
                this.buscandoPagina = false
                this.carregarSimbolos();
            }
        }
    }
}
</script>
