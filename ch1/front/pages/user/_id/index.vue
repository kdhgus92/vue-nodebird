<template>
  <v-container>
    <v-card style="margin-bottom: 20px">
      <v-container>
        {{ other.nickname }}
        <v-row>
          <v-col cols="4">{{ other.Followings.length }} 팔로잉</v-col>
          <v-col cols="4">{{ other.Followers.length }} 팔로워</v-col>
          <v-col cols="4">{{ other.Posts.length }} 게시글</v-col>
        </v-row>
      </v-container>
    </v-card>
    <div>
      <post-card v-for="p in mainPosts" :key="p.id" :post="p" />
    </div>
  </v-container>
</template>

<script>
import PostCard from '~/components/PostCard';

export default {
  components: {
    PostCard
  },

  data() {
    return {
      name: 'Nuxt.js'
    };
  },

  computed: {
    other() {
      return this.$store.state.users.other;
    },
    mainPosts() {
      return this.$store.state.posts.mainPosts;
    }
  },

  asyncData() {
    console.log('asyncData');
    return {};
  },

  async fetch({ store, params }) {
    return Promise.all([
      await store.dispatch('posts/loadUserPosts', {
        userId: params.id,
        reset: true
      }),
      await store.dispatch('users/loadOther', { userId: params.id })
    ]);
  },

  mounted() {
    window.addEventListener('scroll', this.onScroll);
  },
  beforeDestroy() {
    window.addEventListener('scroll', this.onScroll);
  },
  methods: {
    onScroll() {
      if (
        window.scrollY + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
      ) {
        if (this.hasMorePost) {
          console.log('scroll');
          this.$store.dispatch('posts/loadPosts');
        }
      }
    }
  }
};
</script>

<style></style>
