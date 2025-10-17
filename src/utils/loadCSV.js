import Papa from "papaparse";

export async function loadCSV(filePath) {
  const response = await fetch(filePath);
  const text = await response.text();

  const { data } = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
  });

  // ✅ Normalize keys to lowercase and include all expected fields
  return data.map(rawItem => {
    const item = {};
    for (const key in rawItem) {
      if (Object.hasOwn(rawItem, key)) {
        item[key.trim().toLowerCase()] = rawItem[key]?.trim();
      }
    }

    return {
      name: item.name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lng),
      description: item.description,
      students: parseInt(item.students) || 0,
      faculty: parseInt(item.faculty) || 0,
      category: item.category,
      leadPI: item.leadpi,
      projectTitle: item.projecttitle,
      country: item.country, // ✅ added
    };
  });
}
