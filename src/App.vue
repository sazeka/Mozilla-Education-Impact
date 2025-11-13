<template>
  <div>
    <!-- 🔹 Titles -->
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

        <!-- 🌍 SLIDE 1: Globe + University List + Filters -->
        <div class="carousel-slide">
          <div class="globe-layout">
            <!-- 🌍 Interactive Globe -->
            <div class="globe-section">
              <InteractiveGlobe
                ref="globeRef"
                :points="displayPoints"
                @point-click="onPointClick"
              />
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
                  title="Click to filter & open card"
                >
                  <span class="uni-name">{{ u.name }}</span>
                  <span class="uni-count" v-if="u.count > 1">{{ u.count }}</span>
                </li>
              </ul>
            </aside>
          </div>

          <!-- 🪪 University Info Card (shared for pin & list) -->
          <div
            v-if="selectedUniversity && selectedUniversityInfo"
            class="university-card-backdrop"
            @click.self="selectedUniversity = ''"
          >
            <div class="university-card">
              <h3>{{ selectedUniversityInfo.name }}</h3>
              <p v-if="selectedUniversityInfo.country">🌍 {{ selectedUniversityInfo.country }}</p>
              <p v-if="selectedUniversityInfo.category">🎓 Program: {{ selectedUniversityInfo.category }}</p>
              <p v-if="selectedUniversityInfo.students">👩‍🎓 Students: {{ selectedUniversityInfo.students }}</p>
              <p v-if="selectedUniversityInfo.faculty">👨‍🏫 Faculty: {{ selectedUniversityInfo.faculty }}</p>
              <button class="close-card" @click="selectedUniversity = ''">Close</button>
            </div>
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

        <!-- 🎥 SLIDE 2: Video -->
        <div class="carousel-slide">
          <div class="video-section">
            <VideoCarousel />
          </div>
        </div>

        <!-- 📰 SLIDE 3: Articles + Timeline -->
        <div class="carousel-slide">
          <div class="articles-section">
            <div class="articles-layout" v-if="sortedArticles.length">
              <!-- 🕒 Timeline Sidebar -->
              <div class="timeline-sidebar">
                <!-- 🔹 Legend -->
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

                <!-- 🔹 Scrollable Timeline -->
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

                <a
                  v-if="currentArticle.link"
                  :href="currentArticle.link"
                  target="_blank"
                  rel="noopener"
                >
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
   Carousel Logic
──────────────── */
const currentSlide = ref(0);
const totalSlides = 3;
const isPaused = ref(false);
let intervalId = null;

const nextSlide = () => (currentSlide.value = (currentSlide.value + 1) % totalSlides);
const prevSlide = () => (currentSlide.value = (currentSlide.value - 1 + totalSlides) % totalSlides);
const togglePause = () => (isPaused.value = !isPaused.value);

const startAutoRotate = () => {
  clearInterval(intervalId);
  intervalId = setInterval(() => {
    if (!isPaused.value) nextSlide();
  }, 10000);
};
onUnmounted(() => clearInterval(intervalId));

/* ────────────────
   Data + Filters
──────────────── */
const points = ref([]);
const articles = ref([]);

const selectedCategory = ref("");
const selectedCountry = ref("");
const selectedUniversity = ref("");
const uniQuery = ref("");

const selectedType = ref("");
const currentArticleIndex = ref(0);

/* ────────────────
   Article Types
──────────────── */
const articleTypes = [
  { value: "news", label: "News" },
  { value: "blog", label: "Blogs" },
  { value: "event", label: "Events" },
  { value: "conference", label: "Conferences" },
  { value: "journal", label: "Journals" },
];

/* ────────────────
   Filters + Totals
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
    const matchCountry = selectedCountry.value ? p.country === selectedCountry.value : true;
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
   University List + Card
──────────────── */
function getUniName(p) {
  return (
    p.university ||
    p.University ||
    p.name ||
    p.Name ||
    p.institution ||
    p.school ||
    ""
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

const displayPoints = computed(() => {
  if (!selectedUniversity.value) return filteredPoints.value;
  return filteredPoints.value.filter(p => getUniName(p) === selectedUniversity.value);
});

const selectedUniversityInfo = computed(() => {
  if (!selectedUniversity.value) return null;
  const rows = filteredPoints.value.filter(p => getUniName(p) === selectedUniversity.value);
  if (!rows.length) return null;
  const first = rows[0];
  const students = rows.reduce((s, r) => s + (parseInt(r.students) || 0), 0);
  const faculty = rows.reduce((s, r) => s + (parseInt(r.faculty) || 0), 0);
  return {
    name: selectedUniversity.value,
    country: first.country || first.Country || "",
    category: first.category || "",
    students,
    faculty,
  };
});

watch(filteredPoints, () => {
  if (
    selectedUniversity.value &&
    !filteredPoints.value.some(p => getUniName(p) === selectedUniversity.value)
  ) {
    selectedUniversity.value = "";
  }
});

/* ────────────────
   Globe Pin Click Handler
──────────────── */
function onPointClick(payload) {
  let point = payload;
  // If the globe only emits lat/lng, try to match to a CSV row
  if (!point || (!point.university && !point.name && !point.University && !point.Name)) {
    const { lat, lng } = payload || {};
    if (lat != null && lng != null) {
      point = filteredPoints.value.find(
        p => Number(p.lat) === Number(lat) && Number(p.lng) === Number(lng)
      );
    }
  }
  if (!point) return;
  const name = getUniName(point);
  if (name) selectedUniversity.value = name;
}

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
  selectedType.value = selectedType.value === type ? "" : type;
  currentArticleIndex.value = 0;
}

/* ────────────────
   CSV Loading
──────────────── */
onMounted(async () => {
  // 🗺️ Load universities
  points.value = await loadCSV("/Mozilla-Education-Impact/data/universities.csv");

  // 📰 Load articles
  const rawArticles = await loadCSV("/Mozilla-Education-Impact/data/articles.csv");
  articles.value = rawArticles.map(a => {
    const title = (a.title || "").trim();
    const author = (a.author || "").trim();
    const summaryRaw = (a.summary || "").trim();
    const regex = new RegExp(`^${title}[\\s:–—-]*`, "i");
    const summary = summaryRaw.replace(regex, "").trim();

    let cleanType = (a.type || "").trim().toLowerCase();
    if (cleanType === "confrence") cleanType = "conference";
    if (!["event", "news", "blog", "conference", "journal"].includes(cleanType))
      cleanType = "";

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
   🔹 GLOBAL / TYPOGRAPHY
=========================== */
@font-face {
  font-family: 'Mozilla Headline';
  src: url('@/assets/fonts/MozillaHeadline-Regular.woff2') format('woff2'),
       url('@/assets/fonts/MozillaHeadline-Regular.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

body {
  margin: 0;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  background: #fff;
  color: #000;
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
   🔹 CAROUSEL CORE
=========================== */
.carousel-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
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
  overflow: hidden;
}
.carousel-wrapper > .carousel {
  transform: translateX(calc(-100% * var(--slide-index, 0)));
}

/* ===========================
   🔹 GLOBE + UNIVERSITY LIST
=========================== */
.globe-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 1.5rem;
  align-items: start;
  width: min(1200px, 92vw);
  margin: 0 auto;
}
.globe-section {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 45vh;
  max-height: 420px;
  min-height: 280px;
}
.globe-section canvas {
  width: 100% !important;
  height: 100% !important;
  object-fit: contain;
}

/* ===========================
   🔹 UNIVERSITY LIST PANEL
=========================== */
.university-panel {
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 0.75rem;
  max-height: 400px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
  transition: background 0.2s ease;
}
.clear-btn:hover {
  background: #e5e7eb;
}
.uni-search {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.45rem 0.6rem;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
  outline: none;
}
.uni-search:focus {
  border-color: #9ca3af;
}
.uni-list {
  list-style: none;
  margin: 0;
  padding: 0;
  flex: 1;
  overflow-y: auto;
}
.uni-list::-webkit-scrollbar {
  width: 8px;
}
.uni-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 8px;
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
.uni-item:hover {
  background: #eef2ff;
  transform: translateX(2px);
}
.uni-item.active {
  background: #e0e7ff;
  outline: 2px solid #c7d2fe;
}
.uni-name {
  font-size: 0.95rem;
  line-height: 1.2;
}
.uni-count {
  font-size: 0.8rem;
  background: #111827;
  color: #fff;
  padding: 0.1rem 0.4rem;
  border-radius: 999px;
}

/* ===========================
   🔹 UNIVERSITY MODAL CARD
=========================== */
.university-card-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
  backdrop-filter: blur(2px);
}
.university-card {
  background: #fff;
  border-radius: 16px;
  padding: 1.5rem 2rem;
  width: 90%;
  max-width: 420px;
  text-align: center;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
  animation: fadeInUp 0.25s ease-out;
}
.university-card h3 {
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
}
.university-card p {
  margin: 0.25rem 0;
  color: #333;
}
.close-card {
  margin-top: 1rem;
  padding: 0.4rem 1rem;
  background: #F06C13;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s ease;
}
.close-card:hover {
  background: #d85d10;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(15px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ===========================
   🔹 FILTER BAR
=========================== */
.filters-section {
  text-align: center;
  background: #fff;
  padding: 1rem 0;
  margin-top: 1rem;
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
  font-weight: 600;
  transition: background 0.3s ease;
}
.filter-group select:hover {
  background: #d85d10;
}
.totals {
  margin-top: 0.5rem;
  font-size: 16px;
  color: #000;
}

/* ===========================
   🔹 VIDEO SLIDE
=========================== */
.video-section {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-top: -40px;
}

/* ===========================
   🔹 ARTICLE SLIDE LAYOUT + TYPE CHIPS
=========================== */
.articles-layout {
  display: grid !important;
  grid-template-columns: 360px 1fr;
  gap: 2rem;
  align-items: start;
  width: min(1200px, 92vw);
  margin: 2rem auto 0;
}
.timeline-sidebar {
  width: 360px;
  flex: none;
  min-width: 0;
  padding-right: 1rem;
  transform: none !important;
}
.timeline-scroll-wrapper {
  max-height: clamp(320px, 70vh, 780px);
  overflow-y: auto;
  padding-right: 0.5rem;
}
.article-display {
  min-width: 0;
  width: 100%;
  max-width: 780px;
  padding-left: 0;
  text-align: left;
}
.article-display h3 {
  font-size: 1.8rem;
  line-height: 1.2;
  margin-bottom: 0.5rem;
}
.article-author,
.article-publication,
.article-date {
  margin: 0.15rem 0;
}
.article-summary {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ===== Article type chips (legend) ===== */
.article-key {
  position: sticky;
  top: 0;
  z-index: 2;
  background: #fff;
  padding: 0.5rem 0 0.75rem;
  margin-bottom: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem 0.9rem;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
}

.key-item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #fff;
  font-size: 0.9rem;
  line-height: 1;
  cursor: pointer;
  user-select: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
}
.key-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
}
.key-item.active {
  outline: 2px solid #2563eb;
  background: #f8fafc;
}
.color-box {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 2px solid transparent;
}
.key-item.news .color-box       { background-color: #FF9E5F; border-color: #FF9E5F; }
.key-item.blog .color-box       { background-color: #FFFF6C; border-color: #FFFF6C; }
.key-item.event .color-box      { background-color: #86FF81; border-color: #86FF81; }
.key-item.conference .color-box { background-color: #7DEDF6; border-color: #7DEDF6; }
.key-item.journal .color-box    { background-color: #C6A7FF; border-color: #C6A7FF; }

/* ===== Timeline table safety ===== */
.timeline-sidebar table {
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
}
.timeline-sidebar th,
.timeline-sidebar td {
  max-width: 320px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0.4rem 0.25rem;
  vertical-align: middle;
}
.timeline-sidebar tr + tr td {
  border-top: 1px dashed #e5e7eb;
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
  opacity: 0.9;
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.arrow-btn:hover .arrow-img,
.pause-img:hover {
  transform: scale(1.1);
  opacity: 1;
}
@keyframes pause-pulse {
  0% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 0.9; }
}
.pause-img.pulsing {
  animation: pause-pulse 1.2s ease-in-out infinite;
}
.pause-img.paused {
  filter: grayscale(100%) brightness(0.8);
}

/* ✅ Lift article section without clipping the top */
.carousel .carousel-slide:nth-child(3) .articles-section {
  transform: translateY(-50px);  /* adjust -20 to -50 as needed */
  transition: transform 0.3s ease;
  padding-top: 0;
  margin-top: 0;
}

/* Keep enough space so first article isn’t hidden by the page title */
.carousel .carousel-slide:nth-child(3) .articles-layout {
  padding-top: 1rem;  /* ensures top article stays visible */
}

/* Add breathing room above the fixed controls */
.carousel .carousel-slide:nth-child(3) .articles-section {
  padding-bottom: 30px;
}


/* ===========================
   🔹 RESPONSIVE
=========================== */
@media (max-width: 900px) {
  .page-title { font-size: 28px; }
  .globe-layout { grid-template-columns: 1fr; }
  .university-panel { max-height: 260px; }
  .carousel-controls { bottom: 20px; gap: 1rem; }

  .articles-layout {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  .timeline-sidebar {
    width: auto;
    padding-right: 0;
  }
  .article-display {
    max-width: 100%;
  }
}
</style>




