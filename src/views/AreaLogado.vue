<template lang="pug">
    div.body
        cabecalho(v-if="ready")
        router-view(v-if="ready")
</template>

<script>
import AuthStorage from '../services/auth';
import { mapActions } from 'vuex';

export default {
    name: 'app',
    data() {
        return {
            ready: false
        }
    },
    methods: {
        ...mapActions (['showLoader']),
        ...mapActions ({
            showLoader: 'showLoader'  
        })
    },
    mounted() {
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
            this.ready = true;
        })
        .catch(error => {
            this.showLoader(false);
            if(error.response && error.response.status == 401) {
                AuthStorage.removeUser();
                this.$router.push("/");
            }
            else {
                this.ready = true;
            }
        });
    }
}
</script>
