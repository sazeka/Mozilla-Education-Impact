<template>
  <div ref="globeContainer" class="globe-container"></div>

  <div v-if="activePoint" class="info-card" :style="cardStyle">
    <h3>{{ activePoint.name }}</h3>
    <p>{{ activePoint.description }}</p>
      <!-- Lead PI and Project Title -->
    <div v-if="activePoint.leadPI || activePoint.projectTitle" class="project-info">
    <p><strong>Lead PI:</strong> {{ activePoint.leadPI ?? 'N/A' }}</p>
    <p><strong>Project Title:</strong> {{ activePoint.projectTitle ?? 'N/A' }}</p>
  </div>
    <div class="stats">
      <!-- Students and Faculty -->
      <p><strong>Students:</strong> {{ activePoint.students?.toLocaleString() ?? 'N/A' }}</p>
      <p><strong>Faculty:</strong> {{ activePoint.faculty?.toLocaleString() ?? 'N/A' }}</p>
    </div>
    <button class="close-btn" @click="activePoint = null">×</button>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from 'vue';
import Globe from 'globe.gl';
import { feature } from 'topojson-client';
import { geoContains } from 'd3-geo';
import * as THREE from 'three';

const props = defineProps({
  points: Array
});

const globeContainer = ref(null);
const activePoint = ref(null);
const cardStyle = reactive({ left: '0px', top: '0px' });

let globe;
let countries = [];

// 🌍 Setup globe
onMounted(async () => {
  globe = Globe()(globeContainer.value)
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
    .pointLat(d => d.lat)
    .pointLng(d => d.lng)
    .pointAltitude(0.05)
    .pointColor(() => '#F06C13')
    .pointsData(props.points)
    .onPointClick(handlePointClick);

  // Load map data once
  const res = await fetch('https://unpkg.com/world-atlas/countries-110m.json');
  const worldData = await res.json();
  countries = feature(worldData, worldData.objects.countries).features;

  updateCountries();
});

// 🔹 Smooth transition when filtered points change
watch(
  () => props.points,
  async (newPoints, oldPoints) => {
    if (!globe) return;

    // Fade out old pins
    const objects = globe.pointsData();
    if (objects && objects.length) {
      const materials = globe.pointsData().map(d => d.__threeObj?.material).filter(Boolean);
      await fadePins(materials, 1, 0, 400); // fade out
    }

    // Clear and update to new points
    globe.pointsData([]);
    globe.pointsData(newPoints);

    // Fade in new pins
    const newMaterials = globe.pointsData().map(d => d.__threeObj?.material).filter(Boolean);
    await fadePins(newMaterials, 0, 1, 400); // fade in

    updateCountries();
    activePoint.value = null;
  },
  { deep: true }
);

// 🔹 Helper: animate opacity over time
function fadePins(materials, from, to, duration) {
  return new Promise(resolve => {
    const start = performance.now();

    function animate(time) {
      const progress = Math.min((time - start) / duration, 1);
      const value = from + (to - from) * progress;

      materials.forEach(mat => {
        if (mat && mat instanceof THREE.Material) {
          mat.opacity = value;
          mat.transparent = true;
        }
      });

      if (progress < 1) requestAnimationFrame(animate);
      else resolve();
    }

    requestAnimationFrame(animate);
  });
}

// 🔹 Update highlighted countries
function updateCountries() {
  if (!globe || !countries.length) return;

  countries.forEach(c => {
    c.hasPin = props.points.some(p => geoContains(c, [p.lng, p.lat]));
  });

  globe
    .polygonsData(countries)
    .polygonCapColor(f => f.hasPin ? '#EED800' : 'rgba(255,255,255,0.05)')
    .polygonSideColor(() => 'rgba(0, 100, 0, 0.1)')
    .polygonStrokeColor(() => '#EED800')
    .polygonAltitude(0.01);
}

// 🔹 Info card click
function handlePointClick(point) {
  activePoint.value = point;
  cardStyle.left = '50%';
  cardStyle.top = '50%';
}
</script>



<style scoped>
.globe-container {
  position: relative;
  margin-top: 100px; /* pushes it below the header/text */
  width: 50vw;       /* stays on the left half */
  height: calc(100vh - 100px); /* fills remaining space */
  display: flex;
  justify-content: center;
  align-items: center;
  float: left;
}

.info-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  background-color: rgba(17, 17, 17, 0.95);
  color: #fff;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
  max-width: 320px;
  text-align: center;
  transition: all 0.3s ease;
}

.stats {
  margin-top: 0.5em;
  background: #222;         /* darker gray background */
  color: #fff;              /* keep text white */
  padding: 0.5em;
  border-radius: 6px;
  border: 1px solid #444;   /* subtle outline for separation */
}

.close-btn {
  position: absolute;
  top: 8px;
  right: 10px;
  background: none;
  border: none;
  color: #fff;
  font-size: 1.3rem;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: #EED800; /* subtle gold hover highlight */
}

</style>
