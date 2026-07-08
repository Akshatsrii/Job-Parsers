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

  if (jobData.isJobList && Array.isArray(jobData.jobs)) {
    rows.push(["Index", "Job Title", "Company", "Location", "Salary", "Experience", "Work Mode", "Skills", "Apply URL"]);
    jobData.jobs.forEach((job, index) => {
      rows.push([
        index + 1,
        job.title || "",
        job.company || "",
        job.location || "",
        job.salary || "",
        job.experience || "",
        job.workMode || "",
        (job.skills || []).join("; "),
        job.applyUrl || ""
      ]);
    });
  } else if (jobData.isCompanyList && Array.isArray(jobData.companies)) {
    rows.push(["Index", "Company Name", "Rating", "Reviews", "Company Type", "Headquarters", "Company Age", "No. of Employees"]);
    jobData.companies.forEach((company, index) => {
      rows.push([
        index + 1,
        company.name || "",
        company.rating || "",
        company.reviews || "",
        company.companyType || "",
        company.headquarters || "",
        company.companyAge || "",
        company.noOfEmployee || ""
      ]);
    });
  } else {
    rows.push(["Field", "Value"]);
    rows.push(["Title", jobData.title || ""]);
    rows.push(["Company", jobData.company || ""]);
    rows.push(["Location", jobData.location || ""]);
    rows.push(["Salary", jobData.salary || ""]);
    rows.push(["Experience", jobData.experience || ""]);
    rows.push(["Skills", (jobData.skills || []).join("; ")]);
    rows.push(["Source URL", jobData.sourceUrl || ""]);
  }

  return rows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
}

export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
