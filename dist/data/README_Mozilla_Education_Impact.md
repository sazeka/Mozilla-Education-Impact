# 🦊 Mozilla Education Impact

A dynamic, data-driven web experience visualizing Mozilla’s global educational collaborations and projects.  
Built with **Vue 3 + Vite**, the site integrates interactive data visualization, storytelling, and multimedia content to highlight Mozilla’s educational impact across the world.

---

## 🌍 Project Overview

The Mozilla Education Impact site combines:

- **Interactive Globe** — visualize partner universities and research collaborations across countries.  
- **Data Filters** — filter by country or program to explore specific project groups.  
- **Auto-Rotating Carousel** — cycles between global data, featured stories, and news.  
- **Video & Articles Sections** — highlight stories, publications, and ongoing initiatives.  
- **Brand Styling** — uses Mozilla’s design language (orange `#F06C13`, hand-drawn scribbles, and custom fonts).

---

## ⚙️ Tech Stack

| Category | Tools |
|-----------|--------|
| Frontend Framework | [Vue 3](https://vuejs.org/) |
| Build Tool | [Vite](https://vite.dev/) |
| CSV Parsing | [PapaParse](https://www.papaparse.com/) |
| Globe Visualization | Custom `InteractiveGlobe.vue` (WebGL / Three.js or D3.js) |
| Styling | CSS3 with Mozilla brand theme |
| Deployment | Compatible with GitHub Pages, Netlify, or Vercel |

---

## 🧩 Project Structure

```
Mozilla-Education-Impact/
│
├── public/
│   └── data/
│       ├── universities.csv     # All global university points
│       ├── articles.csv         # Article data with title, date, image, link
│
├── src/
│   ├── assets/
│   │   ├── fonts/               # Mozilla Headline font files
│   │   ├── images/              # Scribble graphics
│   │   └── globe/               # Globe textures or 3D assets
│   ├── components/
│   │   ├── InteractiveGlobe.vue # Interactive globe visualization
│   │   └── VideoCarousel.vue    # Embedded video carousel
│   ├── utils/
│   │   └── loadCSV.js           # Loads and parses CSV files via PapaParse
│   ├── App.vue                  # Main application layout
│   └── main.js                  # Vue entry file
│
├── vite.config.js               # Vite configuration
├── package.json                 # Dependencies and scripts
└── README.md                    # Project documentation
```

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/Mozilla-Education-Impact.git
cd Mozilla-Education-Impact
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run locally
```bash
npm run dev
```
The app will be available at **http://localhost:5173**

### 4. Build for production
```bash
npm run build
```

### 5. Preview the build
```bash
npm run preview
```

---

## 🗂️ Data Files

### `/data/universities.csv`
| name | lat | lng | description | students | faculty | category | country |
|------|-----|-----|--------------|-----------|----------|-----------|----------|
Used by the interactive globe to plot global collaboration points.

### `/data/articles.csv`
| title | summary | link | date | image |
|--------|----------|------|------|--------|
Displayed in the **Articles Carousel** section under “Our latest news”.

---

## 🖋️ Brand & Design Notes

- **Primary Color:** `#F06C13` (Mozilla Orange)  
- **Typography:** `Mozilla Headline` (custom) + `Mozilla Text` fallback  
- **Iconography:** Hand-drawn “scribble” assets from Mozilla’s brush set  
- **Tone:** Human, creative, and data-informed — aligned with Mozilla’s education narrative  

---

## 💡 Key Features

- 🌐 Interactive 3D globe for global data visualization  
- 🧭 Dynamic filtering by country and program  
- 📰 Auto-sliding articles with responsive images  
- 🎥 Multimedia storytelling carousel  
- 🧱 Lightweight & fast (built on Vite)  
- 🎨 Custom Mozilla brand visuals and animations  

---

## 🤝 Contributing

Pull requests are welcome!  
If you’d like to contribute:

1. Fork the repo  
2. Create a new branch (`feature/new-component`)  
3. Commit changes with descriptive messages  
4. Open a Pull Request explaining your enhancement  

---

## 🧠 Future Enhancements

- Add search functionality for universities  
- Integrate live data API for partnerships and projects  
- Include accessibility enhancements (WCAG compliance)  
- Add localization for multiple languages  

---

## 🪪 License

This project is open source under the **Mozilla Public License 2.0 (MPL-2.0)**.  
See [LICENSE](https://www.mozilla.org/en-US/MPL/) for details.
