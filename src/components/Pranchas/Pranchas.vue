<template lang="pug">
    div.pranchas(v-bind:class="{ 'pranchas-modal':modalView }" v-on:click="toggleModal")
        div.pranchas-content
            p Minhas pranchas temáticas
                spinner(position="text" v-bind:show="isLoading")

            div.pranchas-list-wrapper
                ul.pranchas-list
                    li.prancha.btn-nova-prancha
                        router-link.btn.btn-green(to="/app/prancha") Criar nova
                    li.prancha(v-for="prancha in pranchas")
                        router-link.btn.btn-white(:to="'/app/prancha/' + prancha.hid") {{ prancha.nome }}
                    li.prancha.btn-todas-pranchas(v-if="pranchas")
                        button.btn.btn-white(v-on:click="toggleModal") Ver todas
</template>

<script>
export default {
    name: 'pranchas',
    data() {
        return {
            pranchas: null,
            isLoading: false,
            modalView: false
        };
    },
    props: {
        usuario: String,
        auth: String
    },
    mounted() {
        this.fetchPranchas();
    },
    methods: {
        fetchPranchas() {
            this.isLoading = true;

            axios({
                method: 'get',
                url: `${process.env.VUE_APP_API_URL}/usuarios/${this.usuario}/pranchas`,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${this.auth}`
                }
            })
            .then(response => {
                this.isLoading = false;

                if(response.status == 200 && typeof(response.data) === 'object'){
                    this.pranchas = response.data;
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

        toggleModal(event) {
            event.stopPropagation();
            this.modalView = !this.modalView;
        }
    }
}
</script>
