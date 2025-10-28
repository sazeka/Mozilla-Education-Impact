<template>
  <div>
    <!-- 🔹 Titles (Animated + Fixed Above Carousel) -->
    <div class="top-section">
      <div class="left-info">
        <transition name="fade-slide" mode="out-in">
          <div :key="currentSlide">
            <h1 class="page-title">Mozilla Education:</h1>
            <h1 class="page-title">
              <template v-if="currentSlide === 0">Our global impact</template>
              <template v-else-if="currentSlide === 1">Our stories</template>
              <template v-else>Our latest news</template>
            </h1>
          </div>
        </transition>
      </div>
    </div>

    <!-- 🔹 Carousel wrapper -->
    <div class="carousel-wrapper">
      <div class="carousel" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
        
        <!-- 🌍 Slide 1: Globe + Filters + Totals -->
        <div class="carousel-slide">
          <div class="globe-section">
            <InteractiveGlobe :points="filteredPoints" />
          </div>

          <div class="filters-section">
            <div class="filter-bar">
              <!-- Country Filter -->
              <div class="filter-group">
                <label for="country">Filter by Country: </label>
                <select id="country" v-model="selectedCountry">
                  <option value="">All</option>
                  <option v-for="country in uniqueCountries" :key="country" :value="country">
                    {{ country }}
                  </option>
                </select>
              </div>

              <!-- Category Filter -->
              <div class="filter-group">
                <label for="category">Filter by Program: </label>
                <select id="category" v-model="selectedCategory">
                  <option value="">All</option>
                  <option v-for="category in uniqueCategories" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
              </div>
            </div>

            <p class="totals">
              Total Universities: {{ filteredPoints.length }} &nbsp; | &nbsp;
              Total Students: {{ totalStudents.toLocaleString() }} &nbsp; | &nbsp;
              Total Faculty: {{ totalFaculty.toLocaleString() }}
            </p>
          </div>
        </div>

        <!-- 🎥 Slide 2: Video -->
        <div class="carousel-slide">
          <div class="video-section">
            <VideoCarousel />
          </div>
        </div>

        <!-- 📰 Slide 3: Articles -->
        <div class="carousel-slide">
          <div class="articles-section">
            <button class="article-arrow left" @click="scrollArticles(-1)">‹</button>

            <div class="carousel-track" ref="articleTrack">
              <div
                v-for="(article, i) in articles"
                :key="article.title + '_' + i"
                class="carousel-item"
              >
                <h3>{{ article.title }}</h3>

                <!-- 🗓️ Date ABOVE image -->
                <p class="article-date">
                  {{ new Date(article.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) }}
                </p>

                <!-- 🖼️ Image BELOW date -->
                <img
                  v-if="article.image"
                  :src="article.image"
                  :alt="article.title"
                  class="article-image"
                />
                <img
                  v-else
                  src="https://via.placeholder.com/400x250?text=Article+Image"
                  alt="Default placeholder"
                  class="article-image"
                />

                <p>{{ article.summary }}</p>
                <a :href="article.link" target="_blank" rel="noopener">Read more →</a>
              </div>
            </div>

            <button class="article-arrow right" @click="scrollArticles(1)">›</button>
          </div>
        </div>

      </div> <!-- ✅ closes .carousel -->

      <!-- 🔹 Carousel Controls -->
      <div class="carousel-controls">
        <button @click="prevSlide" class="arrow-btn left">
          <img src="@/assets/Scribble_02_Light_RGB.png" alt="Previous" class="arrow-img" />
        </button>

        <button @click="togglePause" class="pause-btn">
          <img
            src="@/assets/Scribble_10_Light_RGB.png"
            alt="Pause/Play"
            class="pause-img"
            :class="{ paused: isPaused, pulsing: isPaused }"
          />
        </button>

        <button @click="nextSlide" class="arrow-btn right">
          <img src="@/assets/Scribble_01_Light_RGB.png" alt="Next" class="arrow-img" />
        </button>
      </div>
    </div> <!-- ✅ closes .carousel-wrapper -->
  </div> <!-- ✅ closes root div -->
</template>


<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import InteractiveGlobe from './components/InteractiveGlobe.vue';
import VideoCarousel from "@/components/VideoCarousel.vue";
import { loadCSV } from "@/utils/loadCSV.js";

// 🔹 Reactive state
const currentSlide = ref(0);
const totalSlides = 3;
const isPaused = ref(false);
let intervalId = null;

// 🔹 Data
const points = ref([]);
const articles = ref([]);
const selectedCategory = ref('');
const selectedCountry = ref('');

// 🔹 Navigation
const nextSlide = () => { currentSlide.value = (currentSlide.value + 1) % totalSlides; };
const prevSlide = () => { currentSlide.value = (currentSlide.value - 1 + totalSlides) % totalSlides; };
const togglePause = () => { isPaused.value = !isPaused.value; };

// 🔹 Article scroll
const articleTrack = ref(null);
const scrollArticles = (direction) => {
  if (articleTrack.value) {
    const scrollAmount = 300;
    articleTrack.value.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });
  }
};

// 🔹 Auto-rotation
const startAutoRotate = () => {
  clearInterval(intervalId);
  intervalId = setInterval(() => {
    if (!isPaused.value) nextSlide();
  }, 10000);
};

// ✅ Merge data loading + auto-rotation
onMounted(async () => {
  points.value = await loadCSV("/Mozilla-Education-Impact/data/universities.csv");
  articles.value = await loadCSV("/Mozilla-Education-Impact/data/articles.csv");
  startAutoRotate(); // start after data is loaded
});

onUnmounted(() => clearInterval(intervalId));

// 🔹 Filters
const uniqueCategories = computed(() =>
  [...new Set(points.value.map(p => p.category).filter(Boolean))]
);
const uniqueCountries = computed(() =>
  [...new Set(points.value.map(p => p.country?.trim() || p.Country?.trim() || '').filter(Boolean))]
);
const filteredPoints = computed(() =>
  points.value.filter(p => {
    const matchCategory = selectedCategory.value ? p.category === selectedCategory.value : true;
    const matchCountry = selectedCountry.value ? p.country === selectedCountry.value : true;
    return matchCategory && matchCountry;
  })
);

// 🔹 Totals
const totalStudents = computed(() =>
  filteredPoints.value.reduce((sum, p) => sum + (p.students || 0), 0)
);
const totalFaculty = computed(() =>
  filteredPoints.value.reduce((sum, p) => sum + (p.faculty || 0), 0)
);
</script>

<style>
/* ===========================
   🔹 CUSTOM FONT
=========================== */
@font-face {
  font-family: 'Mozilla Headline';
  src: url('@/assets/fonts/MozillaHeadline-Regular.woff2') format('woff2'),
       url('@/assets/fonts/MozillaHeadline-Regular.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

/* ===========================
   🔹 PAUSE ANIMATION
=========================== */
@keyframes pause-pulse {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.08); }
  100% { transform: scale(1); }
}

/* When paused, visually indicate state (your existing rule can stay) */
.pause-img.paused {
  filter: grayscale(100%) brightness(0.7);
}

/* Pulsing animation while paused */
.pause-img.pulsing {
  animation: pause-pulse 900ms ease-in-out infinite;
  transform-origin: center center;
}

/* Avoid hover scale fighting with the pulse */
.pause-img.pulsing:hover {
  transform: none;
}

/* Accessibility: respect users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  .pause-img.pulsing {
    animation: none;
  }
}

/* ===========================
   🔹 TITLE TRANSITION
=========================== */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.8s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ===========================
   🔹 TITLE STYLES
=========================== */
.top-section {
  position: relative;
  z-index: 30;
  background: #fff;
  padding: 40px 60px 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}
.left-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: 0.2rem;
}
.page-title {
  font-family: 'Mozilla Headline', sans-serif;
  font-size: 40px;
  color: #000;
  margin: 0;
  line-height: 0.9;
}
.page-title + .page-title {
  margin-top: -0.2rem;
}

/* ===========================
   🔹 CAROUSEL CORE
=========================== */
.carousel-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.carousel {
  display: flex;
  width: 300%;
  height: 100%;
  transition: transform 0.8s ease-in-out;
}
.carousel-slide {
  width: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  padding-top: 40px;
}
.carousel-slide:nth-child(1),
.carousel-slide:nth-child(2),
.carousel-slide:nth-child(3) {
  background: #fff;
}
.carousel-slide > * {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  box-sizing: border-box;
}

/* ===========================
   🔹 CONTROLS (Visible + Fixed)
=========================== */
.carousel-controls {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1.5rem;
  z-index: 50;
}
.carousel-controls button {
  background: none;          /* remove circle background */
  color: #000;               /* change text color if needed */
  border: none;              /* remove border */
  padding: 0;                /* remove padding around arrows */
  font-size: 1.8rem;
  border-radius: 0;          /* remove rounded shape */
  cursor: pointer;
  transition: transform 0.3s ease, opacity 0.3s ease;
  backdrop-filter: none;     /* remove blur effect */
}

.carousel-controls button:hover {
  background: none;          /* keep transparent on hover */
  transform: scale(1.1);
}

.arrow-img {
  width: 64px;       /* size of the arrow images */
  height: auto;
  object-fit: contain;
  transition: transform 0.3s ease, opacity 0.3s ease;
  opacity: 0.9;
}

.arrow-btn.right:hover .arrow-img {
  transform: scale(1.1) rotate(3deg);
  opacity: 1;
}

.pause-btn {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pause-img {
  width: 64px;         
  height: auto;
  opacity: 0.9;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.pause-img:hover {
  transform: scale(1.15);
  opacity: 1;
}

.pause-img.paused {
  filter: grayscale(100%) brightness(0.7); /* visually indicate paused state */
}

@media (max-width: 900px) {
  .arrow-img {
    width: 48px;   /* smaller on tablets/phones */
  }
}
/* ===========================
   🔹 GLOBE SECTION
=========================== */
.globe-section {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 45vh;
  max-height: 400px;
  min-height: 280px;
  margin-top: 30px;
  overflow: hidden;
  box-sizing: border-box;
}
.globe-section canvas {
  width: 100% !important;
  height: 100% !important;
  max-width: 800px;
  max-height: 400px;
  object-fit: contain;
  display: block;
}

/* ===========================
   🔹 FILTERS + TOTALS
=========================== */
.filters-section select {
  background: #F06C13;        /* Mozilla orange background */
  color: #fff;                /* white text for contrast */
  border: none;               /* cleaner look */
  border-radius: 6px;
  padding: 0.4em 0.6em;
  cursor: pointer;
  font-family: 'Mozilla Text', sans-serif;
  font-weight: 600;
  appearance: none;           /* remove default OS arrow style */
  transition: background 0.3s ease;
}
.filters-section select:hover {
  background: #d85d10;        /* slightly darker on hover */
}

.filters-section select:focus {
  outline: 2px solid #000;    /* black outline for accessibility */
  outline-offset: 2px;
}
.filters-section .filter-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5em;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
}
.filters-section label {
  font-weight: 600;
  color: #000;
}
.filters-section .totals {
  color: #000;
  font-size: 16px;
  margin-top: 0.5rem;
  text-align: center;       /* ✅ centers the text */
  width: 100%;              /* ensures it spans full row */
}

/* ===========================
   🔹 VIDEO SECTION
=========================== */
.video-section {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;   /* ✅ center vertically */
  padding: 0 40px;       /* ✅ remove top/bottom padding */
  margin-top: -40px;     /* ✅ lift it higher in its slide */
  box-sizing: border-box;
}

.video-container {
  width: 85%;
  max-width: 1000px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* ===========================
   🔹 ARTICLES SECTION
=========================== */
.articles-section {
  position: relative;
  width: 100%;
  padding: 20px 40px;        /* ✅ less vertical padding */
  display: flex;
  align-items: flex-start;   /* ✅ move content upward */
  justify-content: center;
  min-height: 500px;         /* still enough height for cards */
  box-sizing: border-box;
  margin-top: -60px;         /* ✅ physically shifts it higher */
  z-index: 1;
}


.article-date {
  font-size: 0.85rem;
  color: #555;
  margin: 0.1rem 0 0.3rem;
  font-style: italic;
  line-height: 1.1;
}

.carousel-track {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  gap: 2rem;
  scroll-behavior: smooth;
  padding: 1rem;
  width: 100%;
  max-width: 1000px;
}

.article-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 2rem;
  color: #000;
  cursor: pointer;
  z-index: 10;
  transition: opacity 0.3s;
}
.article-arrow:hover { opacity: 0.7; }
.article-arrow.left { left: 10px; }
.article-arrow.right { right: 10px; }

.carousel-item {
  flex: 0 0 280px;
  scroll-snap-align: start;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 1rem;
  color: #000;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  height: 420px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow: hidden;             
  box-sizing: border-box;
}
.carousel-item p {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;      
  -webkit-box-orient: vertical;
}
.carousel-item h3 {
  font-size: 1.1rem;
  margin-bottom: 0.2rem; /* ✅ was probably 0.5–1rem */
  color: #000;
}
.article-image {
  width: 100%;
  height: 150px;              
  object-fit: cover;
  border-radius: 8px;
  margin: 0.5rem 0;
  flex-shrink: 0;
}



/* ===========================
   🔹 RESPONSIVE
=========================== */
@media (max-width: 900px) {
  .page-title { font-size: 28px; }
  .carousel-controls { bottom: 20px; gap: 1rem; }
  .carousel-controls button { font-size: 1.5rem; padding: 0.5em 1em; }
  .filters-section { padding: 20px; }
  .filters-section .filter-bar { flex-direction: column; gap: 10px; }
  .video-section { padding: 20px; }
  .articles-section { padding: 20px; }
}
</style>
