<template lang="pug">
    div.simbolo(:class="{ 'simbolo-deletable':removable, 'd-none': deleted}" :style="{ 'background-color':simbolo.categoria.cor, 'border-color':escurecerCor(simbolo.categoria.cor), 'color':contraste(simbolo.categoria.cor) }")
        button.btn-deletar(v-if="deletable && isUsuario" @click.stop="confirmarDeletar")
            i.icon.ion-md-trash

        div.simbolo-content
            span.simbolo-indice(v-if="simbolo.indice") {{simbolo.indice}}
            img.simbolo-icone(:src="(preview) ? simbolo.imagem : urlIcone")
            p.simbolo-palavra {{ simbolo.nome }}
</template>

<script>
import ColorUtils from '../../util/color';
import { mapActions } from 'vuex';

export default {
    name: 'simbolo',
    data() {
        return {
            deleted: false
        }
    },
    props: {
        simbolo: Object,
        deletable: Boolean,
        removable: Boolean,
        preview: Boolean
    },
    computed: {
        isUsuario: function() {
            return this.simbolo.arquivo && this.simbolo.arquivo.includes('users');
        },

        urlIcone(){ 
            if(this.simbolo.tipo == process.env.VUE_APP_SIMBOLO_IMAGEM && this.simbolo.arquivo) {
                return this.simbolo.arquivo;
            }
            else if(this.simbolo.tipo == process.env.VUE_APP_SIMBOLO_VIDEO) {
                let position = this.simbolo.arquivo.lastIndexOf('/');
                let url = [this.simbolo.arquivo.slice(0, position), '/thumbnails', this.simbolo.arquivo.slice(position)].join('').replace('mp4', 'jpeg');
                return url;
            }
        }
    },
    methods: {
        ...mapActions (['showLoader']),
        ...mapActions ({
            showLoader: 'showLoader'  
        }),

        escurecerCor(cor) {
            return ColorUtils.lightenDarkenColor(-.15, cor);
        },

        contraste(cor){
            return ColorUtils.higherContrast(cor);
        },

        confirmarDeletar() {
            Swal.fire({
                title: 'Deletar símbolo?',
                text: 'Tem certeza que deseja apagar esse símbolo? Essa ação não pode ser desfeita.',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não',
                customClass: this.$store.state.swalConfig.customClass
            })
            .then((result) => {
                if (result.value) {
                    this.apagarSimbolo();
                }
            });
        },

        apagarSimbolo() {
            if(!this.deletable) return;

            this.showLoader(true);

            axios({
                method: 'delete',
                url: `${process.env.VUE_APP_API_URL}/usuarios/${this.$store.state.usuario.hid}/simbolos/${this.simbolo.hid}`,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${this.$store.state.usuario.api_token}`
                }
            })
            .then(response => {
                this.showLoader(false);

                if(response.status == 200){
                    this.deleted = true;
                    this.$emit('deleted', this.simbolo);
                }
            })
            .catch(error => {
                this.showLoader(false);
                if (error.response) {
                    toastr.error(error.response.data.message, 'Erro ao deletar símbolo');
                }
                else {
                    toastr.error(error.message, 'Erro ao deletar símbolo');
                }
            });
        }
    }
}
</script>
