/**
 * Validates parsed job object.
 * Returns true if valid, throws an error if it lacks basic details (like title AND company).
 */
export function validateJobData(data) {
  if (!data) {
    throw new Error("Parser output was empty");
  }

  const hasTitle = data.title && data.title !== "Job Title Not Found";
  const hasCompany = data.company && data.company !== "Company Name Not Found";

  // If both key identifiers are missing, reject
  if (!hasTitle && !hasCompany) {
    throw new Error("Unable to parse job details. Please ensure the URL belongs to a valid job posting page.");
  }

  return true;
}
