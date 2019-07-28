import * as types from './mutation-types';

export const initUsuario = ({commit}, usuario) => {
    commit(types.INIT_USUARIO, usuario);
}