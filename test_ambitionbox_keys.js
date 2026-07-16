import { load } from "cheerio";
import { fetchHtml } from "./server/services/parser/fetcher.js";

async function main() {
  const html = await fetchHtml("https://www.ambitionbox.com/jobs/reliance-retail-jobs");
  const $ = load(html);
  const nextData = $("#__NEXT_DATA__").html();
  const parsed = JSON.parse(nextData);
  const jobsList = parsed?.props?.pageProps?.jobsList;
  if (jobsList && jobsList.length > 0) {
    console.log("Keys in first job:", Object.keys(jobsList[0]));
    console.log("Job:", jobsList[0]);
  }
  process.exit(0);
}
main();
