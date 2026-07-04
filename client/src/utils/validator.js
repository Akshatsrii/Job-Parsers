export function isValidUrl(value) {
  if (!value || typeof value !== "string") return false;
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateUrlInput(value) {
  const trimmed = (value || "").trim();
  if (!trimmed) {
    return { valid: false, message: "Please paste a job URL" };
  }
  if (!isValidUrl(trimmed)) {
    return { valid: false, message: "Please enter a valid URL (must start with http:// or https://)" };
  }
  return { valid: true, message: "" };
}
