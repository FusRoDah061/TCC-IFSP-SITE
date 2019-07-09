<template lang="pug">
    div.form-middle
        toast(ref="toast")
        spinner(position="center" fixed=true v-bind:show="isLoading")

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
    export default {
        name: 'cadastro',
        data() {
            return {
                nome: '',
                email: '',
                senha: '',
                senhaConf: '',
                toast: null,
                isLoading: false
            }
        },
        mounted() {
            this.toast = this.$refs.toast;
        },
        methods: {
            cadastrar(event) {
                event.preventDefault();

                if(!this.nome) {
                    toast.info('Informe seu nome.');
                    return;
                }
                else if(!this.email) {
                    toast.info('Informe seu e-mail.');
                    return;
                }
                else if(!this.senha) {
                    toast.info('Você deve informar uma senha.');
                    return;
                }
                else if(this.senha.length < 8){
                    toast.info('Sua senha não deve conter menos de 8 caracteres.');
                    return;
                }
                else if(this.senha != this.senhaConf) {
                    toast.info('As senhas devem ser iguais.');
                    return;
                }

                this.isLoading = true;

                axios({
                    method: 'post',
                    url: `${process.env.VUE_APP_API_URL}/usuarios`,
                    data: {
                        nome: this.nome,
                        email: this.email,
                        senha: md5(this.senha),
                        senha_confirmation: md5(this.senhaConf)
                    },
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                .then(response =>  {
                    this.isLoading = false;

                    if(response.status == 201){
                        localStorage.usuario = JSON.stringify(response.data);
                        this.$router.push("home");
                    }
                })
                .catch(error => {
                    this.isLoading = false;

                    if (error.response) {
                        this.toast.error(error.response.data.message);
                    }
                    else {
                        this.toast.error(error.message, error.stack);
                    }
                });
            }
        }
    }
</script>
