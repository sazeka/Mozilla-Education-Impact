import Papa from "papaparse";

/**
 * Loads and parses a CSV file, normalizing headers and data fields.
 * Supports article and university CSVs.
 */
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

  // ✅ Normalize headers: trim, lowercase, remove special chars
  const normalizedData = data.map((row) => {
    const normalized = {};
    for (const key in row) {
      const cleanKey = key.trim().toLowerCase();
      normalized[cleanKey] = row[key]?.trim() || "";
    }
    return normalized;
  });

  // ✅ Special handling for article CSVs
if (filePath.includes("articles")) {
  return normalizedData.map((a) => {
    // Clean and normalize the article type
    const cleanType = a.type?.trim().toLowerCase().replace(/\s+/g, "") || "";

    // Handle common typos (optional but helpful)
    const fixedType =
      cleanType === "confrence" ? "conference" : cleanType;

    return {
      title: a.title || "",
      author: a.author || "",
      publication: a.publication || "",
      summary: a.summary || "",
      link: a.link || "",
      date: a.date || "",
      image: a.image || "",
      type: fixedType, // ✅ clean and normalized
    };
  });
}

  // ✅ Default: return normalized rows (for universities or others)
  return normalizedData;
}
