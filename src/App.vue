<template>
  <div>
    <!-- 🔹 Top row: Left info (title, filter, totals) + Right carousel -->
    <div class="top-section">
      <div class="left-info">
        <h1 class="page-title">Mozilla Education Impact</h1>

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

      <!-- 🔹 Carousel now aligned to the right of the entire left column -->
      <div class="right-carousel">
        <div class="carousel-track">
          <div v-for="article in articles" :key="article.title" class="carousel-item">
            <h3>{{ article.title }}</h3>
            <p>{{ article.summary }}</p>
            <a :href="article.link" target="_blank">Read more →</a>
          </div>
        </div>
      </div>
    </div>

    <!-- 🔹 Globe + Video -->
    <div class="content-split">
      <div class="globe-section">
        <InteractiveGlobe :points="filteredPoints" />
      </div>
      <div class="video-section">
        <div class="video-container">
          <VideoCarousel />
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

/* Regular */
@font-face {
  font-family: 'Mozilla Text';
  src: url('./assets/fonts/MozillaText-Regular.woff2') format('woff2'),
       url('./assets/fonts/MozillaText-Regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

/* Medium */
@font-face {
  font-family: 'Mozilla Text';
  src: url('./assets/fonts/MozillaText-Medium.woff2') format('woff2'),
       url('./assets/fonts/MozillaText-Medium.woff') format('woff');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

/* SemiBold */
@font-face {
  font-family: 'Mozilla Text';
  src: url('./assets/fonts/MozillaText-SemiBold.woff2') format('woff2'),
       url('./assets/fonts/MozillaText-SemiBold.woff') format('woff');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

/* Bold */
@font-face {
  font-family: 'Mozilla Text';
  src: url('./assets/fonts/MozillaText-Bold.woff2') format('woff2'),
       url('./assets/fonts/MozillaText-Bold.woff') format('woff');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

/* Italic */
@font-face {
  font-family: 'Mozilla Text';
  src: url('./assets/fonts/MozillaText-Italic.woff2') format('woff2'),
       url('./assets/fonts/MozillaText-Italic.woff') format('woff');
  font-weight: 400;
  font-style: italic;
  font-display: swap;
}

body {
  font-family: 'Mozilla Text', sans-serif;
  background-color: #fff;
  color: #000;
  margin: 0;
  padding: 0;
}

/* Headings slightly heavier */
h1, h2, h3, h4, h5 {
  font-weight: 600;
}

/* 🔹 TOP SECTION */
.top-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 40px;
  gap: 40px;
  flex-wrap: nowrap;
  box-sizing: border-box;
}

/* Left info column */
.left-info {
  flex: 0 1 40%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.page-title {
  font-size: 28px;
  color: #000;
  margin: 0;
  line-height: 1.2;
}

.filter-bar {
  display: flex;
  align-items: center;
  gap: 0.5em;
  font-size: 1rem;
  flex-wrap: wrap;
}

.filter-bar select {
  background: #111;
  color: #fff;
  border: 1px solid #333;
  border-radius: 6px;
  padding: 0.4em 0.6em;
  cursor: pointer;
}

.totals {
  color: #000;
  font-size: 16px;
  margin: 0;
}

/* Right column (Articles Carousel) */
.right-carousel {
  flex: 1 1 50%;
  padding-left: 40px;        
  overflow: hidden;
  box-sizing: border-box;
  position: relative;
  z-index: 10;
}

.carousel-track {
  display: flex;
  gap: 2rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 1rem;
}

.carousel-item {
  flex: 0 0 250px;
  scroll-snap-align: start;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 1rem;
  color: #000;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.carousel-item h3 {
  font-size: 1rem;
  margin-bottom: 0.3rem;
  color: #000;
}

.carousel-item p {
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.carousel-item a {
  color: #EED800;
  font-weight: bold;
  text-decoration: none;
}

.carousel-item a:hover {
  text-decoration: underline;
}

/* scrollbar styling */
.carousel-track::-webkit-scrollbar {
  height: 6px;
}
.carousel-track::-webkit-scrollbar-thumb {
  background: #EED800;
  border-radius: 4px;
}

/* 🔹 GLOBE + VIDEO */
.content-split {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  margin-top: -30px;
  width: 100%;
  gap: 40px;
  padding: 0 40px;
  box-sizing: border-box;
}

.globe-section {
  flex: 1 1 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
  position: relative;
  z-index: 1;
}


/* Right video column */
.video-section {
  flex: 1 1 50%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding-left: 40px;        /* ✅ same left padding as .right-carousel */
  text-align: center;
  box-sizing: border-box;
}


.video-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 1rem;
}

/* 🔹 RESPONSIVE */
@media (max-width: 900px) {
  .top-section {
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 20px;
  }

  .left-info {
    flex: 1 1 100%;
    text-align: center;
    align-items: center;
  }

  .right-carousel {
    flex: 1 1 100%;
  }

  .carousel-item {
    flex: 0 0 220px;
  }

  .content-split {
    flex-direction: column;
    align-items: center;
    padding: 0 20px;
    gap: 20px;
  }

  .globe-section,
  .video-section {
    width: 100%;
    height: auto;
  }

  .video-section {
    padding-right: 0;
  }
}

</style>

