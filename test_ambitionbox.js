import { parseJob } from "./server/services/parser/index.js";

async function main() {
  console.log("Starting parse for ambitionbox job list...");
  try {
    const data = await parseJob("https://www.ambitionbox.com/jobs/reliance-retail-jobs");
    if (data.isJobList) {
      console.log(`Found ${data.jobs.length} jobs.`);
      if (data.jobs.length > 0) {
        console.log("First job applyUrl:", data.jobs[0].applyUrl);
      }
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
  process.exit(0);
}

main();
