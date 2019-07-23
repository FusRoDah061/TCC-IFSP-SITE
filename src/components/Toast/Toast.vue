<template lang="pug">
    div.toast(v-bind:class="classObject")
        button.toast-close(v-on:click="close")
            i.icon.ion-md-close
        p.toast-msg {{ mensagem }}
        p.toast-toggle-details(v-if="detalhes" v-on:click="toggleDetails") Ver detalhes
            i.icon.ion-md-arrow-dropright(v-bind:class="{ 'rotate-45deg-right': showDetails }")
        div.toast-details(v-bind:class="{'toast-details--open': showDetails}")
            p(v-html="detalhes")

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
            type: 'toast-default',
            closeCallback: null
        }
    },
    computed: {
        classObject() {
            return {
                'toast--shown': this.shown,
                [this.type]: this.type
            };
        }
    },
    methods: {
        info(mensagem, detalhes = null, callback = null) {
            this.show(mensagem, detalhes, 'info', callback);
        },

        error(mensagem, detalhes = null, callback = null) {
            this.show(mensagem, detalhes, 'error', callback);
        },

        success(mensagem, detalhes = null, callback = null) {
            this.show(mensagem, detalhes, 'success', callback);
        },

        show(mensagem, detalhes = null, type = 'default', callback = null) {
            this.mensagem = mensagem;
            this.detalhes = detalhes;

            this.shown = true;

            this.type = `toast-${type}`;

            this.closeCallback = callback;

            setTimeout(() => {
                this.close();
            }, 4000);
        },

        close() {
            this.shown = false;

            setTimeout(() => {
                this.mensagem = '';
                this.detalhes = '';
                this.showDetails = false;

                if(this.closeCallback != null){
                    this.closeCallback();
                }
            }, 500);
        },

        toggleDetails() {
            this.showDetails = !this.showDetails;
        }
    }
};
</script>
