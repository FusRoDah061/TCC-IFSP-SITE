<template lang="pug">
    div.form-middle
        h1.app-title Prancha de Comunicação
            span Online

        h2.text-center.no-mg Recuperação de senha

        form#js-frm-recuperar.form.col-md-8.offset-md-2.col-lg-6.offset-lg-3(v-on:submit="enviarEmail")

            div.form-inputs
                label(for="js-email") Digite seu e-mail cadastrado
                div.form-control.form-email.input--w-icon
                    input#js-email(v-model="email" type="email" maxlength="255" required autofocus)

            div.my-md-2.my-sm-4.my-2#recaptcha

            p.text-center.text-muted.d-none(v-bind:class="{'d-block': enviado}") Foram enviadas instruções para a definição de uma nova senha. Verifique sua caixa de entrada.

            button.btn.btn-green.my-md-2.my-sm-4.my-2.btn-block Confirmar

            router-link(to="/").btn.btn-white.my-md-2.my-sm-4.my-2.btn-block Lembrei minha senha!
            router-link(to="/cadastrar").btn.btn-white.my-md-2.my-sm-4.my-2.btn-block Não tenho uma conta
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'recuperar',
    data() {
        return {
            email: '',
            enviado: false
        }
    },
    mounted() {
        this.initReCaptcha();
    },
    methods: {
        ...mapActions (['showLoader']),
        ...mapActions ({
            showLoader: 'showLoader'  
        }),

        enviarEmail(event) {
            event.preventDefault();

            let recaptchaToken = grecaptcha.getResponse();

            if(!this.email){
                toastr.info('Informe seu e-mail cadastrado.');
                return;
            }
            else if(!recaptchaToken) {
                toastr.info('Marque a caixa "Não sou um robô".');
                return;
            }

            this.showLoader(true);

            axios({
                method: 'post',
                url: `${process.env.VUE_APP_API_URL}/senha/recuperar`,
                params: {
                    email: this.email,
                    validation: recaptchaToken
                }
            })
            .then(response =>  {
                this.showLoader(false);

                if(response.status == 200){
                    this.enviado = true;
                    toastr.info('Foram enviadas instruções para a definição de uma nova senha. Verifique sua caixa de entrada.', 'Verifique seu e-mail');
                }
            })
            .catch(error => {
                this.showLoader(false);

                if (error.response) {
                    toastr.error(error.response.data.message, 'Erro ao enviar e-mail');
                }
                else {
                    toastr.error(error.message, 'Erro ao enviar e-mail');
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
