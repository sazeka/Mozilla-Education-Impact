<template>
  <div class="timeline-container">
    <div class="timeline-scroll" ref="timeline">
      <div
        v-for="(article, index) in sortedArticles"
        :key="index"
        class="timeline-card"
        :class="{ active: index === currentArticleIndex }"
        @click="$emit('select-article', index)"
      >
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <h3>{{ article.title }}</h3>
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

const sortedArticles = computed(() =>
  [...props.articles].sort((a, b) => new Date(a.date) - new Date(b.date))
);

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
  justify-content: center;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 0.75rem 0;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

.timeline-scroll {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
  flex-wrap: nowrap;
}

/* ===========================
   🔹 TIMELINE CARD
=========================== */
.timeline-card {
  flex: 0 0 auto;
  width: 160px;
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  padding: 0.8rem 0.6rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.timeline-card:hover {
  transform: translateY(-4px);
  border-color: #2563eb;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.timeline-card.active {
  background: #2563eb;
  color: #fff;
  border-color: #2563eb;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

/* ===========================
   🔹 DOT INDICATOR
=========================== */
.timeline-dot {
  width: 10px;
  height: 10px;
  background-color: #2563eb;
  border-radius: 50%;
  margin: 0 auto 0.4rem;
  transition: background-color 0.3s ease;
}
.timeline-card.active .timeline-dot {
  background-color: #ffffff;
}

/* ===========================
   🔹 CARD TEXT
=========================== */
.timeline-content h3 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #111827;
  line-height: 1.3;
  margin-bottom: 0.25rem;
  white-space: normal;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* limit long titles */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.timeline-content .author {
  font-size: 0.75rem;
  color: #6b7280;
  font-style: italic;
  margin-bottom: 0.25rem;
  display: block;
}

.timeline-content .date {
  font-size: 0.75rem;
  color: #6b7280;
}

/* ===========================
   🔹 ACTIVE STATE TEXT
=========================== */
.timeline-card.active .timeline-content h3,
.timeline-card.active .timeline-content .author,
.timeline-card.active .timeline-content .date {
  color: #ffffff;
}

/* ===========================
   🔹 SCROLLBAR STYLE
=========================== */
.timeline-container::-webkit-scrollbar {
  height: 8px;
}
.timeline-container::-webkit-scrollbar-thumb {
  background-color: #9ca3af;
  border-radius: 10px;
}

/* ===========================
   🔹 RESPONSIVE
=========================== */
@media (max-width: 768px) {
  .timeline-card {
    width: 140px;
    padding: 0.6rem;
  }
  .timeline-content h3 {
    font-size: 0.85rem;
  }
}
</style>

