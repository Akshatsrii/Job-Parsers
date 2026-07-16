import { fetchHtml } from "./services/parser/fetcher.js";
import { extractInternshala } from "./services/parser/extractors/internshala.js";
import fs from "fs";

async function main() {
  const html = await fetchHtml("https://internshala.com/internship/detail/human-resources-hr-work-from-home-job-internship-at-sanyukt-organisation1718873760");
  if (html) {
    fs.writeFileSync("internshala_detail.html", html);
    const data = extractInternshala(html, "https://internshala.com/internship/detail/human-resources-hr-work-from-home-job-internship-at-sanyukt-organisation1718873760");
    console.log(data);
  } else {
    console.log("Failed to fetch HTML");
  }
  process.exit(0);
}
main();
