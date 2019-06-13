<template lang="pug">
    div.categorias
        p Categorias de símbolos
            spinner(position="center" v-bind:show="isLoading")

        ul.categorias-list
            li.categoria(v-for="(categoria, i) in categorias")
                button(v-on:click="disparaCategoria(i)" v-bind:style="{ 'background-color':categoria.cor, 'border-color':escurecerCor(categoria.cor), 'color':contraste(categoria.cor) }") {{ categoria.nome }}
            li.categoria.btn-todos-simbolos(v-if="categorias")
                button(v-on:click="meusSimbolos") Meus símbolos
</template>

<script>
import { Values } from '../../env';
import ColorUtil from '../../util/color';
import ColorUtils from '../../util/color';

export default {
    name:'categorias',
    data() {
        return {
            categorias: null,
            isLoading: false
        };
    },
    props: {
        auth: String
    },
    mounted() {
        this.fetchCategorias();
    },
    methods: {
        fetchCategorias() {
            this.isLoading = true;

            axios({
                method: 'get',
                url: `${Values.API_URL}/categorias`,
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
            this.$emit('selected', 'meus');
        },

        disparaCategoria(indice) {
            let categoria = this.categorias[indice];
            this.$emit('selected', categoria.hid);
        },

        escurecerCor(cor) {
            return ColorUtil.lightenDarkenColor(-.15, cor);
        },

        contraste(cor){
            return ColorUtils.higherContrast(cor);
        }
    }
}
</script>
