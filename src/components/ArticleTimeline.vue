<template>
  <div class="timeline-container">
    <div class="timeline-scroll" ref="timeline">
      <div
      v-for="(article, index) in props.articles"
        :key="index"
        class="timeline-card"
        :class="{ active: index === currentArticleIndex }"
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
  overflow-y: auto;
  scroll-behavior: smooth;
  padding: 0.75rem 0;  
  width: 100%;
  height: 100%;
  max-height: 75vh;
  margin: 0;
  box-sizing: border-box;
}

.timeline-scroll {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  width: 100%;
}

/* ===========================
   🔹 TIMELINE CARD
=========================== */
.timeline-card {
  flex: 1 1 auto;              /* ⬅️ cards grow to fill width */
  width: 100%;                 /* ⬅️ fully responsive */
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  padding: 1rem;
  text-align: left;            /* ⬅️ aligns better for wide cards */
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.timeline-card:hover {
  transform: translateY(-2px);
  border-color: #2563eb;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.timeline-card.active {
  background: #23A5E9;
  color: #fff;
  border-color: #2563eb;
  box-shadow: 0 4px 12px rgba(35, 165, 233, 0.4);
}

/* ===========================
   🔹 DOT INDICATOR
=========================== */
.timeline-dot {
  display: none;
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
  color: #6b7280;
  font-style: italic;
  margin-top: 0.25rem;
}

.timeline-content .date {
  font-size: 0.8rem;
  color: #6b7280;
}

.timeline-card.active .timeline-content h3,
.timeline-card.active .timeline-content .publication,
.timeline-card.active .timeline-content .date {
  color: #ffffff;
}

/* ===========================
   🔹 SCROLLBAR STYLE
=========================== */
.timeline-container::-webkit-scrollbar {
  width: 8px;
}
.timeline-container::-webkit-scrollbar-thumb {
  background-color: #9ca3af;
  border-radius: 10px;
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

