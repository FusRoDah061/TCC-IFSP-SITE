import Vue from 'vue';
import Vuex from 'vuex';
import { mutations } from './mutations';
import * as actions from './actions';

Vue.use(Vuex);

const state = {
    usuario: null,
    loader: {
        visible: false,
        amount: 0
    },
    swalConfig: {
        customClass: {
            container: 'dialog',
            popup: 'dialog-content',
            title: 'dialog-title',
            icon: 'd-none',
            image: 'd-none',
            content: 'dialog-text',
            input: 'input-class',
            actions: 'dialog-buttons',
            confirmButton: 'btn btn-green',
            cancelButton: 'btn btn-red'
        }
    },
    toastrConfig: {
        closeButton: true,
        debug: false,
        newestOnTop: false,
        progressBar: true,
        positionClass: "toast-top-right",
        preventDuplicates: false,
        showDuration: 500,
        hideDuration: 500,
        timeOut: 3000,
        extendedTimeOut: 1000,
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
    }
};

export default new Vuex.Store({
    state,
    mutations,
    actions
});