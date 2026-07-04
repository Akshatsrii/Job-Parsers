import { extractInternshala } from "./extractors/internshala.js";
import { extractAmbitionBox } from "./extractors/ambitionbox.js";
import { extractLinkedIn } from "./extractors/linkedin.js";
import { extractNaukri } from "./extractors/naukri.js";
import { extractIndeed } from "./extractors/indeed.js";
import { extractFoundit } from "./extractors/foundit.js";
import { extractGlassdoor } from "./extractors/glassdoor.js";
import { extractCompanyCareer } from "./extractors/companyCareer.js";
import { extractGeneric } from "./extractors/generic.js";

/**
 * Returns the extraction function for the given platform name
 */
export function getExtractor(platform) {
  switch (platform) {
    case "internshala":
      return extractInternshala;
    case "ambitionbox":
      return extractAmbitionBox;
    case "linkedin":
      return extractLinkedIn;
    case "naukri":
      return extractNaukri;
    case "indeed":
      return extractIndeed;
    case "foundit":
      return extractFoundit;
    case "glassdoor":
      return extractGlassdoor;
    case "greenhouse":
    case "lever":
      return extractCompanyCareer;
    case "generic":
    default:
      return extractGeneric;
  }
}
