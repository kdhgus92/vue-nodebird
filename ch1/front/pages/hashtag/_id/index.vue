<template>
  <v-container>
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
    mainPosts() {
      return this.$store.state.posts.mainPosts;
    }
  },

  asyncData() {
    console.log('asyncData');
    return {};
  },

  async fetch({ store, params }) {
    return await store.dispatch('posts/loadHashtagPosts', {
      hashtag: encodeURIComponent(params.id),
      reset: true
    });
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
