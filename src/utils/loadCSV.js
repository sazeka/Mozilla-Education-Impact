import Papa from "papaparse";

export async function loadCSV(filePath) {
  const response = await fetch(filePath);
  if (!response.ok) {
    console.error("❌ Failed to fetch CSV:", filePath, response.status);
    return [];
  }

  const text = await response.text();
  const { data, errors } = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
  });

  if (errors.length) console.warn("⚠️ CSV parse errors:", errors);

  // ✅ Normalize headers
  const normalizedData = data.map(row => {
    const normalized = {};
    for (const key in row) {
      normalized[key.trim().toLowerCase()] = row[key]?.trim();
    }
    return normalized;
  });

  // ✅ Special handling for university CSVs
  if (filePath.includes("universities")) {
    return normalizedData.map(item => ({
      name: item.name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lng),
      description: item.description,
      students: parseInt(item.students) || 0,
      faculty: parseInt(item.faculty) || 0,
      category: item.category,
      leadPI: item.leadpi,
      projectTitle: item.projecttitle,
      country: item.country,
    }));
  }

  // ✅ For all other CSVs (like articles)
  return normalizedData;
}
