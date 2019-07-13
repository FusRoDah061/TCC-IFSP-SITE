<template lang="pug">
    section.prancha
        toast(ref="toast")

        spinner(position="center" fixed=true v-bind:show="isLoading")

        h1 {{ tituloPagina }}

        section.form-inline
            div.form-inputs
                label(for="tit-prancha") Título da prancha
                div.form-control
                    input#tit-prancha(v-model="pranchaObj.nome" type="text" maxlength="255" minlength="1" autofocus)

            button.btn.btn-green.py-2.px-4(:disabled="pranchaInvalida" @click="salvarPrancha") Salvar prancha
        
        section.simbolos-add-container
            p.mb-0.mt-4 Símbolos adicionados
            p.text-muted Clique em um símbolo para remover da prancha.

            ul.simbolos-add.px-0.py-2
                li.list-style-none(v-for="(simbolo, i) in pranchaObj.simbolos")
                    simbolo.simbolo-sm(:key="simbolo.hid" :simbolo="simbolo" @selecionado="simboloRemover" :deletable="true")

        section
            p.mb-0.mt-4 Símblos disponíveis
            categorias(v-bind:auth="usuario.api_token" @selected="mudaCategoria")
            simbolos(:usuario="usuario.hid" :auth="usuario.api_token" :categoria="categoria" :sentenca="false" @selected="simboloSelecionado")
</template>

<script>
import Categorias from "../components/Categorias/Categorias";
import Simbolos from "../components/Simbolos/Simbolos";

export default {
    name: 'prancha',
    data() {
        return {
            pranchaObj: {
                nome: null,
                simbolos: []
            },
            editar: false,
            isLoading: false,
            usuario: null,
            categoria: null,
            toast: null
        }
    },
    components: {
        Categorias, Simbolos
    },
    created() {
        this.usuario = JSON.parse(localStorage.usuario);
    },
    mounted() {
        this.toast = this.$refs.toast;
        
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
        fetchPrancha(hid) {
            this.isLoading = true;

            axios({
                method: 'get',
                url: `${process.env.VUE_APP_API_URL}/usuarios/${this.usuario.hid}/pranchas/${hid}`,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${this.usuario.api_token}`
                }
            })            
            .then(response =>  {
                this.isLoading = false;

                if(response.status == 200 && typeof(response.data) === 'object'){
                    this.pranchaObj = response.data;
                }
            })
            .catch(error => {
                this.isLoading = false;

                if (error.response) {
                    this.toast.error(error.response.data.message);
                }
                else {
                    this.toast.error(error.message, error.stack);
                }
            });
        },

        simboloSelecionado(simbolo) {
            console.log(simbolo);
            if(!this.pranchaObj.simbolos.includes(simbolo))
                this.pranchaObj.simbolos.push(simbolo);
        },

        simboloRemover(simbolo) {
            let i = this.pranchaObj.simbolos.findIndex(s => s.hid == simbolo.hid);
            this.pranchaObj.simbolos.splice(i, 1);
        },

        mudaCategoria(categoria) {
            this.categoria = categoria;
        },

        salvarPrancha(){
            if(!this.pranchaObj.nome) {
                this.toast.info('Dê um nome para sua prancha.');
                return;
            }
            else if (this.pranchaObj.simbolos.length <= 0) {
                this.toast.info('Uma prancha deve conter pelo menos 1 símbolo.');
                return;
            }

            this.isLoading = true;

            axios({
                method: this.editar ? 'put' : 'post',
                url: `${process.env.VUE_APP_API_URL}/usuarios/${this.usuario.hid}/pranchas${ this.editar ? `/${this.pranchaObj.hid}` : '' }`,
                data: {
                    nome: this.pranchaObj.nome,
                    simbolos: this.pranchaObj.simbolos.map(item => item.hid),
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.usuario.api_token}`
                }
            })
            .then(response =>  {
                this.isLoading = false;

                if(this.editar && response.status == 200) {
                    this.toast.success('Prancha atualizada com sucesso!');
                }
                else if(!this.editar && response.status == 201){
                    this.toast.success('Prancha criada com sucesso!');
                }
            })
            .catch(error => {
                this.isLoading = false;

                if (error.response) {
                    this.toast.error(error.response.data.message);
                }
                else {
                    this.toast.error(error.message, error.stack);
                }
            });
        }
    }
}
</script>
