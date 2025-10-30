<template>
  <div class="timeline-container">
    <div class="timeline-scroll" ref="timeline">
      <div
          v-for="(article, index) in props.articles"
          :key="index"
          class="timeline-card"
          :class="[
            article.type?.toLowerCase(),  // 👈 dynamically adds a class like 'news', 'blog', 'event', etc.
            { active: index === currentArticleIndex }
          ]"
          @click="$emit('select-article', index)"
        >

        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <h3>{{ article.title }}</h3>
          <p v-if="article.publication" class="publication">{{ article.publication }}</p>
          <p class="date">{{ new Date(article.date).toLocaleDateString() }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  articles: { type: Array, required: true },
  currentArticleIndex: { type: Number, default: 0 },
});

const timeline = ref(null);

// Auto-scroll to the active article in view
watch(
  () => props.currentArticleIndex,
  (index) => {
    const cards = timeline.value?.querySelectorAll(".timeline-card");
    const card = cards?.[index];
    if (card) card.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }
);
</script>

<style scoped>
/* ===========================
   🔹 TIMELINE CONTAINER
=========================== */
.timeline-container {
  display: flex;
  justify-content: flex-start;
  overflow: visible; /* ✅ remove internal scroll */
  padding: 0.75rem 0;
  width: 100%;
  box-sizing: border-box;
}

.timeline-scroll {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  width: 100%;
}

/* ===========================
   🔹 TIMELINE CARD BASE
=========================== */
.timeline-card {
  flex: 1 1 auto;
  width: 100%;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  padding: 1rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* ===========================
   🔹 CARD COLORS BY TYPE
=========================== */

/* 📰 News */
.timeline-card.news {
  background-color: #FF9E5F;
  border-color: #FF9E5F;
}

/* ✍️ Blog */
.timeline-card.blog {
  background-color: #FFFF6C;
  border-color: #FFFF6C;
}

/* 🎟️ Event */
.timeline-card.event {
  background-color: #86FF81;
  border-color: #86FF81;
}

/* 🧠 Conference */
.timeline-card.conference {
  background-color: #7DEDF6;
  border-color: #7DEDF6;
}

/* 🧠 Journal */
.timeline-card.journal {
  background-color: #F7F7F7;
  border-color: #F7F7F7;
}

/* Default (no type) */
.timeline-card:not(.news):not(.blog):not(.event):not(.conference):not(.journal) {
  background-color: #f9fafb;
  border-color: #e5e7eb;
}

/* ===========================
   🔹 HOVER + ACTIVE STATES
=========================== */
.timeline-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Active: keep color, add glow */
.timeline-card.active {
  box-shadow: 0 0 15px rgba(35, 165, 233, 0.5);
  border-color: #2563eb;
  transform: translateY(-2px);
  filter: brightness(1.05);
}

/* ===========================
   🔹 TEXT STYLING
=========================== */
.timeline-content h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  line-height: 1.3;
  margin-bottom: 0.25rem;
  white-space: normal;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.timeline-content .publication {
  font-size: 0.85rem;
  color: #333;
  font-style: italic;
  margin-top: 0.25rem;
}

.timeline-content .date {
  font-size: 0.8rem;
  color: #444;
}

/* ===========================
   🔹 RESPONSIVE
=========================== */
@media (max-width: 900px) {
  .timeline-card {
    padding: 0.8rem;
  }
  .timeline-content h3 {
    font-size: 0.9rem;
  }
}
</style>

