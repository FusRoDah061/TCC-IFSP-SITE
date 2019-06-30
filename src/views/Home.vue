<template lang="pug">
    div.body
        cabecalho

        pranchas(v-bind:usuario="usuario.hid" v-bind:auth="usuario.api_token")

        simbolos-board(:usuario="usuario" :sentenca="true")

</template>

<script>
import Pranchas from "../components/Pranchas/Pranchas";

export default {
    name: 'home',
    data() {
        return {
            usuario: null
        };
    },
    components: {
        Pranchas
    },
    created() {
        this.usuario = JSON.parse(localStorage.usuario);
    }
}
</script>
