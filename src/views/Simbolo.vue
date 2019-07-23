<template lang="pug">
    div.simbolo-view
        toast(ref="toast")

        spinner(position="center" fixed=true v-bind:show="isLoading")
        
        h1 Criar símbolo

        div.container.col-lg-8
            section.form-inline
                div.form-inputs
                    label(for="tit-simbolo") Nome do símbolo
                    div.form-control
                        input#tit-simbolo(v-model="simbolo.nome" type="text" maxlength="255" minlength="1" autofocus)

                button.btn.btn-green.py-2.px-4(:disabled="simboloInvalido" @click="salvarSimbolo") Salvar simbolo

            section.col-md-12.p-0
                div.col-md-12.p-0
                    fieldset
                        legend.font-weight-bold Arquivo
                        
                        label.btn.btn-green.cursor-pointer(for="arquivo") Escolher arquivo...
                        input.d-none(id="arquivo" type="file" accept=".gif, .jpg, .png, .jpeg, .mp4" @change="previewArquivo")
                        p.text-muted.mb-0 Os formatos permitidos são .jpg, .jpeg, .png, .gif, .mp4

                div.col-md-12.py-4.px-0.row
                    div.col-md-8
                        p {{ simbolo.nomeArquivo }}
                        div.d-none.simbolo-imagem.col-md-12.p-0(:class="{ 'd-flex': simbolo.tipo == simboloImagem}")
                            img(id="js-imagem-preview")
                        div.d-none.simbolo-video(:class="{ 'd-block': simbolo.tipo == simboloVideo}")
                            video.col-md-12.p-0(controls)
                                source(id="js-video-preview")
                    div.col-md-4
                        p simbolos

            section
                categorias(:auth="usuario.api_token" @selected="selecionaCategoria" apenasParaSimbolo=true)
</template>

<script>
import Categorias from "../components/Categorias/Categorias";
import FileUtils from "../util/file";
import { totalmem } from 'os';

export default {
    data() {
        return {
            isLoading: false,
            toast: null,
            usuario: null,
            showPreview: false,
            simbolo: {
                nomeArquivo: null,
                nome: null,
                hid_categoria: null,
                tipo: process.env.VUE_APP_SIMBOLO_IMAGEM
            }
        }
    },
    components: {
        Categorias
    },
    computed: {
        simboloInvalido: function() {
            return !this.simbolo.nome || !this.simbolo.hid_categoria || !this.simbolo;
        },

        simboloImagem: function() {
            return process.env.VUE_APP_SIMBOLO_IMAGEM;
        },

        simboloVideo: function () {
            return process.env.VUE_APP_SIMBOLO_VIDEO;
        }
    },
    mounted() {
        this.toast = this.$refs.toast;
    },
    created() {
        this.usuario = JSON.parse(localStorage.usuario);
    },
    methods: {
        salvarSimbolo() {
            console.log(this.simbolo);
        },

        selecionaCategoria(categoria) {
            this.simbolo.hid_categoria = categoria;
        },

        previewArquivo (event) {
            if (event.target.files && event.target.files[0]) {
                let file = event.target.files[0];
                console.log(file);

                this.showPreview = false;
                let tipo = FileUtils.getTipo(file);

                if(!tipo) {
                    this.toast.error("Arquivo inválido.", "Apenas arquivos de imagem e vídeo com as seguintes extensões são permitidos: .jpg, .jpeg, .png, .gif, .mp4");
                    event.target.value = "";
                    return;
                }

                this.simbolo.tipo = tipo;
                this.simbolo.nomeArquivo = file.name;

                switch(this.simbolo.tipo) {
                    case process.env.VUE_APP_SIMBOLO_IMAGEM:
                        if(FileUtils.toMB(file.size) > process.env.VUE_APP_IMG_FILE_SIZE_MB){
                            this.toast.error("O tamanho do arquivo ultrapassa o permitido.", "Arquivos de imagem são limitados em " + process.env.VUE_APP_IMG_FILE_SIZE_MB + "MB. Utilize um compressor como o <a href=\"https://tinyjpg.com\" target=\"_blank\">Tiny JPG</a> para reduzir o tamanho do arquivo.");
                            event.target.value = ""
                            return;
                        }

                        this.previewImagem(file);
                        break;
                    
                    case process.env.VUE_APP_SIMBOLO_VIDEO:
                        if(FileUtils.toMB(file.size) > process.env.VUE_APP_VIDEO_FILE_SIZE_MB){
                            this.toast.error("O tamanho do arquivo ultrapassa o permitido.", "Arquivos de vídeo são limitados em " + process.env.VUE_APP_VIDEO_FILE_SIZE_MB + "MB. Utilize um compressor como o <a href=\"https://www.youcompress.com/\" target=\"_blank\">YouCompress</a> para reduzir o tamanho do arquivo.");
                            event.target.value = ""
                            return;
                        }

                        this.previewVideo(file);
                        break;
                }       
                
                this.showPreview = true;
            }
        },

        previewImagem(file) {
            let reader = new FileReader();
            
            reader.onload = function(e) {
                document.getElementById('js-imagem-preview').src = e.target.result;
            }
            
            reader.readAsDataURL(file);
        },

        previewVideo(file) {
            let blobURL = URL.createObjectURL(file);
            let source = document.getElementById('js-video-preview');
            source.src = blobURL;
            source.parentElement.load();
        }
    }
}
</script>
