<template lang="pug">
    div.simbolo(:class="{ 'simbolo-deletable':deletable, 'd-none': deleted}" :style="{ 'background-color':simbolo.categoria.cor, 'border-color':escurecerCor(simbolo.categoria.cor), 'color':contraste(simbolo.categoria.cor) }")
        button.btn-deletar(v-if="!deletable && isUsuario" @click.stop="deletar")
            i.icon.ion-md-trash

        div.simbolo-content
            span.simbolo-indice(v-if="simbolo.indice") {{simbolo.indice}}
            img.simbolo-icone(:src="(preview) ? simbolo.imagem : urlIcone")
            p.simbolo-palavra {{ simbolo.nome }}
</template>

<script>
import ColorUtils from '../../util/color';

export default {
    name: 'simbolo',
    data() {
        return {
            isLoading: false,
            deleted: false
        }
    },
    props: {
        simbolo: Object,
        deletable: Boolean,
        preview: Boolean
    },
    computed: {
        isUsuario: function() {
            return this.simbolo.arquivo && this.simbolo.arquivo.includes('users');
        },

        urlIcone(){ 
            if(this.simbolo.tipo == process.env.VUE_APP_SIMBOLO_IMAGEM && this.simbolo.arquivo) {
                if(this.simbolo.arquivo.includes("users")) {
                    return `${process.env.VUE_APP_IMAGEM_URL}/${this.simbolo.arquivo}?api_token=${this.$store.state.usuario.api_token}`;
                }
                else {
                    return `${process.env.VUE_APP_IMAGEM_URL}/${this.simbolo.arquivo}`;
                }
            }
            else if(this.simbolo.tipo == process.env.VUE_APP_SIMBOLO_VIDEO) {
                let position = this.simbolo.arquivo.lastIndexOf('/');
                let url = [this.simbolo.arquivo.slice(0, position), '/thumbnails', this.simbolo.arquivo.slice(position)].join('').replace('mp4', 'jpeg');
                return `${process.env.VUE_APP_IMAGEM_URL}/${url}?api_token=${this.$store.state.usuario.api_token}`;
            }
        }
    },
    methods: {
        escurecerCor(cor) {
            return ColorUtils.lightenDarkenColor(-.15, cor);
        },

        contraste(cor){
            return ColorUtils.higherContrast(cor);
        },

        deletar() {
            // TODO: Confirmar remoção
            this.isLoading = true;

            axios({
                method: 'delete',
                url: `${process.env.VUE_APP_API_URL}/usuarios/${this.$store.state.usuario.hid}/simbolos/${this.simbolo.hid}`,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${this.$store.state.usuario.api_token}`
                }
            })
            .then(response => {
                this.isLoading = false;

                if(response.status == 200){
                    this.deleted = true;
                    this.$emit('deleted', this.simbolo);
                }
            })
            .catch(error => {
                this.isLoading = false;
                if (error.response) {
                    console.log(error.response.data.message);
                }
                else {
                    console.log(error.message, error.stack);
                }
            });
        }
    }
}
</script>
