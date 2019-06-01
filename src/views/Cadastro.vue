<template lang="pug">
    div.cadastro.form-middle
        toast(ref="toast")

        h1.app-title Prancha de Comunicação
            span Online

        h2.text-center.no-mg Cadastrar-se

        form#js-frm-cadastro.form.col-md-8.offset-md-2.col-lg-6.offset-lg-3(v-on:submit="cadastrar")

            div.form-inputs
                label(for="js-nome") Nome
                div.form-control.form-name.input--w-icon
                    input#js-nome(v-model="nome" type="text" maxlength="255" required autofocus)

            div.form-inputs
                label(for="js-email") E-mail
                div.form-control.form-email.input--w-icon
                    input#js-email(v-model="email" type="email" maxlength="255" required)

            div.form-inputs
                label(for="js-senha") Senha
                div.form-control.form-password.input--w-icon
                    input#js-senha(v-model="senha" type="password" minlength="8" maxlength="255" required)

            div.form-inputs
                label(for="js-senha-conf") Redigite sua senha
                div.form-control.form-password.input--w-icon
                    input#js-senha-conf(v-model="senhaConf" type="password" minlength="8" maxlength="255" required)

            button.btn.btn-green.my-md-2.my-sm-4.my-2.btn-block Criar minha conta

            router-link(to="/").btn.btn-white.my-md-2.my-sm-4.my-2.btn-block Já tenho uma conta
</template>

<script>
    import { Values } from '../env';

    export default {
        name: 'cadastro',
        data() {
            return {
                nome: '',
                email: '',
                senha: '',
                senhaConf: ''
            }
        },
        methods: {
            cadastrar(event) {
                event.preventDefault();

                if(!this.nome) {
                    toast.error('Informe seu nome.');
                    return;
                }
                else if(!this.email) {
                    toast.error('Informe seu e-mail.');
                    return;
                }
                else if(!this.senha) {
                    toast.error('Você deve informar uma senha.');
                    return;
                }
                else if(this.senha.length < 8){
                    toast.error('Sua senha não deve conter menos de 8 caracteres.');
                    return;
                }
                else if(this.senha != this.senhaConf) {
                    toast.error('As senhas devem ser iguais.');
                    return;
                }

                axios({
                    method: 'post',
                    url: `${Values.API_URL}/usuarios`,
                    data: {
                        nome: this.nome,
                        email: this.email,
                        senha: md5(this.senha),
                        senha_confirmation: md5(this.senhaConf)
                    },
                    header: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                .then(response =>  {
                    if(response.status == 201){
                        localStorage.usuario = JSON.stringify(response.data);
                        this.$router.push("home");
                    }
                })
                .catch(error => {
                    if (error.response) {
                        let toast = this.$refs.toast;
                        toast.error(error.response.data.message);
                    }
                });
            }
        }
    }
</script>
