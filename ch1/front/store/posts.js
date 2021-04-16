import Vue from 'vue';
import throttle from 'lodash.throttle';

export const state = () => ({
  mainPosts: [],
  hasMorePost: true, //쓸데없는 요청을 막는 것.
  imagePaths: []
});

const totalPosts = 51;
const limit = 10;

export const mutations = {
  addMainPost(state, payload) {
    state.mainPosts.unshift(payload);
    state.imagePaths = [];
  },
  removeMainPost(state, payload) {
    const index = state.mainPosts.findIndex(v => v.id === payload.postId);
    state.mainPosts.splice(index, 1);
  },
  loadComments(state, payload) {
    const index = state.mainPosts.findIndex(v => v.id === payload.postId);
    // state.mainPosts[index].Comments = payload.data; //실수
    Vue.set(state.mainPosts[index], 'Comments', payload.data);
  },
  addComment(state, payload) {
    const index = state.mainPosts.findIndex(v => v.id === payload.PostId);
    state.mainPosts[index].Comments.unshift(payload);
  },
  loadPosts(state, payload) {
    if (payload.reset) {
      state.mainPosts = payload.data;
    } else {
      state.mainPosts = state.mainPosts.concat(payload.data);
    }
    state.hasMorePost = payload.data.length === limit;
  },
  concatImagesPaths(state, payload) {
    state.imagePaths = state.imagePaths.concat(payload); // 추가 업로드를 고려
  },
  removeImagePath(state, payload) {
    state.imagePaths.splice(payload, 1);
  },
  likePost(state, payload) {
    const index = state.mainPosts.findIndex(v => v.id === payload.postId);
    state.mainPosts[index].Likers.push({
      id: payload.userId
    });
  },
  unlikePost(state, payload) {
    const index = state.mainPosts.findIndex(v => v.id === payload.postId);
    const userIndex = state.mainPosts[index].Likers.findIndex(
      v => v.id === payload.usersId
    );
    state.mainPosts[index].Likers.splice(userIndex, 1);
  }
};

export const actions = {
  add({ commit, state }, payload) {
    //서버에 게시글 등록 요청 보냄
    this.$axios
      .post(
        '/post',
        {
          content: payload.content,
          image: state.imagePaths
        },
        {
          withCredentials: true
        }
      )
      .then(res => {
        commit('addMainPost', res.data);
      })
      .catch(err => {
        console.error(err);
      });
  },

  remove({ commit }, payload) {
    this.$axios
      .delete(`/post/${payload.postId}`, {
        withCredentials: true
      })
      .then(() => {
        commit('removeMainPost', payload.postid);
      })
      .catch(err => {
        console.error(err);
      });
  },

  addComment({ commit }, payload) {
    this.$axios
      .post(
        `/post/${payload.postId}/comment`,
        {
          content: payload.content
        },
        {
          withCredentials: true
        }
      )
      .then(res => {
        commit('addComment', res.data);
      })
      .catch(err => {
        console.error(err);
      });
  },
  async loadComments({ commit }, payload) {
    try {
      const res = await this.$axios.get(`/post/${payload.postId}/comments`);
      commit('loadComments', {
        postId: payload.postId,
        data: res.data
      });
    } catch (e) {
      console.error(e);
    }
  },
  loadPosts: throttle(async function({ commit, state }, payload) {
    try {
      if (payload && payload.reset) {
        const res = await this.$axios.get(`/posts?limit=10`);
        commit('loadPosts', {
          data: res.data,
          reset: true
        });
      }
      if (state.hasMorePost) {
        const lastPost = state.mainPosts[state.mainPosts.length - 1];
        const res = await this.$axios.get(
          `/posts?lastId=${lastPost && lastPost.id}&limit=10`
        );
        commit('loadPosts', {
          data: res.data
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, 3000),
  loadUserPosts: throttle(async function({ commit, state }, payload) {
    try {
      if (payload && payload.reset) {
        const res = await this.$axios.get(
          `user/${payload.userId}/posts?limit=10`
        );
        commit('loadPosts', {
          data: res.data,
          reset: true
        });
      }
      if (state.hasMorePost) {
        const lastPost = state.mainPosts[state.mainPosts.length - 1];
        const res = await this.$axios.get(
          `user/${payload.userId}/posts?lastId=${lastPost &&
            lastPost.id}&limit=10`
        );
        commit('loadPosts', {
          data: res.data
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, 3000),
  loadHashtagPosts: throttle(async function({ commit, state }, payload) {
    try {
      if (payload && payload.reset) {
        const res = await this.$axios.get(
          `hashtag/${payload.hashtag}?limit=10`
        );
        commit('loadPosts', {
          data: res.data,
          reset: true
        });
      }
      if (state.hasMorePost) {
        const lastPost = state.mainPosts[state.mainPosts.length - 1];
        const res = await this.$axios.get(
          `hashtag/${payload.hashtag}?lastId=${lastPost &&
            lastPost.id}&limit=10`
        );
        commit('loadPosts', {
          data: res.data
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, 3000),
  uploadImages({ commit }, payload) {
    this.$axios
      .post(`/post/images`, payload, {
        withCredentials: true
      })
      .then(res => {
        commit('concatImagesPaths', res.data);
      })
      .catch(err => {
        console.error(err);
      });
  },
  retweet({ commit }, payload) {
    this.$axios
      .post(
        `/post/${payload.postId}/retweet`,
        {},
        {
          withCredentials: true
        }
      )
      .then(res => {
        commit('addMainPost', res.data);
      })
      .catch(err => {
        console.error(err);
        alert(err.response.data);
      });
  },
  likePost({ commit }, payload) {
    this.$axios
      .post(
        `/post/${payload.postId}/like`,
        {},
        {
          withCredentials: true
        }
      )
      .then(res => {
        commit('likePost', {
          userId: res.data.userId,
          postId: payload.postId
        });
      })
      .catch(err => {
        console.error(err);
      });
  },
  unlikePost({ commit }, payload) {
    this.$axios
      .delete(`/post/${payload.postId}/unlike`, {
        withCredentials: true
      })
      .then(res => {
        commit('unlikePost', {
          userId: res.data.userId,
          postId: payload.postId
        });
      })
      .catch(err => {
        console.error(err);
      });
  }
};
