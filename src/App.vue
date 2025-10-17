<template>
  <div>
    <!-- 🔹 Titles at top -->
    <div class="top-section">
      <div class="left-info">
        <h1 class="page-title">Mozilla Education:</h1>
        <h1 class="page-title">Showing our impact</h1>
      </div>
    </div>

    <!-- 🔹 Globe first -->
    <div class="globe-section">
      <InteractiveGlobe :points="filteredPoints" />
    </div>

    <!-- 🔹 Filters + Totals now BELOW globe -->
    <div class="filters-section">
      <div class="filter-bar">
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

    <!-- 🔹 Then video -->
    <div class="video-section">
      <div class="video-container">
        <VideoCarousel />
      </div>
    </div>

    <!-- 🔹 Then articles -->
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
</template>



<script setup>
import { ref, computed, onMounted } from 'vue';
import InteractiveGlobe from './components/InteractiveGlobe.vue';
import VideoCarousel from "@/components/VideoCarousel.vue";
import { loadCSV } from "@/utils/loadCSV.js";

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

// 🔹 Data and filters
const points = ref([]);
const selectedCategory = ref('');
const selectedCountry = ref('');

// 🔹 Load CSV (note updated path)
onMounted(async () => {
  points.value = await loadCSV("/Mozilla-Education-Impact/data/universities.csv");

  console.log("✅ First row:", points.value[0]);
  console.log("✅ CSV Keys:", Object.keys(points.value[0]));
});


// 🔹 Dropdown options
const uniqueCategories = computed(() =>
  [...new Set(points.value.map(p => p.category).filter(Boolean))]
);
const uniqueCountries = computed(() => {
  if (!points.value.length) return [];
  return [...new Set(points.value
    .map(p => p.country?.trim() || p.Country?.trim() || '')
    .filter(Boolean)
  )];
});


// 🔹 Combined filters
const filteredPoints = computed(() => {
  return points.value.filter(p => {
    const matchCategory = selectedCategory.value ? p.category === selectedCategory.value : true;
    const matchCountry = selectedCountry.value ? p.country === selectedCountry.value : true;
    return matchCategory && matchCountry;
  });
});

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
   🔹 FONT IMPORTS
=========================== */
@font-face {
  font-family: 'Mozilla Text';
  src: url('./assets/fonts/MozillaText-Regular.woff2') format('woff2'),
       url('./assets/fonts/MozillaText-Regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Mozilla Text';
  src: url('./assets/fonts/MozillaText-Medium.woff2') format('woff2'),
       url('./assets/fonts/MozillaText-Medium.woff') format('woff');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Mozilla Text';
  src: url('./assets/fonts/MozillaText-SemiBold.woff2') format('woff2'),
       url('./assets/fonts/MozillaText-SemiBold.woff') format('woff');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Mozilla Text';
  src: url('./assets/fonts/MozillaText-Bold.woff2') format('woff2'),
       url('./assets/fonts/MozillaText-Bold.woff') format('woff');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Mozilla Text';
  src: url('./assets/fonts/MozillaText-Italic.woff2') format('woff2'),
       url('./assets/fonts/MozillaText-Italic.woff') format('woff');
  font-weight: 400;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: 'Mozilla Headline';
  src: url('./assets/fonts/MozillaHeadline-SemiBold.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

/* ===========================
   🔹 GLOBAL STYLES
=========================== */
body {
  font-family: 'Mozilla Text', sans-serif;
  background-color: #fff;
  color: #000;
  margin: 0;
  padding: 0;
}

h1, h2, h3, h4, h5 {
  font-weight: 600;
}

/* ===========================
   🔹 TOP SECTION
=========================== */
.top-section {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 40px;
  box-sizing: border-box;
  position: relative;
  z-index: 10; /* ✅ ensure titles always appear above */
  background: #fff; /* keeps text readable if globe uses transparency */
}

.left-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: 0.3rem;
}

.page-title {
  font-family: 'Mozilla Headline', sans-serif;
  font-size: 36px;
  color: #000;
  margin: 0;
  line-height: 0.9;
}

.page-title + .page-title {
  margin-top: -0.25rem;
}

/* ===========================
   🔹 GLOBE SECTION
=========================== */
.globe-section {
  width: 100%;
  max-width: 1000px;       /* ✅ restricts overall width on load */
  margin: 0 auto;          /* center horizontally */
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1;
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
  max-width: 800px;        /* ✅ cap initial canvas width */
  max-height: 400px;       /* ✅ prevents large startup rendering */
  object-fit: contain;
  display: block;
}

/* ===========================
   🔹 FILTERS + TOTALS BELOW GLOBE (Visible + Not Overlapping)
=========================== */
.filters-section {
  position: relative;
  z-index: 5;
  background: #fff;
  width: 100%;
  text-align: center;
  padding: 20px 40px 40px;
  margin-top: 0; /* ✅ now directly follows the globe */
  box-sizing: border-box;
  display: block;
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
  align-items: flex-start;
  padding: 40px;
  box-sizing: border-box;
  margin-top: 40px;
}

.video-container {
  width: 80%;
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

/* scrollbar styling */
.articles-section .carousel-track::-webkit-scrollbar {
  height: 6px;
}
.articles-section .carousel-track::-webkit-scrollbar-thumb {
  background: #EED800;
  border-radius: 4px;
}

/* ===========================
   🔹 RESPONSIVE DESIGN
=========================== */
@media (max-width: 900px) {
  .top-section {
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
  }

  .page-title {
    font-size: 28px;
  }

  .globe-section {
    padding-bottom: 80px;
  }

  .filters-section {
    margin-top: -40px;
    padding: 20px;
  }

  .filters-section .filter-bar {
    flex-direction: column;
    gap: 10px;
  }

  .video-section {
    padding: 20px;
  }

  .articles-section {
    padding: 20px;
  }

  .articles-section .carousel-item {
    flex: 0 0 220px;
  }
}
</style>

