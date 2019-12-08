import * as types from './mutation-types';

export const mutations = {
    [types.INIT_USUARIO] (state, payload) {
        state.usuario = payload;
    },

    [types.SHOW_LOADER] (state, payload) {
        if(payload) {
            state.loader.visible = true;
            state.loader.amount++;
        }
        else {
            state.loader.amount--;

            if(state.loader.amount <= 0)
                state.loader.visible = false;
        }
    }
};