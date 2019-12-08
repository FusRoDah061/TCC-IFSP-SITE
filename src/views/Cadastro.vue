<template lang="pug">
    div.form-middle
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
    import { mapActions } from 'vuex';
    import AuthStorage from '../services/auth';
    
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
            ...mapActions (['initUsuario', 'showLoader']),
            ...mapActions ({
                initUsuario: 'initUsuario', 
                showLoader: 'showLoader'  
            }),

            cadastrar(event) {
                event.preventDefault();

                if(!this.nome) {
                    toastr.info('Informe seu nome.');
                    return;
                }
                else if(!this.email) {
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
                else if(this.senha != this.senhaConf) {
                    toastr.info('As senhas devem ser iguais.');
                    return;
                }

                this.showLoader(true);

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
                    this.showLoader(false);

                    if(response.status == 201){
                        this.initUsuario(response.data);
                        AuthStorage.setUser(response.data);
                        this.$router.push("app");
                    }
                })
                .catch(error => {
                    this.showLoader(false);

                    if (error.response) {
                        toastr.error(error.response.data.message, 'Erro ao cadastrar usuário');
                    }
                    else {
                        toastr.error(error.message, 'Erro ao cadastrar usuário');
                    }
                });
            }
        }
    }
</script>
