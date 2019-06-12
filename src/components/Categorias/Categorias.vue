<template lang="pug">
    div.categorias
        p Categorias de símbolos
            spinner(position="center" v-bind:show="isLoading")

            ul.categorias-list
                li.categoria(v-for="(categoria, i) in categorias")
                    button(v-on:click="disparaCategoria(i)") {{ categoria.nome }}
                li.categoria.btn-todos-simbolos(v-if="categorias")
                    button(v-on:click="meusSimbolos") Meus símbolos
</template>

<script>
import { Values } from '../../env';

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

                if(response.status == 200){
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

        meusSimbolos(){
            console.log('Meus símbolos');
        },

        disparaCategoria(indice) {
            let categoria = this.categorias[indice];
            console.log(categoria);
        }
    }
}
</script>
