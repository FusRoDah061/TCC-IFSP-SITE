<template lang="pug">
    div.login
        h1.app-title Prancha de Comunicação
            span Online

        form#js-frm-login.form.col-md-8.offset-md-2
            div.form-inputs
                label(for="js-email") E-mail
                div.form-control.form-email.input--w-icon
                    input#js-email(type="email" maxlength="255" required autofocus)

            div.form-inputs
                label(for="js-senha") Senha
                div.form-control.form-password.input--w-icon
                    input#js-senha(type="password" maxlength="255" required)

            router-link(to="/recuperar").d-block.text-right Esqueci minha senha

            button.btn.btn-white.mt-4.mb-4.btn-block Acessar

            router-link(to="/cadastrar").d-block Não tenho uma conta
</template>
