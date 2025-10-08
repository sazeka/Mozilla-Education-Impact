<template>
  <div>
    <h1 class="page-title">Mozilla Education Impact</h1>
    <p class="totals">
      Total Universities: {{ points.length }} &nbsp; | &nbsp;
      Total Students: {{ totalStudents.toLocaleString() }} &nbsp; | &nbsp;
      Total Faculty: {{ totalFaculty.toLocaleString() }}
    </p>

    <!-- 🔹 New split container -->
    <div class="content-split">
      <div class="globe-section">
        <InteractiveGlobe :points="points" />
      </div>

      <div class="video-section">
        <VideoCarousel />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import InteractiveGlobe from './components/InteractiveGlobe.vue';
import VideoCarousel from "@/components/VideoCarousel.vue";

const points = [
  // ----------------- 🇰🇪 Kenya -----------------
  {
    name: "Dedan Kimathi University of Technology",
    lat: -0.3956,
    lng: 36.9570,
    description: "Located in Nyeri, Kenya.",
    students: 194,
    faculty: 24,
    category: "Responsible Computing Challenge",
    leadPI: "Dr George Musumba",
    projectTitle: "Mainstreaming Ethics Risk in Computer Programming"
  },
  {
    name: "The University of Nairobi",
    lat: -1.2798,
    lng: 36.8172,
    description: "Largest university in Kenya.",
    students: 166,
    faculty: 2,
    category: "Responsible Computing Challenge",
    leadPI: "Dr Elisha Abade",
    projectTitle: "BESTe-CS: Blending Ethics, Society and Technology through Computer Science"
  },
  {
    name: "Meru University",
    lat: 0.1046,
    lng: 37.6528,
    description: "Public university in Meru County.",
    students: 563,
    faculty: 6,
    category: "Responsible Computing Challenge",
    leadPI: "Dr Mary Mwadulo",
    projectTitle: "Student Team Dynamics"
  },
  {
    name: "Kirinyaga University",
    lat: -0.6238,
    lng: 37.3281,
    description: "Public university in Central Kenya.",
    students: 209,
    faculty: 11,
    category: "Responsible Computing Challenge",
    leadPI: "Dr Kennedy Malanga",
    projectTitle: "Responsible Computing Animated"
  },
  {
    name: "University of Embu",
    lat: -0.5303,
    lng: 37.4575,
    description: "Growing institution in Embu.",
    students: 100,
    faculty: 9,
    category: "Responsible Computing Challenge",
    leadPI: "Dr Victoria Mukami",
    projectTitle: "Innovative multidisciplinary ethically informed student projects through critical and design thinking"
  },
  {
    name: "Riara University",
    lat: -1.3027,
    lng: 36.7848,
    description: "Private university in Nairobi.",
    students: 188,
    faculty: 9,
    category: "Responsible Computing Challenge",
    leadPI: "Prof Felix Musau",
    projectTitle: "RAPID Computing Using Problem-Based Learning Approach"
  },
  {
    name: "Jomo Kenyatta University of Agriculture and Technology",
    lat: -1.1012,
    lng: 37.0120,
    description: "Tech-focused university in Juja.",
    students: 112,
    faculty: 6,
    category: "Responsible Computing Challenge",
    leadPI: "Dr Eunice Njeri",
    projectTitle: "Teaching Responsible Computing using Robotics"
  },
  {
    name: "Kisii University",
    lat: -0.6817,
    lng: 34.7652,
    description: "Public university in Kisii County.",
    students: 215,
    faculty: 8,
    category: "Responsible Computing Challenge",
    leadPI: "Dr Fredrick Awuor",
    projectTitle: "Ethical AI"
  },

  // ----------------- 🇮🇳 India -----------------
  {
    name: "Marian College Kuttikkanam Autonomous",
    lat: 9.6027,
    lng: 76.9935,
    description: "Autonomous college in Kerala, India.",
    students: 217,
    faculty: 7,
    leadPI: "Lead PI Name Here",
    projectTitle: "Project Title Here"
  },
  {
    name: "IIT Indore",
    lat: 22.5215,
    lng: 75.9235,
    description: "Indian Institute of Technology in Indore.",
    students: 12,
    faculty: 1,
    leadPI: "Lead PI Name Here",
    projectTitle: "Project Title Here"
  },

  // ----------------- 🇮🇳 India -----------------
  {
    name: "Marian College Kuttikkanam Autonomous",
    lat: 9.6027,
    lng: 76.9935,
    description: "Autonomous college in Kerala, India.",
    students: 217,
    faculty: 7
  },
  {
    name: "IIT Indore",
    lat: 22.5215,
    lng: 75.9235,
    description: "Indian Institute of Technology in Indore.",
    students: 12,
    faculty: 1
  },
  {
    name: "Ashoka University",
    lat: 28.9405,
    lng: 77.6368,
    description: "Private liberal arts university in Haryana.",
    students: 165,
    faculty: 3
  },
  {
    name: "IIT Guwahati",
    lat: 26.1878,
    lng: 91.6911,
    description: "Leading IIT in Assam, India.",
    students: 0,
    faculty: 4
  },
  {
    name: "Shri Vile Parle Kelavani Mandal’s Dwarkadas J. Sanghvi College of Engineering",
    lat: 19.1034,
    lng: 72.8366,
    description: "Private engineering college in Mumbai.",
    students: 179,
    faculty: 5
  },
  {
    name: "NIT Warangal",
    lat: 17.9784,
    lng: 79.5941,
    description: "National Institute of Technology in Telangana.",
    students: 180,
    faculty: 3
  },
  {
    name: "IIIT Kottayam",
    lat: 9.6431,
    lng: 76.7798,
    description: "Indian Institute of Information Technology in Kerala.",
    students: 117,
    faculty: 5
  },
  {
    name: "CHRIST (Deemed to be University)",
    lat: 12.9352,
    lng: 77.6068,
    description: "Major private university in Bengaluru.",
    students: 450,
    faculty: 7
  },
  {
    name: "Kerala University of Digital Sciences, Innovation and Technology",
    lat: 8.5560,
    lng: 76.8812,
    description: "New digital university in Kerala.",
    students: 0,
    faculty: 4
  },
  // ----------------- 🇿🇦 South Africa -----------------
{
  name: "University of Cape Town",
  lat: -33.9570,
  lng: 18.4607,
  description: "Embedding conceptual tools for ethical engagement in technical engineering content",
  students: 0,
  faculty: 0
},
{
  name: "University of Witwatersrand",
  lat: -26.1929,
  lng: 28.0300,
  description: "Leading research university in Johannesburg.",
  students: 0,
  faculty: 0
},
{
  name: "University of the Western Cape",
  lat: -33.9321,
  lng: 18.6323,
  description: "Public university in Bellville.",
  students: 0,
  faculty: 0
},
{
  name: "Central University of Technology, Free State",
  lat: -29.1183,
  lng: 26.2140,
  description: "Tech university in Bloemfontein.",
  students: 0,
  faculty: 0
},
{
  name: "University of Pretoria",
  lat: -25.7545,
  lng: 28.2314,
  description: "One of the largest universities in South Africa.",
  students: 0,
  faculty: 0
},
{
  name: "University of Fort Hare",
  lat: -32.7869,
  lng: 26.8336,
  description: "Historic institution in Alice.",
  students: 0,
  faculty: 0
},
{
  name: "Durban University of Technology",
  lat: -29.8532,
  lng: 30.9257,
  description: "Multicampus university in Durban.",
  students: 0,
  faculty: 0
},
{
  name: "Sol Plaatje University",
  lat: -28.7382,
  lng: 24.7636,
  description: "New public university in Kimberley.",
  students: 0,
  faculty: 0
},
// ----------------- 🇺🇸 United States -----------------
{
  name: "Adelphi University",
  lat: 40.7209,
  lng: -73.6524,
  description: "Private university in New York.",
  students: 40,
  faculty: 500,
  category: "Responsible Computing Challenge",
  leadPI: "Dr Suraj Uttamchandani",
  projectTitle: "Spatial Justice as a Bridge to Responsible Computing"
},
{
  name: "Allegheny College",
  lat: 41.6484,
  lng: -80.1468,
  description: "Private liberal arts college in Pennsylvania.",
  students: 751,
  faculty: 55
},
{
  name: "Bemidji State University",
  lat: 47.4724,
  lng: -94.8805,
  description: "Public university in Minnesota.",
  students: 1815,
  faculty: 2
},
{
  name: "Bowdoin College",
  lat: 43.9024,
  lng: -69.9646,
  description: "Highly ranked liberal arts college in Maine.",
  students: 464,
  faculty: 2
},
{
  name: "Bucknell University",
  lat: 40.9542,
  lng: -76.8850,
  description: "Private university in Pennsylvania.",
  students: 325,
  faculty: 6
},
{
  name: "Columbia University In The City Of New York",
  lat: 40.8075,
  lng: -73.9626,
  description: "Ivy League university in NYC.",
  students: 1040,
  faculty: 28
},
{
  name: "Georgetown University",
  lat: 38.9076,
  lng: -77.0723,
  description: "Prestigious university in Washington, D.C.",
  students: 387,
  faculty: 20
},
{
  name: "Georgia Institute of Technology",
  lat: 33.7756,
  lng: -84.3963,
  description: "Top-ranked tech university in Georgia.",
  students: 600,
  faculty: 6
},
{
  name: "Harvard College",
  lat: 42.3770,
  lng: -71.1167,
  description: "Oldest university in the US, in Massachusetts.",
  students: 5811,
  faculty: 9
},
{
  name: "Howard University",
  lat: 38.9226,
  lng: -77.0190,
  description: "Historic HBCU in Washington, D.C.",
  students: 154,
  faculty: 5
},
{
  name: "Miami Dade College",
  lat: 25.7776,
  lng: -80.1918,
  description: "Large public college in Florida.",
  students: 760,
  faculty: 1
},
{
  name: "Michigan State University",
  lat: 42.7018,
  lng: -84.4822,
  description: "Public research university in Michigan.",
  students: 79,
  faculty: 4
},
{
  name: "Northeastern University",
  lat: 42.3398,
  lng: -71.0892,
  description: "Private research university in Massachusetts.",
  students: 10145,
  faculty: 21
},
{
  name: "Prairie View A&M University",
  lat: 30.0955,
  lng: -95.9860,
  description: "Historically Black university in Texas.",
  students: 140,
  faculty: 6
},
{
  name: "San José State University",
  lat: 37.3352,
  lng: -121.8811,
  description: "Public university in Silicon Valley.",
  students: 1300,
  faculty: 8
},
{
  name: "Santa Clara University",
  lat: 37.3496,
  lng: -121.9390,
  description: "Private Jesuit university in California.",
  students: 600,
  faculty: 1
},
{
  name: "Stillman College",
  lat: 33.2042,
  lng: -87.5795,
  description: "HBCU in Alabama.",
  students: 3425,
  faculty: 5
},
{
  name: "University at Buffalo",
  lat: 43.0008,
  lng: -78.7870,
  description: "Part of the SUNY system in New York.",
  students: 3398,
  faculty: 21
},
{
  name: "UC Berkeley",
  lat: 37.8719,
  lng: -122.2585,
  description: "Top public university in California.",
  students: 20550,
  faculty: 42
},
{
  name: "UC Davis",
  lat: 38.5382,
  lng: -121.7617,
  description: "UC system school near Sacramento.",
  students: 125,
  faculty: 1
},
{
  name: "University of Colorado",
  lat: 40.0076,
  lng: -105.2659,
  description: "Public research university in Boulder.",
  students: 1000,
  faculty: 7
},
{
  name: "University of Maryland, Baltimore County",
  lat: 39.2557,
  lng: -76.7116,
  description: "UMBC is a public university in Maryland.",
  students: 240,
  faculty: 1
},
{
  name: "University of Michigan",
  lat: 42.2780,
  lng: -83.7382,
  description: "Top public university in Michigan.",
  students: 51,
  faculty: 6
},
{
  name: "University of Notre Dame",
  lat: 41.7034,
  lng: -86.2386,
  description: "Private Catholic research university in Indiana.",
  students: 100,
  faculty: 11
},
{
  name: "University of Pennsylvania",
  lat: 39.9522,
  lng: -75.1932,
  description: "Ivy League university in Philadelphia.",
  students: 172,
  faculty: 4
},
{
  name: "University of Utah",
  lat: 40.7608,
  lng: -111.8910,
  description: "Public university in Salt Lake City.",
  students: 1800,
  faculty: 8
},
{
  name: "University of Washington",
  lat: 47.6553,
  lng: -122.3035,
  description: "Large public research university in Seattle.",
  students: 704,
  faculty: 82
},
{
  name: "Winston-Salem State University",
  lat: 36.0896,
  lng: -80.2264,
  description: "HBCU in North Carolina.",
  students: 160,
  faculty: 11
}


];

// 🧮 Compute totals
const totalStudents = computed(() =>
  points.reduce((sum, u) => sum + (u.students || 0), 0)
);
const totalFaculty = computed(() =>
  points.reduce((sum, u) => sum + (u.faculty || 0), 0)
);
</script>

<style>
body {
  background-color: #000;
  color: white;
  margin: 0;
  padding: 0;
  font-family: sans-serif;
}

.page-title {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 5;
  color: white;
  font-family: sans-serif;
  font-size: 24px;
}

.totals {
  position: absolute;
  top: 60px;
  left: 20px;
  z-index: 5;
  color: white;
  font-family: sans-serif;
  font-size: 16px;
}

.content-split {
  display: flex;
  flex-direction: row;         /* horizontal layout */
  align-items: center;         /* vertically centers both */
  justify-content: space-between;
  margin-top: 140px;           /* keeps both below title & totals */
  width: 100%;
  gap: 40px;                   /* space between globe & video */
  padding: 0 40px;
}

.globe-section {
  flex: 1 1 50%;
  display: flex;
  justify-content: center;     /* centers globe horizontally in its half */
  align-items: center;         /* centers vertically */
  height: 70vh;                /* adjust height for visual balance */
  position: relative;
}

.video-section {
  flex: 1 1 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
  position: relative;
}

/* Mobile responsiveness */
@media (max-width: 900px) {
  .content-split {
    flex-direction: column; /* stack only on small screens */
    align-items: center;
  }

  .globe-section,
  .video-section {
    width: 100%;
  }
}
</style>

