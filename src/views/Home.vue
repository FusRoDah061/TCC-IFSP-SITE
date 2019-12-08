<template lang="pug">
    div.home-view
        pranchas(@selected="pranchaSelecionada" @deselected="pranchaDeselecionada" @deleted="pranchaDeselecionada")

        simbolos-board(:prancha="prancha" :sentenca="true")
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
        },

        pranchaDeselecionada(prancha) {
            if(this.prancha == prancha.hid)
                this.prancha = null;
        },
    }
}
</script>
