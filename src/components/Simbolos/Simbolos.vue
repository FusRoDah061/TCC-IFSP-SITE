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
            li.simbolo(v-for="(simbolo, i) in simbolos" @click="simboloSeleciondo(i)" v-bind:style="{ 'background-color':simbolo.categoria.cor, 'border-color':escurecerCor(simbolo.categoria.cor), 'color':contraste(simbolo.categoria.cor) }")
                div.simbolo-content
                    img.simbolo-icone(v-bind:src="getUrlIcone(simbolo)")
                    p.simbolo-palavra {{ simbolo.nome }}

            li.simbolos-load-more
                spinner(position="center" v-bind:show="isLoading")
</template>

<script>
import { Values } from '../../env';
import ColorUtil from '../../util/color';
import ColorUtils from '../../util/color';

//TODO: Por performance, manter as categorias em cache assim que forem buscadas, junto das cores já calculadas, para não calcular denovo toda hora.

export default {
    name: 'simbolos',
    data() {
        return {
            simbolos: null,
            pagina: 1,
            isLoading: true,
            busca: null
        }
    },
    props: {
        usuario: String,
        auth: String,
        prancha: String,
        categoria: String
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

                if(response.status == 200 && typeof(response.data) === 'object'){
                    this.simbolos = response.data || [];
                }

            })
            .catch(error => {
                this.isLoading = false;
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
            return ColorUtil.lightenDarkenColor(-.15, cor);
        },

        contraste(cor){
            return ColorUtils.higherContrast(cor);
        }
    },
    watch: {
        categoria: function(novoValor, antigoValor) {
            if(novoValor && novoValor != antigoValor)
                this.carregarSimbolos();
        }
    }
}
</script>
