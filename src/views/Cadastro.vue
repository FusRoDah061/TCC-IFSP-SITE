<template lang="pug">
    div.cadastro
        h1.app-title Prancha de Comunicação
            span Online

        h2.text-center.no-mg Cadastrar-se

        form#js-frm-cadastro.form.col-md-8.offset-md-2.col-lg-6.offset-lg-3

            div.form-inputs
                label(for="js-nome") Nome
                div.form-control.form-name.input--w-icon
                    input#js-nome(type="text" maxlength="255" required autofocus)

            div.form-inputs
                label(for="js-email") E-mail
                div.form-control.form-email.input--w-icon
                    input#js-email(type="email" maxlength="255" required autofocus)

            div.form-inputs
                label(for="js-senha") Senha
                div.form-control.form-password.input--w-icon
                    input#js-senha(type="password" minlength="8" maxlength="255" required)

            div.form-inputs
                label(for="js-senha-conf") Redigite sua senha
                div.form-control.form-password.input--w-icon
                    input#js-senha-conf(type="password" minlength="8" maxlength="255" required)

            button.btn.btn-green.my-md-2.my-sm-4.my-2.btn-block Criar minha conta

            router-link(to="/").btn.btn-white.my-md-2.my-sm-4.my-2.btn-block Já tenho uma conta
</template>
