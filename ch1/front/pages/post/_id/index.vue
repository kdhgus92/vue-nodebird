<template>
  <v-container v-if="post">
    <post-card :post="post" />
  </v-container>
  <div v-else>
    해당 아이디의 게시글이 존재하지 않습니다.
  </div>
</template>

<script>
// post/_id.vue
// post/1   post/2    post
import PostCard from '~/components/PostCard';
export default {
  components: {
    PostCard
  },
  computed: {
    post() {
      // _id 값에 들어가는 id가 params 안에 있다.
      return this.$store.state.posts.mainPosts.find(
        v => v.id === parseInt(this.$route.params.id, 10)
      );
    }
  },
  async fetch({ store, params }) {
    console.log('post/_id/index.vue fetch');
    return await store.dispatch('posts/loadPost', params.id);
  },
  head() {
    return {
      title: `${this.post.User.nickname}님의 게시글`,
      meta: [
        {
          hid: 'desc',
          name: 'description',
          content: this.post.content
        },
        {
         // nuxt.config의 head와 개별 페이지의 og:title이 겹칠때 구분 hid. 공식문서 참고
          hid: 'ogtitle', 
          property: 'og:title',
          content: `${this.post.User.nickname}님의 게시글`
        },
        {
          hid: 'ogdesc',
          property: 'og:description',
          content: this.post.content
        },
        {
          hid: 'ogimage',
          property: 'og:image',
          content: this.post.Images[0]
            ? this.post.Images[0].src
            : 'https://vue.nodebird.com/vue-nodebird.png'
        },
        {
          hid: 'ogurl',
          property: 'og:url',
          content: `https://vue.nodebird.com/post/${this.post.id}`
        }
      ]
    };
  }
};
</script>

<style></style>
