/**
 * Detect the portal type based on the URL domain name
 */
export function detectPlatform(url) {
  if (!url) return "generic";

  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.toLowerCase();

    if (host.includes("internshala.com")) return "internshala";
    if (host.includes("ambitionbox.com")) return "ambitionbox";
    if (host.includes("naukri.com")) return "naukri";
    if (host.includes("indeed.com")) return "indeed";
    if (host.includes("linkedin.com")) return "linkedin";
    if (host.includes("foundit.in") || host.includes("foundit.com")) return "foundit";
    if (host.includes("glassdoor.com") || host.includes("glassdoor.co.in")) return "glassdoor";
    if (host.includes("greenhouse.io")) return "greenhouse";
    if (host.includes("lever.co")) return "lever";

    return "generic";
  } catch (err) {
    // If URL is invalid, return generic
    return "generic";
  }
}
