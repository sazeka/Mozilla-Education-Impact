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
          <div class="globe-layout">
            <!-- 🌍 Globe -->
            <div class="globe-section">
              <InteractiveGlobe :points="displayPoints" />
            </div>

            <!-- 🏫 University List -->
            <aside class="university-panel">
              <div class="panel-header">
                <span>Universities ({{ universities.length }})</span>
                <button
                  v-if="selectedUniversity"
                  class="clear-btn"
                  @click="selectedUniversity = ''"
                  title="Clear selection"
                >
                  Clear
                </button>
              </div>

              <input
                v-model="uniQuery"
                class="uni-search"
                type="search"
                placeholder="Search university…"
                aria-label="Search university"
              />

              <ul class="uni-list">
                <li
                  v-for="u in visibleUniversities"
                  :key="u.name"
                  class="uni-item"
                  :class="{ active: u.name === selectedUniversity }"
                  @click="selectedUniversity = (u.name === selectedUniversity ? '' : u.name)"
                  title="Click to filter the globe"
                >
                  <span class="uni-name">{{ u.name }}</span>
                  <span class="uni-count" v-if="u.count > 1">{{ u.count }}</span>
                </li>
              </ul>
            </aside>
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
            <div class="articles-layout" v-if="sortedArticles.length">
              <!-- 🕒 Timeline Sidebar -->
              <div class="timeline-sidebar">
              <!-- 🔹 Legend stays visible -->
              <div class="article-key">
                <div
                  v-for="type in articleTypes"
                  :key="type.value"
                  class="key-item"
                  :class="[type.value, { active: selectedType === type.value }]"
                  @click="toggleTypeFilter(type.value)"
                >
                  <span class="color-box"></span> {{ type.label }}
                </div>
              </div>

              <!-- 🔹 Only this wrapper scrolls -->
              <div class="timeline-scroll-wrapper">
                <ArticleTimeline
                  :articles="sortedArticles"
                  :currentArticleIndex="currentArticleIndex"
                  @select-article="setCurrentArticle"
                />
              </div>
            </div>



              <!-- 📰 Main Article Display -->
              <div class="article-display" v-if="hasArticle">
                <h3>{{ currentArticle.title }}</h3>

                <p class="article-author" v-if="currentArticle.author">
                  By {{ currentArticle.author }}
                </p>

                <p class="article-publication" v-if="currentArticle.publication">
                  Published in {{ currentArticle.publication }}
                </p>

                <p class="article-date" v-if="formattedDate">{{ formattedDate }}</p>

                <p class="article-summary" v-if="currentArticle.summary">
                  {{ currentArticle.summary }}
                </p>

                <a v-if="currentArticle.link" :href="currentArticle.link" target="_blank" rel="noopener">
                  Read more →
                </a>
              </div>
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
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import InteractiveGlobe from "./components/InteractiveGlobe.vue";
import VideoCarousel from "@/components/VideoCarousel.vue";
import { loadCSV } from "@/utils/loadCSV.js";
import ArticleTimeline from "@/components/ArticleTimeline.vue";

/* ────────────────
   Carousel / Slides
──────────────── */
const currentSlide = ref(0);
const totalSlides = 3;
const isPaused = ref(false);
let intervalId = null;

const nextSlide = () => { currentSlide.value = (currentSlide.value + 1) % totalSlides; };
const prevSlide = () => { currentSlide.value = (currentSlide.value - 1 + totalSlides) % totalSlides; };
const togglePause = () => { isPaused.value = !isPaused.value; };

const startAutoRotate = () => {
  clearInterval(intervalId);
  intervalId = setInterval(() => { if (!isPaused.value) nextSlide(); }, 10000);
};
onUnmounted(() => clearInterval(intervalId));

/* ────────────────
   Data / State
──────────────── */
const points = ref([]);          // universities
const articles = ref([]);        // articles

// Filters + list state
const selectedCategory = ref("");
const selectedCountry  = ref("");
const selectedUniversity = ref("");
const uniQuery = ref("");

// Articles state
const selectedType = ref(""); // "", "news", "blog", "event", "conference", "journal"
const currentArticleIndex = ref(0);

const articleTypes = [
  { value: "news",       label: "News" },
  { value: "blog",       label: "Blogs" },
  { value: "event",      label: "Events" },
  { value: "conference", label: "Conferences" },
  { value: "journal",    label: "Journals" },
];

/* ────────────────
   Filters + Totals (declare BEFORE anything that uses them)
──────────────── */
const uniqueCategories = computed(() =>
  [...new Set(points.value.map(p => p.category).filter(Boolean))]
);

const uniqueCountries = computed(() =>
  [...new Set(
    points.value
      .map(p => (p.country && p.country.trim?.()) || (p.Country && p.Country.trim?.()) || "")
      .filter(Boolean)
  )]
);

const filteredPoints = computed(() =>
  points.value.filter(p => {
    const matchCategory = selectedCategory.value ? p.category === selectedCategory.value : true;
    const matchCountry  = selectedCountry.value  ? p.country  === selectedCountry.value  : true;
    return matchCategory && matchCountry;
  })
);

const totalStudents = computed(() =>
  filteredPoints.value.reduce((sum, p) => sum + (parseInt(p.students) || 0), 0)
);
const totalFaculty = computed(() =>
  filteredPoints.value.reduce((sum, p) => sum + (parseInt(p.faculty) || 0), 0)
);

/* ────────────────
   University list (depends on filteredPoints)
──────────────── */
function getUniName(p) {
  return (
    p.university || p.University || p.name || p.Name || p.institution || p.school || ""
  ).toString().trim();
}

const universities = computed(() => {
  const counts = new Map();
  for (const p of filteredPoints.value) {
    const name = getUniName(p);
    if (!name) continue;
    counts.set(name, (counts.get(name) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
});

const visibleUniversities = computed(() => {
  const q = uniQuery.value.trim().toLowerCase();
  if (!q) return universities.value;
  return universities.value.filter(u => u.name.toLowerCase().includes(q));
});

// Points sent to the globe (apply university selection on top of other filters)
const displayPoints = computed(() => {
  if (!selectedUniversity.value) return filteredPoints.value;
  return filteredPoints.value.filter(p => getUniName(p) === selectedUniversity.value);
});

// Clear selection if current filters remove it
watch(filteredPoints, () => {
  if (
    selectedUniversity.value &&
    !filteredPoints.value.some(p => getUniName(p) === selectedUniversity.value)
  ) {
    selectedUniversity.value = "";
  }
});

/* ────────────────
   Articles + Timeline
──────────────── */
const sortedArticles = computed(() => {
  let list = [...articles.value].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  if (selectedType.value) list = list.filter(a => a.type === selectedType.value);
  return list;
});

const hasArticle = computed(() => sortedArticles.value.length > 0);

const currentArticle = computed(() =>
  hasArticle.value ? sortedArticles.value[currentArticleIndex.value] : null
);

const formattedDate = computed(() => {
  const d = currentArticle.value?.date;
  const dt = d ? new Date(d) : null;
  return dt && !Number.isNaN(dt.getTime())
    ? dt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "";
});

function setCurrentArticle(index) {
  const max = Math.max(0, sortedArticles.value.length - 1);
  currentArticleIndex.value = Math.min(Math.max(0, index), max);
}

watch(sortedArticles, (list) => {
  if (list.length === 0) currentArticleIndex.value = 0;
  else if (currentArticleIndex.value >= list.length) currentArticleIndex.value = 0;
});

function toggleTypeFilter(type) {
  selectedType.value = (selectedType.value === type ? "" : type);
  currentArticleIndex.value = 0;
}

/* ────────────────
   CSV Loading + Cleaning
──────────────── */
onMounted(async () => {
  // 🗺️ Universities
  points.value = await loadCSV("/Mozilla-Education-Impact/data/universities.csv");

  // 📰 Articles
  const rawArticles = await loadCSV("/Mozilla-Education-Impact/data/articles.csv");
  articles.value = rawArticles.map(a => {
    const title = (a.title || "").trim();
    const author = (a.author || "").trim();
    const summaryRaw = (a.summary || "").trim();
    const regex = new RegExp(`^${title}[\\s:–—-]*`, "i");
    const summary = summaryRaw.replace(regex, "").trim();

    let cleanType = (a.type || "").trim().toLowerCase();
    if (cleanType === "confrence") cleanType = "conference";
    if (!["event","news","blog","conference","journal"].includes(cleanType)) cleanType = "";

    return {
      title,
      author,
      date: a.date,
      summary,
      link: a.link,
      publication: a.publication?.trim() || "",
      type: cleanType,
    };
  });

  startAutoRotate();
});
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

/* Layout to place list at the right of the globe */
.globe-layout {
  display: grid;
  grid-template-columns: 1fr 380px; /* globe | list */
  gap: 1.5rem;
  align-items: start;
  width: min(1200px, 92vw);
  margin: 0 auto;
}

/* Panel */
.university-panel {
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 0.75rem;
  max-height: 400px;
  overflow: hidden; /* header + search fixed, list scrolls */
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.clear-btn {
  background: transparent;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.2rem 0.5rem;
  cursor: pointer;
}
.clear-btn:hover { background: #e5e7eb; }

/* Search */
.uni-search {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.45rem 0.6rem;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
  outline: none;
}
.uni-search:focus { border-color: #9ca3af; }

/* List */
.uni-list {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  flex: 1;
}
.uni-list::-webkit-scrollbar { width: 8px; }
.uni-list::-webkit-scrollbar-thumb {
  background: #cbd5e1; border-radius: 8px;
}

.uni-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.4rem;
  border-bottom: 1px dashed #e5e7eb;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.15s ease;
}
.uni-item:hover { background: #eef2ff; transform: translateX(2px); }

.uni-item.active {
  background: #e0e7ff;
  outline: 2px solid #c7d2fe;
}

.uni-name { font-size: 0.95rem; line-height: 1.2; }
.uni-count {
  font-size: 0.8rem;
  background: #111827; color: #fff;
  padding: 0.1rem 0.4rem; border-radius: 999px;
}

/* Responsive */
@media (max-width: 900px) {
  .globe-layout {
    grid-template-columns: 1fr;
  }
  .university-panel {
    max-height: 260px;
  }
}


/* ===========================
   🔹 CAROUSEL CORE
=========================== */
.carousel-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden; /* keep the viewport fixed */
}

.carousel-slide {
  flex: 0 0 100%;
  height: 100%;              /* 👈 use full height instead of min-height */
  overflow: hidden;          /* no outer scroll */
}

.carousel {
  display: flex;
  transition: transform 0.8s ease-in-out;
  width: 100%;
  height: 100%;
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
  padding-top: 10px;        /* ↓ was 40px — brings video closer to title */
  padding-bottom: 10px;     /* less vertical space below */
  margin-top: -40px;        /* ✅ lifts the section up further */
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
   🔹 ARTICLE TYPE LEGEND
=========================== */
.article-key {
  position: sticky;
  top: 0;
  z-index: 5;
  background: #fff;
  padding: 0.5rem 0;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.key-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  font-weight: 500;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.key-item:hover {
  transform: scale(1.05);
  opacity: 0.8;
}

.key-item.active {
  outline: 2px solid #2563eb;
  border-radius: 8px;
  padding: 0.2rem 0.4rem;
}

.color-box {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 2px solid #d1d5db;
}

/* Match new timeline colors */
.key-item.news .color-box {
  background-color: #FF9E5F;
  border-color: #FF9E5F;
}
.key-item.blog .color-box {
  background-color: #FFFF6C;
  border-color: #FFFF6C;
}
.key-item.event .color-box {
  background-color: #86FF81;
  border-color: #86FF81;
}
.key-item.conference .color-box {
  background-color: #7DEDF6;
  border-color: #7DEDF6;
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
  padding: 10px 40px; /* less padding */
  box-sizing: border-box;
  flex-grow: 1;
  margin-top: -40px; /* 👈 raises the section upward */
}
.article-display {
  text-align: center;
  max-width: 700px;
  margin: -40px auto 0; 
  position: relative;
  z-index: 2;
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
.article-publication {
  font-size: 0.95rem;
  color: #333;
  font-style: italic;
  margin: 0.2rem 0 0.4rem;
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

/* ===========================
   🔹 ARTICLES SIDE-BY-SIDE LAYOUT (WIDER)
=========================== */
.articles-layout {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 90vw;              /* ⬅️ use more of the screen width */
  max-width: 1600px;        /* ⬅️ much wider than before */
  gap: 3rem;                /* more breathing room between columns */
  margin-top: 2rem;
}

.timeline-sidebar {
  display: flex;
  flex-direction: column;
  flex: 0 0 400px;
  max-height: 75vh;
  overflow: hidden; 
  border-right: none;
  padding-right: 1.5rem;
  transform: scale(0.95);
  transform-origin: top left;
}

/* Inner scroll container */
.timeline-scroll-wrapper {
  flex: 1;
  overflow-y: auto; /* ✅ only this scrolls */
  padding-right: 0.5rem;
}

/* Make sure scrollbar looks clean */
.timeline-scroll-wrapper::-webkit-scrollbar {
  width: 8px;
}
.timeline-scroll-wrapper::-webkit-scrollbar-thumb {
  background-color: #9ca3af;
  border-radius: 10px;
}


.article-display {
  flex: 1;
  max-width: 900px;         /* ⬅️ allow article section to expand */
  text-align: left;
  padding-left: 1.5rem;
}
.article-display h3 {
  font-size: 1.8rem;
  margin-bottom: 0.6rem;
}


</style>
