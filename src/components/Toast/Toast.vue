<template lang="pug">
    div.toast(v-bind:class="classObject")
        button.toast-close(v-on:click="close")
            i.icon.ion-md-close
        p.toast-msg {{ this.mensagem }}
        p.toast-toggle-details(v-if="detalhes" v-on:click="toggleDetails") Ver detalhes
            i.icon.ion-md-arrow-dropright(v-bind:class="{ 'rotate-45deg-right': showDetails }")
        div.toast-details(v-bind:class="{'toast-details--open': showDetails}")
            p {{ this.detalhes }}

</template>

<script>
import { setTimeout } from 'timers';

export default {
    name: "toast",
    data() {
        return {
            shown: false,
            showDetails: false,
            mensagem: null,
            detalhes: null,
            type: 'toast-default'
        }
    },
    computed: {
        classObject: function () {
            return {
                'toast--shown': this.shown,
                [this.type]: this.type
            };
        }
    },
    methods: {
        info(mensagem, detalhes = null) {
            this.show(mensagem, detalhes, 'info');
        },

        error(mensagem, detalhes = null) {
            this.show(mensagem, detalhes, 'error');
        },

        success() {
            this.show(mensagem, detalhes, 'success');
        },

        show(mensagem, detalhes = null, type = 'default') {
            this.mensagem = mensagem;
            this.detalhes = detalhes;

            this.shown = true;

            this.type = `toast-${type}`;

            setTimeout(() => {
                this.shown = false;
            }, 4000);
        },

        close() {
            this.shown = false;
        },

        toggleDetails() {
            this.showDetails = !this.showDetails;
        }
    }
};
</script>
