<template lang="pug">
    div.form-middle
        h1.app-title Prancha de Comunicação
            span Online

        h2.text-center.no-mg Recuperação de senha

        form#js-frm-recuperar.form.col-md-8.offset-md-2.col-lg-6.offset-lg-3(v-on:submit="atualizarSenha")

            div.form-inputs
                label(for="js-senha") Nova senha
                div.form-control.form-password.input--w-icon
                    input#js-senha(v-model="novaSenha" type="password" minlength="8" maxlength="255" required autofocus)

            div.form-inputs
                label(for="js-senha") Redigite a nova senha
                div.form-control.form-password.input--w-icon
                    input#js-senha-conf(v-model="novaSenhaConf" type="password" minlength="8" maxlength="255" required)

            div.my-md-2.my-sm-4.my-2#recaptcha

            button.btn.btn-green.my-md-2.my-sm-4.my-2.btn-block(v-bind:disabled="!pedidoValido") Confirmar nova senha
</template>

<script>
import { setTimeout } from 'timers';
import { mapActions } from 'vuex';

export default {
    name: 'senha',
    data() {
        return {
            novaSenha: '',
            novaSenhaConf: '',
            pedidoValido: false,
            usuario: null
        }
    },
    mounted() {
        this.initReCaptcha();
        this.verificarPedido();
    },
    methods: {
        ...mapActions (['showLoader']),
        ...mapActions ({
            showLoader: 'showLoader'  
        }),

        atualizarSenha(event) {
            event.preventDefault();

            if(!this.pedidoValido){
                toastr.error('O pedido de recuperação se senha não é mais válido.');
                return;
            }

            let recaptchaToken = grecaptcha.getResponse();

            if(!this.novaSenha){
                toastr.info('Informe sua nova senha.');
                return;
            }
            else if(this.novaSenha.length < 8){
                toastr.info('Sua senha não deve conter menos de 8 caracteres.');
                return;
            }
            else if(this.novaSenhaConf != this.novaSenha){
                toastr.info('As senhas devem ser iguais.');
                return;
            }
            else if(!recaptchaToken) {
                toastr.info('Marque a caixa "Não sou um robô".');
                return;
            }

            this.showLoader(true);

            axios({
                method: 'put',
                url: `${process.env.VUE_APP_API_URL}/usuarios/${this.usuario.hid}/senha`,
                params: {
                    recuperar: true,
                    validation: recaptchaToken
                },
                headers: {
                    'Authorization': `Bearer ${this.usuario.api_token}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    senhaNova: md5(this.novaSenha)
                }
            })
            .then(response =>  {
                this.showLoader(false);

                if(response.status == 200){
                    toastr.success('Senha alterada com sucesso! Você já pode fazer login.');
                    setTimeout(() => {
                        this.$router.push("/");
                    }, 500);
                }
            })
            .catch(error => {
                this.showLoader(false);

                if (error.response) {
                    toastr.error(error.response.data.message, 'Erro ao alterar senha');
                }
                else {
                    toastr.error(error.message, 'Erro ao alterar senha');
                }
            });
        },

        verificarPedido(){
            let tokenPedido = this.$route.params.pedido;

            this.showLoader(true);

            axios({
                method: 'get',
                url: `${process.env.VUE_APP_API_URL}/senha/recuperar/${tokenPedido}`,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response =>  {
                this.showLoader(false);

                if(response.status == 200){
                    this.usuario = response.data;
                    this.pedidoValido = true;
                }
            })
            .catch(error => {
                this.showLoader(false);

                if (error.response) {
                    toastr.error(error.response.data.message, 'Erro na solicitação');
                }
                else {
                    toastr.error(error.message, 'Erro na solicitação');
                }
            });
        },

        initReCaptcha() {
            this.showLoader(true);

            setTimeout(() => {
                if (typeof grecaptcha === 'undefined' && typeof grecaptcha.render ==='undefined') {
                    this.initReCaptcha();
                }
                else {
                    this.showLoader(false);

                    grecaptcha.render('recaptcha', {
                        'sitekey': process.env.VUE_APP_RECAPTCHA_KEY
                    });
                }
            }, 200);
        }
    }
}
</script>
