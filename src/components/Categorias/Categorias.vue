<template lang="pug">
    div.categorias
        p.component-title Categorias de símbolos

        ul.categorias-list
            li.categoria.btn-todos-simbolos(v-if="categorias && !apenasParaSimbolo" v-bind:class="{ 'categoria--selected': (categoriaSelecionada == process.env.VUE_APP_CATEGORIA_TODOS) }")
                button(v-on:click="todosSimbolos") Todos os símbolos
            li.categoria(v-for="(categoria, i) in categorias" :key="categoria.hid" v-bind:class="{ 'categoria--selected': (categoriaSelecionada && categoriaSelecionada.hid == categoria.hid) }")
                button(v-on:click="disparaCategoria(categoria)" v-bind:style="{ 'background-color':categoria.cor, 'border-color':escurecerCor(categoria.cor), 'color':contraste(categoria.cor) }") {{ categoria.nome }}
            li.categoria.btn-todos-simbolos(v-if="categorias && !apenasParaSimbolo" v-bind:class="{ 'categoria--selected': (categoriaSelecionada == process.env.VUE_APP_CATEGORIA_MEUS) }")
                button(v-on:click="meusSimbolos") Meus símbolos
</template>

<script>
import ColorUtils from '../../util/color';
import { mapActions } from 'vuex';

export default {
    name:'categorias',
    data() {
        return {
            categorias: null,
            categoriaSelecionada: null
        };
    },
    props: {
        auth: String,
        apenasParaSimbolo: Boolean
    },
    mounted() {
        this.fetchCategorias();
        this.todosSimbolos();
    },
    methods: {
        ...mapActions (['showLoader']),
        ...mapActions ({
            showLoader: 'showLoader'  
        }),

        fetchCategorias() {
            this.showLoader(true);

            axios({
                method: 'get',
                url: `${process.env.VUE_APP_API_URL}/categorias`,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${this.$store.state.usuario.api_token}`
                }
            })
            .then(response => {
                this.showLoader(false);

                if(response.status == 200 && typeof(response.data) === 'object'){
                    this.categorias = response.data;

                    let categoria = process.env.VUE_APP_CATEGORIA_TODOS;

                    if(this.apenasParaSimbolo)
                        categoria = response.data[0];

                    this.categoriaSelecionada = categoria;

                    this.$emit('selected', categoria);
                }
            })
            .catch(error => {
                this.showLoader(false);
                if (error.response) {
                    toastr.error(error.response.data.message, 'Erro ao obter categorias');
                }
                else {
                    toastr.error(error.message, 'Erro ao obter categorias');
                }
            });
        },

        meusSimbolos() {
            if(this.apenasParaSimbolo) return;

            this.categoriaSelecionada = process.env.VUE_APP_CATEGORIA_MEUS;
            this.$emit('selected', process.env.VUE_APP_CATEGORIA_MEUS);
        },

        todosSimbolos() {
            if(this.apenasParaSimbolo) return;

            this.categoriaSelecionada = process.env.VUE_APP_CATEGORIA_TODOS;
            this.$emit('selected', process.env.VUE_APP_CATEGORIA_TODOS);
        },

        disparaCategoria(categoria) {
            this.categoriaSelecionada = categoria;
            this.$emit('selected', categoria);
        },

        escurecerCor(cor) {
            return ColorUtils.lightenDarkenColor(-.15, cor);
        },

        contraste(cor){
            return ColorUtils.higherContrast(cor);
        }
    }
}
</script>
