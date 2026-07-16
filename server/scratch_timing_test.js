import axios from "axios";

async function testParseDirectly() {
  try {
    console.log("Testing /api/parser/parse directly on Render...");
    const start = Date.now();
    const response = await axios.post("https://job-parsers-2.onrender.com/api/parser/parse", {
      url: "https://www.ambitionbox.com/jobs?campaign=desktop_nav",
      pages: 1
    }, {
      headers: { "Content-Type": "application/json" },
      timeout: 40000
    });
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    console.log(`✅ Success in ${elapsed}s`);
    console.log("Keys:", Object.keys(response.data));
    console.log("Success:", response.data.success);
    if (response.data.data) {
      const d = response.data.data;
      console.log("isJobList:", d.isJobList);
      console.log("Jobs count:", d.jobs ? d.jobs.length : 'N/A');
    }
  } catch (error) {
    const elapsed = ((Date.now()) / 1000).toFixed(1);
    if (error.response) {
      console.error(`❌ API Error ${error.response.status}:`, JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(`❌ Error after ~${error.message}`, error.code);
    }
  }
}

testParseDirectly();
