<template lang="pug">
    div.home-view
        pranchas(:usuario="usuario.hid" :auth="usuario.api_token" @selected="pranchaSelecionada")

        simbolos-board(:usuario="usuario" :prancha="prancha" :sentenca="true")

</template>

<script>
import Pranchas from "../components/Pranchas/Pranchas";
import { constants } from 'crypto';

export default {
    name: 'home',
    data() {
        return {
            usuario: null,
            prancha: null
        };
    },
    components: {
        Pranchas
    },
    created() {
        this.usuario = JSON.parse(localStorage.usuario);
    },
    methods: {
        pranchaSelecionada(prancha) {
            console.log(prancha);
            this.prancha = prancha.hid;
        }
    }
}
</script>
