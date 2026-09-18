const axios = require("axios");


// =========================================================
// PYTHON ML SERVICE
// =========================================================

const ML_SERVICE_URL =
  "http://127.0.0.1:8000";


// =========================================================
// ANALYZE JOB
// =========================================================

async function analyzeJob(job) {

  try {

    const response =
      await axios.post(

        `${ML_SERVICE_URL}/analyze-job`,

        {

          title:
            job.title || "",

          description:
            job.description || "",

        },

        {

          timeout: 10000,

        }

      );


    return response.data;


  } catch (error) {

    console.error(

      "ML Job Analysis Error:",

      error.response?.data ||
      error.message

    );


    return {

      opportunityType:
        "Unknown",

      minimumExperience:
        null,

      workMode:
        "Unknown",

    };

  }

}


// =========================================================
// BASIC SEMANTIC MATCH
// =========================================================

async function calculateJobMatch(
  resumeText,
  jobText
) {

  try {

    const response =
      await axios.post(

        `${ML_SERVICE_URL}/match`,

        {

          resumeText:
            resumeText || "",

          jobText:
            jobText || "",

        },

        {

          timeout: 30000,

        }

      );


    return (
      response.data.matchPercentage ||
      0
    );


  } catch (error) {

    console.error(

      "ML Matching Error:",

      error.response?.data ||
      error.message

    );


    return 0;

  }

}


// =========================================================
// SMART JOB RANKING
// =========================================================

async function rankJob(
  resumeText,
  job,
  targetRoles
) {

  try {

    const response =
      await axios.post(

        `${ML_SERVICE_URL}/rank-job`,

        {

          resumeText:
            resumeText || "",

          jobTitle:
            job.title || "",

          jobDescription:
            job.description || "",

          targetRoles:
            targetRoles || [],

        },

        {

          timeout: 30000,

        }

      );


    return response.data;


  } catch (error) {

    console.error(

      "ML Job Ranking Error:",

      error.response?.data ||
      error.message

    );


    return {

      semanticSimilarity:
        0,

      roleRelevance:
        0,

      finalScore:
        0,

      matchPercentage:
        0,

    };

  }

}


// =========================================================
// EXPORT
// =========================================================

module.exports = {

  analyzeJob,

  calculateJobMatch,

  rankJob,

};