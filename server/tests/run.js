import { runGenericTests } from "./generic.test.js";
import { runInternshalaTests } from "./internshala.test.js";

/**
 * Main entry point for running mock tests locally
 */
async function runAll() {
  console.log("==================================================");
  console.log("🛡️  Starting Job Parser Test Runner...");
  console.log("==================================================\n");

  try {
    runGenericTests();
    runInternshalaTests();
    
    console.log("==================================================");
    console.log("🎉 SUCCESS: All parser tests passed! 🏆");
    console.log("==================================================");
  } catch (error) {
    console.error("\n==================================================");
    console.error("🚨 FAILURE: Parser tests failed!");
    console.error("==================================================");
    console.error(error.stack || error);
    process.exit(1);
  }
}

runAll();
