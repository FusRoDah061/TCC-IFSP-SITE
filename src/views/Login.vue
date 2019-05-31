<template lang="pug">
    div.login
        h1.app-title Prancha de Comunicação
            span Online

        form#js-frm-login.form.col-md-8.offset-md-2.col-lg-6.offset-lg-3
            div.form-inputs
                label(for="js-email") E-mail
                div.form-control.form-email.input--w-icon
                    input#js-email(type="email" maxlength="255" required autofocus)

            div.form-inputs
                label(for="js-senha") Senha
                div.form-control.form-password.input--w-icon
                    input#js-senha(type="password" minlength="8" maxlength="255" required)

            router-link(to="/recuperar").d-block.text-right.mb-sm-4 Esqueci minha senha

            button.btn.btn-green.mt-md-2.mb-md-2.mt-sm-4.mb-sm-4.btn-block Acessar

            router-link(to="/cadastrar").btn.btn-white.mt-md-2.mb-md-2.mt-sm-4.mb-sm-4.btn-block Não tenho uma conta
</template>
