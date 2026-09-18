const {
  analyzeJob,
  calculateJobMatch,
} = require("./services/mlService");


async function test() {

  console.log("\n==============================");
  console.log("Testing Node → Python");
  console.log("==============================");


  // Test job analysis
  const jobAnalysis = await analyzeJob({
    title: "Data Science Intern",
    description: `
      Join our data science team as an intern.
      No prior professional experience required.
      Work with Python, SQL and machine learning.
      Hybrid position.
    `,
  });


  console.log("\nJob Analysis:");
  console.log(jobAnalysis);


  // Test semantic matching
  const matchScore = await calculateJobMatch(
    `
    BTech Data Science student with experience
    in Python, SQL, machine learning, data analysis,
    pandas and scikit-learn.
    `,

    `
    Data Science Intern.
    Work with Python and SQL to analyze datasets
    and build machine learning models.
    `
  );


  console.log("\nMatch Score:");
  console.log(`${matchScore}%`);


  console.log("\n==============================");
  console.log("Test Complete");
  console.log("==============================");
}


test();