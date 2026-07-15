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
 * Platform → Extractor mapping
 */
const extractors = {
  internshala: extractInternshala,
  ambitionbox: extractAmbitionBox,
  linkedin: extractLinkedIn,
  naukri: extractNaukri,
  indeed: extractIndeed,
  foundit: extractFoundit,
  glassdoor: extractGlassdoor,

  // Company career platforms
  greenhouse: extractCompanyCareer,
  lever: extractCompanyCareer,
};

/**
 * Returns the correct extraction function
 * for the detected job platform.
 *
 * @param {string} platform
 * @returns {Function}
 */
export function getExtractor(platform = "generic") {
  const normalizedPlatform = String(platform)
    .trim()
    .toLowerCase();

  const extractor =
    extractors[normalizedPlatform] || extractGeneric;

  console.log(
    `🔍 Platform: ${normalizedPlatform} → Extractor: ${extractor.name}`
  );

  return extractor;
}