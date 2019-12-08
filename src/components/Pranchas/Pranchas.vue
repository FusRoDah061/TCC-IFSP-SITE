<template lang="pug">
    div.pranchas(v-bind:class="{ 'pranchas-modal':modalView }" @click.self="closeModal")
        div.pranchas-content
            p.component-title Minhas pranchas temáticas

            div.pranchas-list-wrapper
                ul.pranchas-list
                    li.prancha.btn-nova-prancha
                        router-link.btn.btn-green(to="/app/prancha") Criar nova
                    li.prancha(v-for="prancha in pranchas" :class="{ 'prancha-selecionada': pranchaAtiva == prancha.hid }")
                        button.btn.btn-white(@click.stop="pranchaSelecionada(prancha)") {{ prancha.nome }}
                        router-link.btn.btn-blue(:to="'/app/prancha/' + prancha.hid") 
                            i.icon.ion-md-create
                        button.btn.btn-red(@click.stop="confirmarDeletar(prancha.hid)")
                            i.icon.ion-md-trash
                    li.prancha.btn-todas-pranchas(v-if="pranchas")
                        button.btn.btn-white(@click.stop="openModal") Ver todas
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'pranchas',
    data() {
        return {
            pranchas: null,
            modalView: false,
            pranchaAtiva: null
        };
    },
    mounted() {
        this.fetchPranchas();
    },
    watch: {
        pranchas: function(novoValor, antigoValor) {
            if(novoValor != null && novoValor.length <= 0)
                this.pranchas = null;
        }
    },
    methods: {
        ...mapActions (['showLoader']),
        ...mapActions ({
            showLoader: 'showLoader'  
        }),

        fetchPranchas() {
            this.showLoader(true);

            axios({
                method: 'get',
                url: `${process.env.VUE_APP_API_URL}/usuarios/${this.$store.state.usuario.hid}/pranchas`,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${this.$store.state.usuario.api_token}`
                }
            })
            .then(response => {
                this.showLoader(false);

                if(response.status == 200 && typeof(response.data) === 'object'){
                    this.pranchas = response.data;
                }
            })
            .catch(error => {
                this.showLoader(false);
                if (error.response) {
                    toastr.error(error.response.data.message, 'Erro ao obter pranchas');
                }
                else {
                    toastr.error(error.message, 'Erro ao obter pranchas');
                }
            });
        },

        confirmarDeletar(hid) {
            Swal.fire({
                title: 'Deletar prancha?',
                text: 'Tem certeza que deseja apagar essa prancha? Essa ação não pode ser desfeita.',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não',
                customClass: this.$store.state.swalConfig.customClass
            })
            .then((result) => {
                if (result.value) {
                    this.deletarPrancha(hid);
                }
            })
        },

        deletarPrancha(hid){
            this.showLoader(true);

            axios({
                method: 'delete',
                url: `${process.env.VUE_APP_API_URL}/usuarios/${this.$store.state.usuario.hid}/pranchas/${hid}`,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${this.$store.state.usuario.api_token}`
                }
            })
            .then(response => {
                this.showLoader(false);

                if(response.status == 200){
                    let i = this.pranchas.findIndex(item => item.hid === hid);
                    this.$emit('deleted', this.pranchas[i]);
                    this.pranchas.splice(i, 1);
                    toastr.success('Prancha removida');
                }
            })
            .catch(error => {
                this.showLoader(false);
                if (error.response) {
                    toastr.error(error.response.data.message, 'Erro ao deletar prancha');
                }
                else {
                    toastr.error(error.message, 'Erro ao deletar prancha');
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
            if(this.pranchaAtiva == prancha.hid) {
                this.pranchaAtiva = null;
                this.$emit('deselected', prancha);
            }
            else {
                this.pranchaAtiva = prancha.hid;
                this.$emit('selected', prancha);
            }
        }
    }
}
</script>
