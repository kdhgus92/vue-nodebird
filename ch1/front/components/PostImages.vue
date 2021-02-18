<template>
  <div v-if="images.length === 0"></div>
  <div v-else-if="images.length === 1">
    <v-img
      :src="`http://localhost:3085/${images[0].src}`"
      contain
      aspect-ratio="2"
      @click="zoomImage"
    />
    <image-zoom v-if="imageZoomed" :close-modal="closeModal" :images="images" />
  </div>
  <div v-else-if="images.length === 2" style="display: flex">
    <v-img
      :src="`http://localhost:3085/${images[0].src}`"
      contain
      aspect-ratio="2"
      style="flex: 1"
      @click="zoomImage"
    />
    <v-img
      :src="`http://localhost:3085/${images[1].src}`"
      contain
      aspect-ratio="2"
      style="flex: 1"
      @click="zoomImage"
    />
    <image-zoom v-if="imageZoomed" :close-modal="closeModal" :images="images" />
  </div>
  <div v-else-if="images.length > 2" style="display: flex">
    <v-img
      :src="`http://localhost:3085/${images[0].src}`"
      contain
      aspect-ratio="2"
      style="flex: 1"
      @click="zoomImage"
    />
    <div
      style="flex:1; align-items: center; justify-content: center; display: flex"
      @click="zoomImage"
    >
      <div style="text-align: center">
        <v-icon>mdi-dots-horizontal</v-icon>
        <div>더보기</div>
      </div>
    </div>
    <image-zoom v-if="imageZoomed" :close-modal="closeModal" :images="images" />
  </div>
</template>

<script>
import ImageZoom from "./ImageZoom.vue";
export default {
  components: { ImageZoom },
  props: {
    images: {
      type: Array,
      requirred: true,
    },
  },
  data() {
    return {
      imageZoomed: false,
    };
  },

  methods: {
    closeModal() {
      this.imageZoomed = false;
    },
    zoomImage() {
      this.imageZoomed = true;
    },
  },
};
</script>

<style></style>
