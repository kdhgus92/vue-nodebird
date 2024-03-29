export const state = () => ({
  me: null,
  followerList: [],
  followingList: [],
  hasMoreFollowing: true,
  hasMoreFollower: true,
  other: null //남의 정보
});

const limit = 3;

export const mutations = {
  setMe(state, payload) {
    state.me = payload;
  },
  setOther(state, payload) {
    state.other = payload;
  },
  changeNickname(state, payload) {
    state.me.nickname = payload.nickname;
  },

  addFollower(state, payload) {
    state.followerList.push(payload);
  },
  addFollwing(state, payload) {
    state.followingList.push(payload);
  },

  removeFollower(state, payload) {
    let index = state.followerList.findIndex(v => v.id === payload.id);
    state.me.Followings.splice(index, 1);
    index = state.followerList.findIndex(v => v.id === payload.userId);
    state.followerList.splice(index, 1);
  },
  removeFollowing(state, payload) {
    let index = state.me.Followings.findIndex(v => v.id === payload.userId);
    state.me.Followings.splice(index, 1);
    index = state.followingList.findIndex(v => v.id === payload.userId);
    state.followingList.splice(index, 1);
  },

  loadFollowings(state, payload) {
    if (payload.offset === 0) {
      state.followingList = payload.data;
    } else {
      state.followingList = state.followingList.concat(payload.data);
    }
    state.hasMoreFollowing = payload.data.length === limit;
  },
  loadFollowers(state, payload) {
    if (payload.offset === 0) {
      state.followerList = payload.data;
    } else {
      state.followerList = state.followerList.concat(payload.data);
    }
    state.hasMoreFollower = payload.data.length === limit;
  },

  following(state, payload) {
    state.me.Followings.push({ id: payload.userId });
  }
};

export const actions = {
  async loadUser({ commit, state }) {
    console.log('loadUser');
    try {
      const res = await this.$axios.get('/user', {
        withCredentials: true
      });
      commit('setMe', res.data);
      console.log(state);
    } catch (err) {
      console.error(err);
    }
  },
  async loadOther({ commit }, payload) {
    try {
      const res = await this.$axios.get(`/user/${payload.userId}`, {
        withCredentials: true
      });
      commit('setOther', res.data);
    } catch (err) {
      console.error(err);
    }
  },
  signUp({ commit }, payload) {
    // 서버에 회원가입 요청을 보내는 부분
    // console.log(this.$axios); // REST 비스무리한 API
    this.$axios
      .post(
        '/user',
        {
          userId: payload.userId,
          nickname: payload.nickname,
          password: payload.password
        },
        { withCredentials: true }
      )
      .then(res => {
        console.log(res.data);
        commit('setMe', payload);
      })
      .catch(err => {
        console.error(err);
      });
  },
  logIn({ commit }, payload) {
    this.$axios
      .post(
        'http://localhost:3085/user/login',
        {
          userId: payload.userId,
          password: payload.password
        },
        {
          withCredentials: true
        }
      )
      .then(res => {
        console.log(res.data);
        commit('setMe', res.data);
      })
      .catch(err => {
        console.error(err);
      });
    // ***
  },
  logOut({ commit }, payload) {
    this.$axios
      .post(
        'http://localhost:3085/user/logout',
        {},
        {
          withCredentials: true
        }
      )
      .then(data => {
        commit('setMe', null);
      })
      .catch(err => {
        console.error(err);
      });
  },
  changeNickname({ commit }, payload) {
    this.$axios
      .patch(
        '/user/nickname',
        { nickname: payload.nickname },
        { withCredentials: true }
      )
      .then(data => {
        commit('changeNickname', payload);
      })
      .catch(err => {
        console.error(err);
      });
    commit('changeNickname', payload);
  },
  addFollower({ commit }, payload) {
    commit('addFollower', payload);
  },

  addFollowing({ commit }, payload) {
    commit('addFollowing', payload);
  },

  async loadFollowers({ commit, state }, payload) {
    try {
      if (!(payload && payload.offset === 0) || !state.hasMoreFollower) {
        return;
      }
      let offset = state.followerList.length;
      if (payload && payload.offset === 0) {
        offset = 0;
      }
      const res = await this.$axios.get(
        `/user/${state.me.id}/followers?limit=3&offset=${offset}`,
        { withCredentials: true }
      );
      commit('loadFollowers', { data: res.data, offset });
      return;
    } catch (err) {
      console.error(err);
    }
  },
  loadFollowings({ commit, state }, payload) {
    if (!(payload && payload.offset === 0) || !state.hasMoreFollowing) {
      return;
    }
    let offset = state.followingList.length;
    if (payload && payload.offset === 0) {
      offset = 0;
    }
    return this.$axios
      .get(`/user/${state.me.id}/followings?limit=3&offset=${offset}`, {
        withCredentials: true
      })
      .then(res => {
        commit('loadFollowings', { data: res.data, offset });
      })
      .catch(err => {
        console.error(err);
      });
  },

  follow({ commit, state }, payload) {
    this.$axios
      .post(`/user/${payload.userId}/follow`, {}, { withCredentials: true })
      .then(res => {
        commit('following', {
          userId: payload.userId
        });
      })
      .catch(err => {
        console.error(err);
      });
  },
  unfollow({ commit, state }, payload) {
    this.$axios
      .delete(`/user/${payload.userId}/follow`, { withCredentials: true })
      .then(res => {
        commit('removeFollowing', {
          userId: payload.userId
        });
      })
      .catch(err => {
        console.error(err);
      });
  },
  removeFollower({ commit, state }, payload) {
    return this.$axios
      .delete(`/user/${payload.userId}/follower`, {
        withCredentials: true
      })
      .then(res => {
        commit('removeFollower', {
          userId: payload.userId
        });
      })
      .catch(err => {
        console.error(err);
      });
  }
};
