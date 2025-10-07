<template>
  <div class="video-carousel">
    <div
      class="carousel-track"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
    >
      <div v-for="(video, index) in videos" :key="index" class="carousel-item">
        <video
          :src="video"
          controls
          muted
          loop
          playsinline
          class="carousel-video"
        ></video>
      </div>
    </div>

    <div class="carousel-controls" v-if="videos.length > 1">
      <button @click="prevVideo">‹</button>
      <button @click="nextVideo">›</button>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";

const base = import.meta.env.BASE_URL;

const videos = [
  `${base}videos/clip1.mp4`,
  `${base}videos/clip2.mp4`,
  `${base}videos/clip3.mp4`
];

const currentIndex = ref(0);

function nextVideo() {
  currentIndex.value = (currentIndex.value + 1) % videos.length;
}

function prevVideo() {
  currentIndex.value = (currentIndex.value - 1 + videos.length) % videos.length;
}

console.log("Resolved video paths:", videos);
</script>


<style scoped>
.video-carousel {
  width: 100%;
  max-width: 800px;
  margin: 20px auto;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
}

.carousel-track {
  display: flex;
  transition: transform 0.6s ease;
}

.carousel-item {
  min-width: 100%;
  box-sizing: border-box;
}

.carousel-video {
  width: 100%;
  height: auto;
  border-radius: 12px;
}

.carousel-controls {
  position: absolute;
  top: 50%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
}

.carousel-controls button {
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  font-size: 2rem;
  padding: 0 12px;
  border-radius: 50%;
  cursor: pointer;
}
</style>
