const { getTrustedJobs } = require("./services/trustedJobSourceService");

async function test() {
  console.log("\n==============================");
  console.log("Testing Trusted Job Sources");
  console.log("==============================");

  const jobs = await getTrustedJobs({
    location: "",
  });

  console.log(`\nTrusted jobs found: ${jobs.length}`);

  /*
   * -------------------------------------------------------
   * COUNT JOBS BY COMPANY
   * -------------------------------------------------------
   */

  const companyCounts = {};

  jobs.forEach((job) => {
    const company = job.company || "Unknown";

    companyCounts[company] =
      (companyCounts[company] || 0) + 1;
  });

  console.log("\n==============================");
  console.log("Jobs By Company");
  console.log("==============================");

  Object.entries(companyCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([company, count]) => {
      console.log(`${company}: ${count}`);
    });

  /*
   * -------------------------------------------------------
   * COUNT JOBS BY SOURCE
   * -------------------------------------------------------
   */

  const sourceCounts = {};

  jobs.forEach((job) => {
    const source = job.source || "Unknown";

    sourceCounts[source] =
      (sourceCounts[source] || 0) + 1;
  });

  console.log("\n==============================");
  console.log("Jobs By Source");
  console.log("==============================");

  Object.entries(sourceCounts).forEach(
    ([source, count]) => {
      console.log(`${source}: ${count}`);
    }
  );

  /*
   * -------------------------------------------------------
   * SHOW SAMPLE JOBS
   * -------------------------------------------------------
   */

  console.log("\n==============================");
  console.log("Sample Jobs");
  console.log("==============================");

  jobs.slice(0, 10).forEach((job, index) => {
    console.log(`\n${index + 1}. ${job.title}`);
    console.log(`Company: ${job.company}`);
    console.log(`Location: ${job.location}`);
    console.log(`Source: ${job.source}`);
    console.log(`Apply: ${job.url}`);
  });
}

test().catch((error) => {
  console.error("Test failed:", error);
});