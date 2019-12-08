<template lang="pug">
    div.form-middle
        h1.app-title Prancha de Comunicação
            span Online

        form#js-frm-login.form.col-md-8.offset-md-2.col-lg-6.offset-lg-3(v-on:submit="login")
            div.form-inputs
                label(for="js-email") E-mail
                div.form-control.form-email.input--w-icon
                    input#js-email(v-model="email" type="email" maxlength="255" required autofocus)

            div.form-inputs
                label(for="js-senha") Senha
                div.form-control.form-password.input--w-icon
                    input#js-senha(v-model="senha" type="password" minlength="8" maxlength="255" required)

            router-link(to="/recuperar").d-block.text-right.mb-4 Esqueci minha senha

            button.btn.btn-green.my-md-2.my-sm-4.my-2.btn-block Acessar

            router-link(to="/cadastrar").btn.btn-white.my-md-2.my-sm-4.my-2.btn-block Não tenho uma conta
</template>

<script>
    import { mapActions } from 'vuex';
    import AuthStorage from '../services/auth';

    export default {
        name: 'login',
        data()  {
            return {
                email: '',
                senha: ''
            }
        },
        methods: {
            ...mapActions (['initUsuario', 'showLoader']),
            ...mapActions ({
                initUsuario: 'initUsuario', 
                showLoader: 'showLoader'  
            }),

            login(event) {
                event.preventDefault();

                if(!this.email) {
                    toastr.info('Informe seu e-mail.');
                    return;
                }
                else if(!this.senha) {
                    toastr.info('Você deve informar uma senha.');
                    return;
                }
                else if(this.senha.length < 8){
                    toastr.info('Sua senha não deve conter menos de 8 caracteres.');
                    return;
                }

                this.showLoader(true);

                axios({
                    method: 'get',
                    url: `${process.env.VUE_APP_API_URL}/auth`,
                    params: {
                        email: this.email,
                        password: md5(this.senha)
                    },
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    this.showLoader(false);

                    if(response.status == 200){
                        this.initUsuario(response.data);
                        AuthStorage.setUser(response.data);
                        this.$router.push("app");
                    }
                })
                .catch(error => {
                    this.showLoader(false);

                    if (error.response) {
                        toastr.error(error.response.data.message, 'Erro na autenticação');
                    }
                    else {
                        toastr.error(error.message, 'Erro na autenticação');
                    }
                });
            }
        }
    }
</script>
