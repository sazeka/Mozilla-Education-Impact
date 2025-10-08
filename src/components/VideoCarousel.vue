<script setup>
import 'vue3-carousel/carousel.css'
import { Carousel, Slide, Navigation } from 'vue3-carousel'
import { ref } from 'vue'

const currentSlide = ref(0)
const slideTo = (nextSlide) => (currentSlide.value = nextSlide)

// 🎥 Main video carousel config
const galleryConfig = {
  itemsToShow: 1,
  wrapAround: true,
  slideEffect: 'fade',
  mouseDrag: false,
  touchDrag: false,
  height: 420,
}

// 🎞️ Thumbnail carousel config
const thumbnailsConfig = {
  height: 80,
  itemsToShow: 4,
  wrapAround: false,    // ❌ no infinite loop
  mouseDrag: true,      // ✅ allow user scrolling
  touchDrag: true,
  gap: 10,
  snapAlign: 'start',   // ensures thumbnails move smoothly
}

// Local video files (in /public/videos/)
const videos = [
  { id: 1, url: 'videos/clip1.mp4', thumbnail: 'videos/thumb1.png' },
  { id: 2, url: 'videos/clip2.mp4', thumbnail: 'videos/thumb2.png' },
  { id: 3, url: 'videos/clip3.mp4', thumbnail: 'videos/thumb3.png' },
  { id: 4, url: 'videos/clip4.mp4', thumbnail: 'videos/thumb4.png' },
]
</script>

<template>
  <div class="video-carousel">
    <!-- 🎥 Main video gallery -->
    <Carousel id="gallery" v-bind="galleryConfig" v-model="currentSlide">
      <Slide v-for="video in videos" :key="video.id">
        <video controls playsinline class="gallery-video" :src="video.url"></video>
      </Slide>
    </Carousel>

    <!-- 🎞️ Thumbnail gallery -->
    <Carousel id="thumbnails" v-bind="thumbnailsConfig" v-model="currentSlide">
      <Slide v-for="video in videos" :key="video.id">
        <template #default="{ currentIndex, isActive }">
          <div
            :class="['thumbnail', { 'is-active': isActive }]"
            @click="slideTo(currentIndex)"
          >
            <img :src="video.thumbnail" alt="Thumbnail" class="thumbnail-image" />
          </div>
        </template>
      </Slide>

      <template #addons>
        <Navigation />
      </template>
    </Carousel>
  </div>
</template>

<style scoped>
:root {
  background-color: #000;
}

/* Make both carousels stack vertically */
.video-carousel {
  display: flex;
  flex-direction: column; /* ✅ stack vertically */
  align-items: center;
  justify-content: center;
  max-width: 800px;
  margin: 0 auto;
  background: #000;
  padding: 10px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
}

/* 🎥 Main gallery */
#gallery {
  display: block;
  width: 100%;
}

.gallery-video {
  width: 100%;
  height: auto;
  border-radius: 12px;
  background: #000;
  object-fit: contain;
}

/* 🎞️ Thumbnail row */
#thumbnails {
  margin-top: 12px;
  display: block;
  width: 100%;
}

.thumbnail {
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.3s ease-in-out;
}

.thumbnail.is-active,
.thumbnail:hover {
  opacity: 1;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
}
</style>
