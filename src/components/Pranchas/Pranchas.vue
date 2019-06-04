<template lang="pug">
    div.pranchas
        div.pranchas-content
            p Minhas pranchas temáticas
                spinner(position="center" v-bind:show="isLoading")

            ul.pranchas-list
                li.prancha.btn-nova-prancha
                    button Criar prancha
                li.prancha(v-for="prancha in pranchas")
                    router-link(:to="'prancha/' + prancha.hid") {{ prancha.nome }}
                li.prancha.btn-todas-pranchas(v-if="pranchas")
                    button Ver todas
</template>

<script>
import { Values } from '../../env';

export default {
    name: 'pranchas',
    data() {
        return {
            pranchas: null,
            isLoading: false
        }
    },
    props: {
        usuario: String,
        auth: String
    },
    created() {

    },
    mounted() {
        this.fetchPranchas();
    },
    methods: {
        fetchPranchas() {
            this.isLoading = true;

            axios({
                method: 'get',
                url: `${Values.API_URL}/usuarios/${this.usuario}/pranchas`,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${this.auth}`
                }
            })
            .then(response => {
                this.isLoading = false;
                if(response.status == 200){
                    this.pranchas = response.data
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
        }
    }
}
</script>
