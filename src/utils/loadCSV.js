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

  // ✅ Normalize headers (make lowercase and trim)
  const normalizedData = data.map(row => {
    const normalized = {};
    for (const key in row) {
      normalized[key.trim().toLowerCase()] = row[key]?.trim() || "";
    }
    return normalized;
  });

  return normalizedData;
}
