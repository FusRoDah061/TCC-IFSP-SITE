<template lang="pug">
    div.login
        h1.app-title Prancha de Comunicação
            span Online

        h2.text-center.no-mg Recuperação de senha

        form#js-frm-recuperar.form.col-md-8.offset-md-2.col-lg-6.offset-lg-3

            div.form-inputs
                label(for="js-senha") Nova senha
                div.form-control.form-password.input--w-icon
                    input#js-senha(type="password" minlength="8" maxlength="255" required)

            div.form-inputs
                label(for="js-senha") Redigite a nova senha
                div.form-control.form-password.input--w-icon
                    input#js-senha(type="password" minlength="8" maxlength="255" required)

            div.g-recaptcha.my-md-2.my-sm-4.my-2(data-sitekey="6Lf2baYUAAAAADyhVMO1-BWawCloaD_ywRehnqwt")

            button.btn.btn-green.my-md-2.my-sm-4.my-2.btn-block Confirmar nova senha
</template>
