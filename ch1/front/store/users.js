export const state = () => ({
  me: null,
  followerList: [],
  followingList: [],
  hasMoreFollowing: true,
  hasMoreFollower: true,
});

const totalFollowers = 8;
const totalFollowings = 6;
const limit = 3;

export const mutations = {
  setMe(state, payload) {
    state.me = payload;
  },
  changeNickname(state, payload) {
    state.me.nickname = payload.nickname;
  },
  addFollower(state, payload) {
    state.followerList.push(payload);
  },
  removeFollower(state, payload) {
    const index = state.followerList.findIndex((v) => v.id === payload.id);
    state.followerList.splice(index, 1);
  },
  addFollwing(state, payload) {
    state.followingList.push(payload);
  },
  removeFollowing(state, payload) {
    const index = state.me.Followings.findIndex((v) => v.id === payload.userId);
    state.me.Followings.splice(index, 1);
  },
  loadFollowings(state, payload) {
    state.followingList = state.followingList.concat(fakeUsers);
    state.hasMoreFollowing = fakeUsers.length === limit;
  },
  loadFollowers(state, payload) {
    state.followerList = state.followerList.concat(fakeUsers);
    state.hasMoreFollower = fakeUsers.length === limit;
  },
  following(state, payload) {
    state.me.Followings.push({ id: payload.userId });
  },
};

export const actions = {
  async loadUser({ commit, state }) {
    console.log("loadUser");
    try {
      const res = await this.$axios.get("http://localhost:3085/user", {
        withCredentials: true,
      });
      console.log(res.data);
      commit("setMe", res.data);
      console.log(state);
    } catch (err) {
      console.error(err);
    }
  },
  signUp({ commit }, payload) {
    // 서버에 회원가입 요청을 보내는 부분
    // console.log(this.$axios); // REST 비스무리한 API
    this.$axios
      .post(
        "http://localhost:3085/user",
        {
          email: payload.email,
          nickname: payload.nickname,
          password: payload.password,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res.data);
        commit("setMe", payload);
      })
      .catch((err) => {
        console.error(err);
      });
  },
  logIn({ commit }, payload) {
    this.$axios
      .post(
        "http://localhost:3085/user/login",
        {
          email: payload.email,
          password: payload.password,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res.data);
        commit("setMe", res.data);
      })
      .catch((err) => {
        console.error(err);
      });
    // ***
  },
  logOut({ commit }, payload) {
    this.$axios
      .post(
        "http://localhost:3085/user/logout",
        {},
        {
          withCredentials: true,
        }
      )
      .then((data) => {
        commit("setMe", null);
      })
      .catch((err) => {
        console.error(err);
      });
  },
  changeNickname({ commit }, payload) {
    this.$axios
      .patch(
        "/user/nickname",
        { nickname: payload.nickname },
        { withCredentials: true }
      )
      .then((data) => {
        commit("changeNickname", payload);
      })
      .catch((err) => {
        console.error(err);
      });
    commit("changeNickname", payload);
  },
  addFollower({ commit }, payload) {
    commit("addFollower", payload);
  },
  removeFollower({ commit }, payload) {
    commit("removeFollower", payload);
  },
  addFollowing({ commit }, payload) {
    commit("addFollowing", payload);
  },
  removeFollowing({ commit }, payload) {
    commit("removeFollowing", payload);
  },
  loadFollowers({ commit, state }, payload) {
    if (state.hasMoreFollower) {
      const offset = state.followerList.length;
      return this.$axios
        .get(`/user/${payload.userId}/followers?limit=3&offset=${offset}`)
        .then((res) => {
          commit("loadFollowers", {
            data: res.data,
            offset,
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  },
  loadFollowings({ commit, state }, payload) {
    if (state.hasMoreFollowing) {
      const offset = state.followingList.length;
      return this.$axios
        .get(`/user/${payload.userId}/followings?limit=3&offset=${offset}`)
        .then((res) => {
          commit("loadFollowings", {
            data: res.data,
            offset,
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  },
  follow({ commit, state }, payload) {
    this.$axios
      .post(
        `/user/${payload.userId}/follow`,
        {},
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        commit("following", {
          userId: payload.userId,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  },
  unfollow({ commit, state }, payload) {
    this.$axios
      .delete(`/user/${payload.userId}/unfollow`, {
        withCredentials: true,
      })
      .then((res) => {
        commit("removeFollowing", {
          userId: payload.userId,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  },
};
