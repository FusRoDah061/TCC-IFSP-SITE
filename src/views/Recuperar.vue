<template lang="pug">
    div.login
        h1.app-title Prancha de Comunicação
            span Online

        h2.text-center.no-mg Recuperação de senha

        form#js-frm-recuperar.form.col-md-8.offset-md-2.col-lg-6.offset-lg-3

            div.form-inputs
                label(for="js-email") Digite seu e-mail cadastrado
                div.form-control.form-email.input--w-icon
                    input#js-email(type="email" maxlength="255" required autofocus)

            p.text-center.text-muted Foram enviadas instruções para a definição de uma nova senha. Verifique sua caixa de entrada.

            div.g-recaptcha(data-sitekey="6Lf2baYUAAAAADyhVMO1-BWawCloaD_ywRehnqwt")

            button.btn.btn-green.mt-md-2.mb-md-2.mt-sm-4.mb-sm-4.btn-block Confirmar

            router-link(to="/").btn.btn-white.mt-md-2.mb-md-2.mt-sm-4.mb-sm-4.btn-block Lembrei minha senha!
            router-link(to="/cadastrar").btn.btn-white.mt-md-2.mb-md-2.mt-sm-4.mb-sm-4.btn-block Não tenho uma conta
</template>
