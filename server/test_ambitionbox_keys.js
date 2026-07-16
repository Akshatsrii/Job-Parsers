import { fetchHtml } from "./services/parser/fetcher.js";
import fs from "fs";

async function main() {
  const html = await fetchHtml("https://www.ambitionbox.com/jobs/reliance-retail-jobs");
  fs.writeFileSync("ambitionbox_test.html", html);
  process.exit(0);
}
main();
