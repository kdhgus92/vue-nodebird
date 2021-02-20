export const state = () => ({});

export const mutations = {};

export const actions = {
  nuxtServerInit({ commit, dispatch, state }, { req }) {
    console.log("nuxtServerInit");
    return dispatch("users/loadUser");
  },
};
