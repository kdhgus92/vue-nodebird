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
  }
};
</script>

<style></style>
