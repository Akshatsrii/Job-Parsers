export function formatSalary(salary) {
  if (!salary) return "Not disclosed";
  return String(salary).trim();
}

export function truncateText(text, maxLength = 220) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export function formatDate(dateInput) {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getDomainFromUrl(url) {
  try {
    const { hostname } = new URL(url);
    return hostname.replace("www.", "");
  } catch {
    return "";
  }
}

export function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
