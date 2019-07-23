<template lang="pug">
    div.perfil-view.row
        toast(ref="toast")
        spinner(position="center" fixed=true v-bind:show="isLoading")

        div.perfil-foto.col-12.col-md-4.col-lg-12
            img.mb-4(:src="fotoPerfil")
            p.text-center Sua imagem de perfil pode ser alterada através do 
                a(href="https://gravatar.com/" target="_blank") Gravatar 
                    i.icon.ion-md-open
        div.col-12.col-md-8.col-lg-12.row.mx-0
            div.col-md-12.col-lg-4.offset-lg-2
                form.form.p-0.pb-4(@submit.prevent="salvarInformacoesBasicas")
                    fieldset.d-flex.justify-content-end
                        legend.font-weight-bold Informações básicas

                        div.form-group
                            label(for="nome") Nome
                            div.form-control
                                input#nome(v-model="usuario.nome" type="text" maxlength="255" minlength="1" required)

                        div.form-group
                            label(for="email") E-mail
                            div.form-control
                                input#email(v-model="usuario.email" type="text" maxlength="255" minlength="3" required)

                        button.btn.btn-green.py-2.px-4.mt-4 Salvar

            div.col-12.col-md-12.col-lg-4
                form.form.p-0.pb-4(@submit.prevent="salvarSenha")
                    fieldset.d-flex
                        legend.font-weight-bold Alterar senha

                        div.form-group
                            label(for="senha-atual") Senha atual
                            div.form-control
                                input#senha-atual(v-model="senha.atual" type="password" maxlength="255" minlength="8" required)

                        div.form-group
                            label(for="nova-senha") Nova senha
                            div.form-control
                                input#nova-senha(v-model="senha.nova" type="password" maxlength="255" minlength="8" required)

                        div.form-group
                            label(for="conf-senha") Redigite sua nova senha
                            div.form-control
                                input#conf-senha(v-model="senha.confirmacao" type="password" maxlength="255" minlength="8" required)

                        div.my-4#recaptcha

                        button.btn.btn-green.py-2.px-4.align-self-end Alterar senha

</template>

<script>
export default {
    name: 'perfil',
    data() {
        return {
            toast: null,
            isLoading: false,
            usuario: null,
            senha: {
                atual: null,
                nova: null,
                confirmacao: null
            }
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.usuario);
        console.log(this.usuario);
    },
    mounted() {
        this.toast = this.$refs.toast;

        this.initReCaptcha();
    },
    computed: {
        fotoPerfil: function() {
            return this.usuario.picture + "?s=200";
        }
    },
    methods: {
        initReCaptcha() {
            this.isLoading = true;

            setTimeout(() => {
                if (typeof grecaptcha === 'undefined' && typeof grecaptcha.render ==='undefined') {
                    this.initReCaptcha();
                }
                else {
                    this.isLoading = false;

                    grecaptcha.render('recaptcha', {
                        'sitekey': process.env.VUE_APP_RECAPTCHA_KEY
                    });
                }
            }, 200);
        },

        salvarInformacoesBasicas() {
            if(!this.usuario.nome) {
                this.toast.info('Informe seu nome.');
                return;
            }
            else if(!this.usuario.email) {
                this.toast.info('Informe seu e-mail.');
                return;
            }

            this.isLoading = true;

            axios({
                method: 'put',
                url: `${process.env.VUE_APP_API_URL}/usuarios/${this.usuario.hid}`,
                data: {
                    nome: this.usuario.nome,
                    email: this.usuario.email
                },
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.usuario.api_token}`
                }
            })
            .then(response =>  {
                this.isLoading = false;

                if(response.status == 200){
                    this.toast.success("Informações atualizadas.");
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
        },

        salvarSenha() {
            console.log(this.senha);

            let recaptchaToken = grecaptcha.getResponse();

            if(!this.senha.atual) {
                this.toast.info('Informe sua senha atual.');
                return;
            }
            else if(this.senha.atual.length < 8 || this.senha.nova.length < 8) {
                toast.info('Sua senha não deve conter menos de 8 caracteres.');
                return;
            }
            else if(!this.senha.nova) {
                this.toast.info('Informe sua nova senha.');
                return;
            }
            else if(this.senha.nova !== this.senha.confirmacao) {
                this.toast.info('Sua nova senha não está igual à confirmação.');
                return;
            }
            else if(!recaptchaToken) {
                this.toast.info('Marque a caixa "Não sou um robô".');
                return;
            }

            this.isLoading = true;

            axios({
                method: 'put',
                url: `${process.env.VUE_APP_API_URL}/usuarios/${this.usuario.hid}/senha?recuperar=true&validation=${recaptchaToken}`,
                data: {
                    senhaAtual: md5(this.senha.atual),
                    senhaNova: md5(this.senha.nova)
                },
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.usuario.api_token}`
                }
            })
            .then(response =>  {
                this.isLoading = false;

                if(response.status == 200){
                    this.toast.success("Senha atualizada.");
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
