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
    <button @click="activePoint = null">Close</button>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from 'vue';
import Globe from 'globe.gl';
import { feature } from 'topojson-client';
import { geoContains } from 'd3-geo';

const props = defineProps({
  points: Array
});

const globeContainer = ref(null);
const activePoint = ref(null);
const cardStyle = reactive({ left: '0px', top: '0px' });

onMounted(async () => {
  const globe = Globe()(globeContainer.value)
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
    .pointLat(d => d.lat)
    .pointLng(d => d.lng)
    .pointAltitude(0.05)
    .pointColor(() => '#F06C13') // Color of the pins
    .pointsData(props.points)
    .onPointClick(handlePointClick);

  const res = await fetch('https://unpkg.com/world-atlas/countries-110m.json');
  const worldData = await res.json();

  const countries = feature(worldData, worldData.objects.countries).features;

  countries.forEach(country => {
    country.hasPin = props.points.some(point =>
      geoContains(country, [point.lng, point.lat])
    );
  });

  globe
    .polygonsData(countries)
    .polygonCapColor(f => f.hasPin ? '#EED800 ' : 'rgba(255,255,255,0.05)') // Colors of the fill for countries
    .polygonSideColor(() => 'rgba(0, 100, 0, 0.1)')
    .polygonStrokeColor(() => '#EED800') // Colors of the country borders
    .polygonAltitude(0.01);
});

function handlePointClick(point, event) {
  activePoint.value = point;
  cardStyle.left = `${event.clientX + 10}px`;
  cardStyle.top = `${event.clientY + 10}px`;
}
</script>

<style scoped>
.globe-container {
  width: 100%;
  height: 100vh;
  background: black;
  position: relative;
  overflow: hidden;
}

.info-card {
  position: fixed;
  background: white;
  padding: 1em;
  border-radius: 8px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.4);
  z-index: 10;
  min-width: 220px;
}

.stats {
  margin-top: 0.5em;
  background: #f0f0f0;
  padding: 0.5em;
  border-radius: 6px;
}
</style>
