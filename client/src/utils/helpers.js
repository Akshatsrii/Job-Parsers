export function classNames(...args) {
  return args.filter(Boolean).join(" ");
}

export function downloadFile(filename, content, mimeType = "application/json") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function jsonToCsv(jobData) {
  if (!jobData) return "";
  const rows = [];
  rows.push(["Field", "Value"]);
  rows.push(["Title", jobData.title || ""]);
  rows.push(["Company", jobData.company || ""]);
  rows.push(["Location", jobData.location || ""]);
  rows.push(["Salary", jobData.salary || ""]);
  rows.push(["Experience", jobData.experience || ""]);
  rows.push(["Skills", (jobData.skills || []).join("; ")]);
  rows.push(["Source URL", jobData.sourceUrl || ""]);

  return rows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
}

export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
