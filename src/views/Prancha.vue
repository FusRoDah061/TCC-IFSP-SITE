<template lang="pug">
    section.prancha-view

        h1 {{ tituloPagina }}

        section.form-inline
            div.form-inputs
                label(for="tit-prancha") Título da prancha
                div.form-control
                    input#tit-prancha(v-model="pranchaObj.nome" type="text" maxlength="255" minlength="1" autofocus)

            button.btn.btn-green(:disabled="pranchaInvalida" @click="salvarPrancha") Salvar prancha
        
        section.simbolos-add-container
            p.mb-0.mt-4 Símbolos adicionados
            p.text-muted Clique em um símbolo para remover da prancha.

            ul.simbolos-add.p-2
                li.list-style-none(v-for="(simbolo, i) in pranchaObj.simbolos")
                    simbolo.simbolo-sm(:key="simbolo.hid" :simbolo="simbolo" @click.native.stop="simboloRemover(simbolo)" :removable="true")

        section
            h2.mb-0.mt-4 Símbolos disponíveis
            categorias(@selected="mudaCategoria")
            simbolos(:categoria="categoria" :sentenca="false" @selected="simboloSelecionado")
</template>

<script>
import Categorias from "../components/Categorias/Categorias";
import Simbolos from "../components/Simbolos/Simbolos";
import { mapActions } from 'vuex';

export default {
    name: 'prancha',
    data() {
        return {
            pranchaObj: {
                nome: null,
                simbolos: []
            },
            editar: false,
            categoria: null,
            isLoading: false
        }
    },
    components: {
        Categorias, Simbolos
    },
    mounted() {
        if(this.$route.params.prancha) {
            this.editar = true;
            this.fetchPrancha(this.$route.params.prancha);
        }
    },
    computed: {
        tituloPagina: function() {
            if(this.editar)
                if(this.isLoading)
                    return 'Aguarde, buscando prancha...';
                else if(this.pranchaObj.nome)
                    return `Editar prancha ${this.pranchaObj.nome}`;
                else
                    this.editar = false;

            return 'Criar nova prancha';
        },

        pranchaInvalida() {
            return !this.pranchaObj || 
                !this.pranchaObj.nome || 
                !this.pranchaObj.simbolos ||
                this.pranchaObj.simbolos.length <= 0;
        }
    },
    methods: {
        ...mapActions (['showLoader']),
        ...mapActions ({
            showLoader: 'showLoader'  
        }),

        fetchPrancha(hid) {
            this.showLoader(true);
            this.isLoading = true;

            axios({
                method: 'get',
                url: `${process.env.VUE_APP_API_URL}/usuarios/${this.$store.state.usuario.hid}/pranchas/${hid}`,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${this.$store.state.usuario.api_token}`
                }
            })            
            .then(response =>  {
                this.showLoader(false);
                this.isLoading = false;

                if(response.status == 200 && typeof(response.data) === 'object'){
                    this.pranchaObj = response.data;
                }
            })
            .catch(error => {
                this.showLoader(false);
                this.isLoading = false;

                if (error.response) {
                    toastr.error(error.response.data.message, 'Erro ao criar prancha');
                }
                else {
                    toastr.error(error.message, 'Erro ao criar prancha');
                }
            });
        },

        simboloSelecionado(simbolo) {
            if(!this.pranchaObj.simbolos.includes(simbolo))
                this.pranchaObj.simbolos.push(simbolo);
        },

        simboloRemover(simbolo) {
            let i = this.pranchaObj.simbolos.findIndex(s => s.hid == simbolo.hid);
            this.pranchaObj.simbolos.splice(i, 1);
        },

        mudaCategoria(categoria) {
            if(typeof(categoria) === 'object')
                this.categoria = categoria.hid;
            else 
                this.categoria = categoria;
        },

        salvarPrancha(){
            if(!this.pranchaObj.nome) {
                toastr.info('Dê um nome para sua prancha.');
                return;
            }
            else if (this.pranchaObj.simbolos.length <= 0) {
                toastr.info('Uma prancha deve conter pelo menos 1 símbolo.');
                return;
            }

            this.showLoader(true);

            axios({
                method: this.editar ? 'put' : 'post',
                url: `${process.env.VUE_APP_API_URL}/usuarios/${this.$store.state.usuario.hid}/pranchas${ this.editar ? `/${this.pranchaObj.hid}` : '' }`,
                data: {
                    nome: this.pranchaObj.nome,
                    simbolos: this.pranchaObj.simbolos.map(item => item.hid),
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.$store.state.usuario.api_token}`
                }
            })
            .then(response =>  {
                this.showLoader(false);

                if(this.editar && response.status == 200) {
                    toastr.success('Prancha atualizada com sucesso!');
                }
                else if(!this.editar && response.status == 201){
                    toastr.success('Prancha criada com sucesso!');
                }
            })
            .catch(error => {
                this.showLoader(false);

                if (error.response) {
                    toastr.error(error.response.data.message, 'Erro ao criar prancha');
                }
                else {
                    toastr.error(error.message, 'Erro ao criar prancha');
                }
            });
        }
    }
}
</script>
