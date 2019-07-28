<template lang="pug">
    div.pranchas(v-bind:class="{ 'pranchas-modal':modalView }" @click.self="closeModal")
        div.pranchas-content
            p Minhas pranchas temáticas
                spinner(position="text" v-bind:show="isLoading")

            div.pranchas-list-wrapper
                ul.pranchas-list
                    li.prancha.btn-nova-prancha
                        router-link.btn.btn-green(to="/app/prancha") Criar nova
                    li.prancha(v-for="prancha in pranchas" :class="{ 'prancha-selecionada': pranchaAtiva == prancha.hid }")
                        button.btn.btn-white(@click.stop="pranchaSelecionada(prancha)") {{ prancha.nome }}
                        router-link.btn.btn-blue(:to="'/app/prancha/' + prancha.hid") 
                            i.icon.ion-md-create
                        button.btn.btn-red(@click.stop="deletarPrancha(prancha.hid)")
                            i.icon.ion-md-trash
                    li.prancha.btn-todas-pranchas(v-if="pranchas")
                        button.btn.btn-white(@click.stop="openModal") Ver todas
</template>

<script>
export default {
    name: 'pranchas',
    data() {
        return {
            pranchas: null,
            isLoading: false,
            modalView: false,
            pranchaAtiva: null
        };
    },
    mounted() {
        this.fetchPranchas();
    },
    methods: {
        fetchPranchas() {
            this.isLoading = true;

            axios({
                method: 'get',
                url: `${process.env.VUE_APP_API_URL}/usuarios/${this.$store.state.usuario.hid}/pranchas`,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${this.$store.state.usuario.api_token}`
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

        deletarPrancha(hid){
            this.isLoading = true;

            axios({
                method: 'delete',
                url: `${process.env.VUE_APP_API_URL}/usuarios/${this.$store.state.usuario.hid}/pranchas/${hid}`,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${this.$store.state.usuario.api_token}`
                }
            })
            .then(response => {
                this.isLoading = false;

                if(response.status == 200){
                    let i = this.pranchas.findIndex(item => item.hid === hid);
                    this.pranchas.splice(i, 1);
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

        openModal () {
            this.modalView = true;
        },

        closeModal() {
            if(this.modalView)
                this.modalView = false;
        },

        pranchaSelecionada(prancha){
            this.pranchaAtiva = prancha.hid;
            this.$emit('selected', prancha);
        }
    }
}
</script>
