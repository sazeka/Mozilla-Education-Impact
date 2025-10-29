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
.timeline-container {
  display: flex;
  justify-content: center;     /* ✅ center timeline track */
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 0.5rem 0;
}

.timeline-scroll {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;     /* ✅ center cards inside track */
  flex-wrap: nowrap;
}

.timeline-card {
  flex: 0 0 auto;
  width: 160px;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  padding: 0.6rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.timeline-card h3 {
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.2;
  margin: 0.3rem 0;
  color: #111827;
  white-space: normal;
  word-break: break-word;
}

.timeline-card.active {
  background: #2563eb;
  color: #fff;
  border-color: #2563eb;
}


.timeline-card:hover {
  transform: translateY(-4px);
  border-color: #2563eb;
}

.timeline-card.active {
  background: #2563eb;
  color: #fff;
  border-color: #2563eb;
}
.timeline-dot {
  width: 10px;
  height: 10px;
  background-color: #2563eb;
  border-radius: 50%;
  margin: 0 auto 0.4rem;
}
.timeline-card.active .timeline-dot {
  background-color: #fff;
}
.date {
  font-size: 0.85rem;
  color: #6b7280;
}
</style>
