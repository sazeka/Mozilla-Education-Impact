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

const videos = [
  "videos/clip1.mp4",
  "videos/clip2.mp4",
  "videos/clip3.mp4",
];

const currentIndex = ref(0);

function nextVideo() {
  currentIndex.value = (currentIndex.value + 1) % videos.length;
}

function prevVideo() {
  currentIndex.value = (currentIndex.value - 1 + videos.length) % videos.length;
}
</script>

<style scoped>
.video-carousel {
  width: 100%;
  max-width: 800px;
  margin: 20px auto;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  background-color: #000; /* ✅ black background */
}

.carousel-track {
  display: flex;
  transition: transform 0.6s ease;
  background-color: #000; /* keep inside slides black */
}

.carousel-item {
  min-width: 100%;
  box-sizing: border-box;
  background-color: #000; /* each slide background black */
}

.carousel-video {
  width: 100%;
  height: auto;
  border-radius: 12px;
  background-color: #000; /* fill behind video */
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
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  font-size: 2rem;
  padding: 0 12px;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.3s;
}

.carousel-controls button:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>

