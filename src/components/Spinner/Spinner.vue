<template lang="pug">
    div.spinner(v-bind:class="getClasses")
        div.spinner-border.text-dark(role="status")
            span.sr-only Carregando...
</template>

<script>
export default {

    name: 'spinner',
    props: {
        position: String,
        fixed: Boolean,
        show: Boolean
    },
    computed: {
        getClasses () {
            let position = this.position || 'center';

            return {
                [`text-${position}`]: position,
                'spinner--shown': this.show,
                'spinner--fixed': this.fixed
            };
        }
    }
}
</script>
