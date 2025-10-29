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

    <!-- 🔹 Carousel Wrapper -->
    <div class="carousel-wrapper">
      <div class="carousel" :style="{'--slide-index': currentSlide}">

        <!-- 🌍 Slide 1: Globe + Filters + Totals -->
        <div class="carousel-slide">
          <div class="globe-section">
            <InteractiveGlobe :points="filteredPoints" />
          </div>

          <!-- 🔹 Filters Section -->
          <div class="filters-section">
            <div class="filter-bar">
              <!-- Country Filter -->
              <div class="filter-group">
                <label for="country">Filter by Country:</label>
                <select id="country" v-model="selectedCountry">
                  <option value="">All</option>
                  <option
                    v-for="country in uniqueCountries"
                    :key="country"
                    :value="country"
                  >
                    {{ country }}
                  </option>
                </select>
              </div>

              <!-- Category Filter -->
              <div class="filter-group">
                <label for="category">Filter by Program:</label>
                <select id="category" v-model="selectedCategory">
                  <option value="">All</option>
                  <option
                    v-for="category in uniqueCategories"
                    :key="category"
                    :value="category"
                  >
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

        <!-- 📰 Slide 3: Articles + Timeline -->
        <div class="carousel-slide">
          <div class="articles-section">

            <!-- 📰 Article Display -->
            <div class="article-display" v-if="articles.length">
              <h3>{{ currentArticle.title }}</h3>

              <!-- ✍️ Author -->
              <p class="article-author" v-if="currentArticle.author">
                By {{ currentArticle.author }}
              </p>

              <!-- 🗓️ Date -->
              <p class="article-date">
                {{
                  new Date(currentArticle.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                }}
              </p>

              <!-- 🧾 Summary -->
              <p class="article-summary">
                {{ currentArticle.summary }}
              </p>

              <!-- 🔗 Read more -->
              <a
                :href="currentArticle.link"
                target="_blank"
                rel="noopener"
              >
                Read more →
              </a>
            </div>

            <!-- 🕒 Timeline Centered Below -->
            <div class="timeline-wrapper">
              <ArticleTimeline
                :articles="articles"
                :currentArticleIndex="currentArticleIndex"
                @select-article="setCurrentArticle"
              />
            </div>

          </div>
        </div>
      </div>

      <!-- 🔹 Carousel Controls -->
      <div class="carousel-controls">
        <button @click="prevSlide" class="arrow-btn left">
          <img
            src="@/assets/Scribble_02_Light_RGB.png"
            alt="Previous"
            class="arrow-img"
          />
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
          <img
            src="@/assets/Scribble_01_Light_RGB.png"
            alt="Next"
            class="arrow-img"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import InteractiveGlobe from "./components/InteractiveGlobe.vue";
import VideoCarousel from "@/components/VideoCarousel.vue";
import { loadCSV } from "@/utils/loadCSV.js";
import ArticleTimeline from "@/components/ArticleTimeline.vue";

/* ────────────────
   Reactive State
──────────────── */
const currentSlide = ref(0);
const totalSlides = 3;
const isPaused = ref(false);
let intervalId = null;

/* ────────────────
   Data
──────────────── */
const points = ref([]);
const articles = ref([]);
const selectedCategory = ref("");
const selectedCountry = ref("");

const currentArticleIndex = ref(0);
const currentArticle = computed(() => articles.value[currentArticleIndex.value] || {});

function setCurrentArticle(index) {
  currentArticleIndex.value = index;
}

/* ────────────────
   Navigation
──────────────── */
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % totalSlides;
};
const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + totalSlides) % totalSlides;
};
const togglePause = () => {
  isPaused.value = !isPaused.value;
};

/* ────────────────
   Auto-Rotation
──────────────── */
const startAutoRotate = () => {
  clearInterval(intervalId);
  intervalId = setInterval(() => {
    if (!isPaused.value) nextSlide();
  }, 10000); // rotates every 10s
};

onUnmounted(() => clearInterval(intervalId));

/* ────────────────
   CSV Loading + Cleaning
──────────────── */
onMounted(async () => {
  // 🗺️ Load university data
  points.value = await loadCSV("/Mozilla-Education-Impact/data/universities.csv");

  // 📰 Load and clean article data
  const rawArticles = await loadCSV("/Mozilla-Education-Impact/data/articles.csv");

  articles.value = rawArticles.map((a) => {
    const title = (a.title || "").trim();
    const author = (a.author || "").trim();
    const summaryRaw = (a.summary || "").trim();

    // Remove duplicated title from start of summary
    const regex = new RegExp(`^${title}[\\s:–—-]*`, "i");
    const summary = summaryRaw.replace(regex, "").trim();

    return {
      title,
      author,
      date: a.date,
      summary,
      link: a.link,
    };
  });

  startAutoRotate();
});

/* ────────────────
   Filters + Totals
──────────────── */
const uniqueCategories = computed(() =>
  [...new Set(points.value.map((p) => p.category).filter(Boolean))]
);

const uniqueCountries = computed(() =>
  [...new Set(
    points.value
      .map((p) => p.country?.trim() || p.Country?.trim() || "")
      .filter(Boolean)
  )]
);

const filteredPoints = computed(() =>
  points.value.filter((p) => {
    const matchCategory = selectedCategory.value
      ? p.category === selectedCategory.value
      : true;
    const matchCountry = selectedCountry.value
      ? p.country === selectedCountry.value
      : true;
    return matchCategory && matchCountry;
  })
);

const totalStudents = computed(() =>
  filteredPoints.value.reduce((sum, p) => sum + (p.students || 0), 0)
);

const totalFaculty = computed(() =>
  filteredPoints.value.reduce((sum, p) => sum + (p.faculty || 0), 0)
);
</script>



<style>
/* ===========================
   🔹 FONTS
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
   🔹 PAGE TITLES
=========================== */
.top-section {
  position: relative;
  z-index: 30;
  background: #fff;
  padding: 40px 60px 20px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}
.left-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
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
}

.carousel {
  display: flex;
  transition: transform 0.8s ease-in-out;
  width: 100%;
  height: 100%;
}

.carousel-slide {
  flex: 0 0 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
}

/* calculate slide translation */
.carousel-wrapper > .carousel {
  transform: translateX(calc(-100% * var(--slide-index, 0)));
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
  box-sizing: border-box;
}
.globe-section canvas {
  position: relative;
  z-index: 1;
  width: 100% !important;
  height: 100% !important;
  object-fit: contain;
}

/* ===========================
   🔹 FILTERS SECTION
=========================== */
.filters-section {
  position: relative;
  z-index: 5;
  background: #fff;
  margin-top: 1rem;
  padding: 1rem 0;
  text-align: center;
  box-sizing: border-box;
}
.filter-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5em;
  flex-wrap: wrap;
}
.filter-group label {
  font-weight: 600;
  color: #000;
  margin-right: 0.3rem;
}
.filter-group select {
  background: #F06C13;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.4em 0.6em;
  cursor: pointer;
  font-family: 'Mozilla Text', sans-serif;
  font-weight: 600;
  transition: background 0.3s ease;
}
.filter-group select:hover {
  background: #d85d10;
}
.filters-section .totals {
  color: #000;
  font-size: 16px;
  margin-top: 0.5rem;
}

/* ===========================
   🔹 VIDEO SECTION
=========================== */
.video-section {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 40px;
  padding-bottom: 20px;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 40px;
  box-sizing: border-box;
}
.article-display {
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
}
.article-display h3 {
  font-size: 1.5rem;
  margin-bottom: 0.2rem;
}
.article-author {
  font-size: 0.95rem;
  color: #333;
  font-style: italic;
  margin: 0.2rem 0 0.4rem;
}
.article-date {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 0.5rem;
  font-style: italic;
}
.article-summary {
  display: -webkit-box;
  -webkit-line-clamp: 3; /* limit summary to 3 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  max-height: calc(1.4em * 3);
  color: #222;
  margin-bottom: 0.5rem;
}
.article-display a {
  display: inline-block;
  margin-top: 0.5rem;
  font-weight: 600;
  color: #000;
  text-decoration: none;
  transition: color 0.3s ease;
}
.article-display a:hover {
  color: #F06C13;
}

/* ===========================
   🔹 TIMELINE SECTION
=========================== */
.timeline-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 2rem;
}
.timeline-container {
  overflow-x: auto !important;
  scroll-snap-type: none !important;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

/* ===========================
   🔹 CAROUSEL CONTROLS
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
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.arrow-img,
.pause-img {
  width: 64px;
  height: auto;
  object-fit: contain;
  opacity: 0.9;
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.arrow-btn:hover .arrow-img,
.pause-img:hover {
  transform: scale(1.1);
  opacity: 1;
}

/* ===========================
   🔹 PAUSE BUTTON ANIMATION
=========================== */
@keyframes pause-pulse {
  0% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 0.9; }
}
.pause-img.pulsing {
  animation: pause-pulse 1.2s ease-in-out infinite;
  transform-origin: center center;
}
.pause-img.paused {
  filter: grayscale(100%) brightness(0.8);
}

/* ===========================
   🔹 RESPONSIVE
=========================== */
@media (max-width: 900px) {
  .page-title { font-size: 28px; }
  .carousel-controls { bottom: 20px; gap: 1rem; }
  .filters-section { padding: 20px; }
  .video-section { padding: 20px; }
  .articles-section { padding: 20px; }
}
</style>
