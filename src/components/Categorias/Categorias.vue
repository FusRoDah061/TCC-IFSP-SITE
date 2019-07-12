<template lang="pug">
    div.categorias
        p Categorias de símbolos
            spinner(position="text" v-bind:show="isLoading")

        ul.categorias-list
            li.categoria.btn-todos-simbolos(v-if="categorias" v-bind:class="{ 'categoria--selected': (categoriaSelecionada == 'todos') }")
                button(v-on:click="todosSimbolos") Todos os símbolos
            li.categoria(v-for="(categoria, i) in categorias" :key="categoria.hid" v-bind:class="{ 'categoria--selected': (categoriaSelecionada == categoria.hid) }")
                button(v-on:click="disparaCategoria(categoria.hid)" v-bind:style="{ 'background-color':categoria.cor, 'border-color':escurecerCor(categoria.cor), 'color':contraste(categoria.cor) }") {{ categoria.nome }}
            li.categoria.btn-todos-simbolos(v-if="categorias" v-bind:class="{ 'categoria--selected': (categoriaSelecionada == 'meus') }")
                button(v-on:click="meusSimbolos") Meus símbolos
</template>

<script>
import ColorUtils from '../../util/color';

export default {
    name:'categorias',
    data() {
        return {
            categorias: null,
            isLoading: false,
            categoriaSelecionada: null
        };
    },
    props: {
        auth: String
    },
    mounted() {
        this.fetchCategorias();
        this.todosSimbolos();
    },
    methods: {
        fetchCategorias() {
            this.isLoading = true;

            axios({
                method: 'get',
                url: `${process.env.VUE_APP_API_URL}/categorias`,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${this.auth}`
                }
            })
            .then(response => {
                this.isLoading = false;

                if(response.status == 200 && typeof(response.data) === 'object'){
                    this.categorias = response.data;
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

        meusSimbolos() {
            this.categoriaSelecionada = 'meus';
            this.$emit('selected', 'meus');
        },

        todosSimbolos() {
            this.categoriaSelecionada = 'todos';
            this.$emit('selected', 'todos');
        },

        disparaCategoria(hid) {
            this.categoriaSelecionada = hid;
            this.$emit('selected', hid);
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
