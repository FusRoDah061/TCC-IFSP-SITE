<template lang="pug">
    header.page-header
        button.btn-menu(v-on:click="toggleMenu")
            i.icon.ion-md-menu

        div.sidemenu-overlay(v-on:click="toggleMenu" v-bind:class="{ 'sidemenu-overlay--open': isMenuOpen }")
        div.sidemenu(v-bind:class="{ 'sidemenu--open': isMenuOpen }")
            button.sidemenu-close(v-on:click="toggleMenu")
                i.icon.ion-md-close

            div.sidemenu-head
                img(v-bind:src="imagem")
                p {{ nome }}

            ul.sidemenu-list
                li.sidemenu-item(@click="toggleMenu")
                    router-link(to="/app") Início
                li.sidemenu-item.item--divider
                li.sidemenu-item(@click="toggleMenu")
                    router-link(to="/app/prancha") Criar prancha
                li.sidemenu-item(@click="toggleMenu")
                    router-link(to="/app/simbolo") Criar símbolo
                li.sidemenu-item.item--divider
                li.sidemenu-item(@click="toggleMenu")
                    router-link(to="/app/perfil") Minha conta
                li.sidemenu-item.item--divider
                li.sidemenu-item(@click="toggleMenu")
                    p(v-on:click="logout") Sair
</template>

<script>
import AuthStorage from '../../services/auth';

export default {
    name: 'cabecalho',
    data() {
        return {
            isMenuOpen: false
        }
    },
    methods: {
        logout() {
            AuthStorage.removeUser();
            this.$router.push("/");
        },
        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen;
        }
    },
    computed: {
        imagem() {
            return JSON.parse(localStorage.usuario).picture + '?s=75';
        },
        nome() {
            return JSON.parse(localStorage.usuario).nome;
        }
    }
}
</script>
