<template lang="pug">
    div.login.form-middle
        toast(ref="toast")

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

    import { Values } from '../env';

    export default {
        name: 'login',
        data()  {
            return {
                loginEnabled: false,
                email: '',
                senha: ''
            }
        },
        methods: {
            login(event) {
                event.preventDefault();

                axios({
                    method: 'get',
                    url: `${Values.API_URL}/auth`,
                    params: {
                        email: this.email,
                        password: md5(this.senha)
                    },
                    header: {
                        'Accept': 'application/json'
                    }
                })
                .then(response => console.log(response))
                .catch(error => {
                    if (error.response) {
                        let toast = this.$refs.toast;

                        console.log(error.response);
                        toast.error(error.response.data.message);
                    }
                });
            }
        }
    }
</script>
