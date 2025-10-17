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
              <div class="filter-group">
                <label for="country">Filter by Country:</label>
                <select id="country" v-model="selectedCountry">
                  <option value="">All</option>
                  <option v-for="country in uniqueCountries" :key="country" :value="country">
                    {{ country }}
                  </option>
                </select>
              </div>

              <div class="filter-group">
                <label for="category">Filter by Program:</label>
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
            <div class="carousel-track">
              <div
                v-for="article in articles"
                :key="article.title"
                class="carousel-item"
              >
                <h3>{{ article.title }}</h3>
                <p>{{ article.summary }}</p>
                <a :href="article.link" target="_blank">Read more →</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 🔹 Controls -->
      <div class="carousel-controls">
        <button @click="prevSlide">‹</button>
        <button @click="nextSlide">›</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import InteractiveGlobe from './components/InteractiveGlobe.vue';
import VideoCarousel from "@/components/VideoCarousel.vue";
import { loadCSV } from "@/utils/loadCSV.js";

// 🔹 Carousel state
const currentSlide = ref(0);
const totalSlides = 3;

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % totalSlides;
};
const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + totalSlides) % totalSlides;
};

// Auto-rotate every 20s
onMounted(() => {
  setInterval(nextSlide, 20000);
});

// 🔹 Articles Data
const articles = [
  {
    title: "Algorithmic Bias, Marketplaces, and Diversity Regulation",
    summary: "Lance (Yong) Park (Howard University, RCC USA) Presenting paper at TPRC53 August 1, 2024.",
    link: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4912069"
  },
  {
    title: "Bridging Technology, Ethics and Rural Justice",
    summary: "Marco Robinson (Prairie View A&M, RCC USA) Published article June 20, 2025.",
    link: "https://www.pvamu.edu/research/post/bridging-technology-ethics-and-rural-justice-pvamu-team-receives-mozilla-funding/"
  },
  {
    title: "Inclusive Computing Education",
    summary: "Centering ethics, justice, and collaboration in CS classrooms.",
    link: "https://example.com/inclusive-computing"
  }
];

// 🔹 Data + Filters
const points = ref([]);
const selectedCategory = ref('');
const selectedCountry = ref('');

onMounted(async () => {
  points.value = await loadCSV("/Mozilla-Education-Impact/data/universities.csv");
});

// Computed Filters
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

// Totals
const totalStudents = computed(() =>
  filteredPoints.value.reduce((sum, p) => sum + (p.students || 0), 0)
);
const totalFaculty = computed(() =>
  filteredPoints.value.reduce((sum, p) => sum + (p.faculty || 0), 0)
);
</script>

<style>
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
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  border: none;
  padding: 0.6em 1.2em;
  font-size: 1.8rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(3px);
}
.carousel-controls button:hover {
  background: #EED800;
  color: #000;
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
.filters-section {
  position: relative;
  z-index: 5;
  background: #fff;
  width: 100%;
  text-align: center;
  padding: 20px 40px 40px;
  margin-top: 0;
  box-sizing: border-box;
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
.filters-section select {
  background: #111;
  color: #fff;
  border: 1px solid #333;
  border-radius: 6px;
  padding: 0.4em 0.6em;
  cursor: pointer;
  font-family: 'Mozilla Text', sans-serif;
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
  width: 100%;
  padding: 40px;
  box-sizing: border-box;
  margin-top: 40px;
}
.articles-section .carousel-track {
  display: flex;
  gap: 2rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 1rem;
}
.articles-section .carousel-item {
  flex: 0 0 250px;
  scroll-snap-align: start;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 1rem;
  color: #000;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.articles-section .carousel-item h3 {
  font-size: 1rem;
  margin-bottom: 0.3rem;
  color: #000;
}
.articles-section .carousel-item p {
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 0.5rem;
}
.articles-section .carousel-item a {
  color: #EED800;
  font-weight: bold;
  text-decoration: none;
}
.articles-section .carousel-item a:hover {
  text-decoration: underline;
}
.articles-section .carousel-track::-webkit-scrollbar {
  height: 6px;
}
.articles-section .carousel-track::-webkit-scrollbar-thumb {
  background: #EED800;
  border-radius: 4px;
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
