<template>
  <!-- Globe only; no internal card -->
  <div ref="globeContainer" class="globe-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive, watch } from 'vue';
import Globe from 'globe.gl';
import { feature } from 'topojson-client';
import { geoContains } from 'd3-geo';
import * as THREE from 'three';

// Props & Emits
const props = defineProps({ points: { type: Array, default: () => [] } });
const emit = defineEmits(['point-click']);

const globeContainer = ref(null);
let globe;
let countries = [];
let resizeFn;

// 🌍 Setup globe
onMounted(async () => {
  globe = Globe()(globeContainer.value)
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
    .pointLat(d => Number(d.lat))
    .pointLng(d => Number(d.lng))
    .pointAltitude(0.05)
    .pointColor(() => '#F06C13')
    .pointsData(props.points)
    .onPointClick(handlePointClick);

  // white page bg
  globe.scene().background = new THREE.Color(0xffffff);

  // Load map data once
  const res = await fetch('https://unpkg.com/world-atlas/countries-110m.json');
  const worldData = await res.json();
  countries = feature(worldData, worldData.objects.countries).features;
  updateCountries();

  // Size to container
  const resizeGlobe = () => {
    if (!globeContainer.value) return;
    const { clientWidth, clientHeight } = globeContainer.value;
    globe.width(clientWidth);
    globe.height(clientHeight);
  };
  resizeFn = resizeGlobe;
  resizeGlobe();
  window.addEventListener('resize', resizeGlobe);
});

onUnmounted(() => {
  if (resizeFn) window.removeEventListener('resize', resizeFn);
});

// 🔁 Smooth transition when filtered points change
watch(
  () => props.points,
  async (newPoints) => {
    if (!globe) return;

    // Fade out old pins
    const materials = globe.pointsData().map(d => d.__threeObj?.material).filter(Boolean);
    await fadePins(materials, 1, 0, 300);

    // Swap data
    globe.pointsData([]);
    globe.pointsData(newPoints);

    // Fade in new pins
    const newMaterials = globe.pointsData().map(d => d.__threeObj?.material).filter(Boolean);
    await fadePins(newMaterials, 0, 1, 300);

    updateCountries();
  },
  { deep: true }
);

// 🔹 Helper: animate opacity over time
function fadePins(materials, from, to, duration) {
  return new Promise(resolve => {
    const start = performance.now();
    function animate(time) {
      const t = Math.min((time - start) / duration, 1);
      const value = from + (to - from) * t;
      materials.forEach(mat => {
        if (mat && mat instanceof THREE.Material) {
          mat.opacity = value;
          mat.transparent = true;
        }
      });
      if (t < 1) requestAnimationFrame(animate);
      else resolve();
    }
    requestAnimationFrame(animate);
  });
}

// 🔹 Update highlighted countries
function updateCountries() {
  if (!globe || !countries.length) return;
  countries.forEach(c => {
    c.hasPin = props.points.some(p => geoContains(c, [Number(p.lng), Number(p.lat)]));
  });

  globe
    .polygonsData(countries)
    .polygonCapColor(f => f.hasPin ? '#EED800' : 'rgba(255,255,255,0.05)')
    .polygonSideColor(() => 'rgba(0, 100, 0, 0.1)')
    .polygonStrokeColor(() => '#EED800')
    .polygonAltitude(0.01);
}

// 🔹 Emit to parent -> parent opens the shared card
function handlePointClick(point) {
  emit('point-click', point);
}
</script>

<style scoped>
.globe-container {
  position: relative;
  width: 100%;
  max-width: 750px;
  height: 420px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  overflow: hidden;
}

@media (max-width: 900px) {
  .globe-container {
    max-width: 90%;
    height: 320px;
  }
}
</style>
