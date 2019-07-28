import * as types from './mutation-types';

export const mutations = {
    [types.INIT_USUARIO] (state, payload) {
        state.usuario = payload;
    }
};