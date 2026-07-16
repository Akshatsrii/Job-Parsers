import { parseJob } from "./server/services/parser/index.js";

async function main() {
  console.log("Starting parse...");
  const start = Date.now();
  try {
    const data = await parseJob("https://www.ambitionbox.com/jobs/detail/store-manager-apparel-store");
    console.log("Success! Data:", data);
  } catch (err) {
    console.error("Error:", err.message);
  }
  console.log(`Took ${Date.now() - start}ms`);
  process.exit(0);
}

main();
