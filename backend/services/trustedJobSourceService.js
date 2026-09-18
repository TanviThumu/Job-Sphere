const {
  getGreenhouseJobs,
} = require("./jobSources/greenhouseSource");

const {
  getLeverJobs,
} = require("./jobSources/leverSource");


// =========================================================
// TRUSTED COMPANY REGISTRY
// =========================================================

// Greenhouse
const greenhouseCompanies = [

  // Existing
  {
    boardToken: "airbnb",
    companyName: "Airbnb",
  },

  {
    boardToken: "coinbase",
    companyName: "Coinbase",
  },

  {
    boardToken: "affirm",
    companyName: "Affirm",
  },

  {
    boardToken: "chime",
    companyName: "Chime",
  },


  // New
  {
    boardToken: "cloudsek",
    companyName: "CloudSEK",
  },

  {
    boardToken: "instawork",
    companyName: "Instawork",
  },

  {
    boardToken: "fourkites",
    companyName: "FourKites",
  },

  {
    boardToken: "devrev",
    companyName: "DevRev",
  },

  {
    boardToken: "enterpret",
    companyName: "Enterpret",
  },

  {
    boardToken: "project44",
    companyName: "project44",
  },

  {
    boardToken: "formaaiinc3",
    companyName: "Forma.ai",
  },

  {
    boardToken: "sigmoid",
    companyName: "Sigmoid",
  },

  {
    boardToken: "greenlandinvestmentmanagement",
    companyName: "Greenland Investment Management",
  },

];


// =========================================================
// LEVER
// =========================================================

const leverCompanies = [

  // Existing
  {
    site: "dnb",
    companyName: "Dun & Bradstreet",
  },

  {
    site: "binance",
    companyName: "Binance",
  },

  {
    site: "zoox",
    companyName: "Zoox",
  },


  // New
  {
    site: "drivetrain",
    companyName: "Drivetrain",
  },

  {
    site: "100ms",
    companyName: "100ms",
  },

  {
    site: "hevodata",
    companyName: "Hevo Data",
  },

  {
    site: "paytm",
    companyName: "Paytm",
  },

  {
    site: "sitetracker",
    companyName: "Sitetracker",
  },

  {
    site: "thinkahead",
    companyName: "AHEAD",
  },

];


// =========================================================
// CACHE
// =========================================================

const CACHE_TTL =
  10 * 60 * 1000;

const trustedJobCache =
  new Map();


// =========================================================
// NORMALIZE TEXT
// =========================================================

function normalizeText(text) {

  return String(
    text || ""
  )
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}


// =========================================================
// GET JOB TEXT
// =========================================================

function getJobText(job) {

  return [

    job.title,

    job.company,

    job.location,

    job.description,

  ]
    .filter(Boolean)
    .join(" ");
}


// =========================================================
// ROLE RELEVANCE
// =========================================================

function calculateRoleRelevance(
  job,
  targetRoles
) {

  if (
    !Array.isArray(targetRoles) ||
    targetRoles.length === 0
  ) {

    return 0;
  }


  const jobText =
    normalizeText(
      getJobText(job)
    );


  let bestScore = 0;


  for (
    const role of targetRoles
  ) {

    let roleText = "";


    if (
      typeof role === "string"
    ) {

      roleText = role;

    } else {

      roleText =
        role?.role ||
        role?.title ||
        "";
    }


    roleText =
      normalizeText(
        roleText
      );


    if (!roleText) {
      continue;
    }


    const roleWords =
      roleText
        .split(/\s+/)
        .filter(
          (word) =>
            word.length > 2
        );


    let score = 0;


    for (
      const word of roleWords
    ) {

      if (
        jobText.includes(word)
      ) {

        score++;
      }
    }


    if (
      roleWords.length > 0
    ) {

      const percentage =
        score /
        roleWords.length;


      bestScore =
        Math.max(
          bestScore,
          percentage
        );
    }
  }


  return bestScore;
}


// =========================================================
// FETCH GREENHOUSE
// =========================================================

async function fetchGreenhouseJobs() {

  const results =
    await Promise.all(

      greenhouseCompanies.map(
        async (company) => {

          /*
           * IMPORTANT:
           *
           * Do NOT filter by location here.
           *
           * We want the complete trusted pool first.
           * Python + JobSphere filters will decide
           * whether a job matches Bengaluru/Bangalore,
           * remote, etc.
           */

          return getGreenhouseJobs({

            boardToken:
              company.boardToken,

            companyName:
              company.companyName,

            location:
              "",

          });

        }
      )
    );


  return results.flat();
}


// =========================================================
// FETCH LEVER
// =========================================================

async function fetchLeverJobs() {

  const results =
    await Promise.all(

      leverCompanies.map(
        async (company) => {

          /*
           * Same principle as Greenhouse:
           * fetch the broad pool first.
           */

          return getLeverJobs({

            site:
              company.site,

            companyName:
              company.companyName,

            location:
              "",

          });

        }
      )
    );


  return results.flat();
}


// =========================================================
// REMOVE DUPLICATES
// =========================================================

function removeDuplicates(
  jobs
) {

  const seen =
    new Set();


  return jobs.filter(
    (job) => {

      const key = (

        job.url ||

        `${job.company}-${job.title}-${job.location}`

      )
        .toLowerCase()
        .trim();


      if (
        seen.has(key)
      ) {

        return false;
      }


      seen.add(key);

      return true;
    }
  );
}


// =========================================================
// BUILD BALANCED JOB POOL
// =========================================================

function buildCandidatePool(
  jobs,
  targetRoles
) {

  if (
    jobs.length <= 300
  ) {

    return jobs;
  }


  // -------------------------------------------------------
  // Calculate relevance
  // -------------------------------------------------------

  const scoredJobs =
    jobs.map(
      (job) => ({

        ...job,

        roleRelevance:
          calculateRoleRelevance(
            job,
            targetRoles
          ),

      })
    );


  // -------------------------------------------------------
  // Sort by role relevance
  // -------------------------------------------------------

  scoredJobs.sort(
    (a, b) => {

      return (
        b.roleRelevance -
        a.roleRelevance
      );

    }
  );


  // -------------------------------------------------------
  // Take top relevant jobs
  // -------------------------------------------------------

  const selected =
    scoredJobs.slice(
      0,
      300
    );


  // -------------------------------------------------------
  // Make sure internships don't get
  // completely buried by full-time jobs.
  // -------------------------------------------------------

  const internshipJobs =
    scoredJobs.filter(
      (job) => {

        const text =
          normalizeText(
            `${job.title} ${job.description}`
          );

        return (

          text.includes("intern") ||

          text.includes("internship") ||

          text.includes("trainee") ||

          text.includes("graduate program") ||

          text.includes("graduate programme")

        );
      }
    );


  // -------------------------------------------------------
  // Add some highly relevant internships
  // if they aren't already present.
  // -------------------------------------------------------

  const selectedUrls =
    new Set(
      selected.map(
        (job) => job.url
      )
    );


  const extraInternships =
    internshipJobs
      .filter(
        (job) =>
          !selectedUrls.has(
            job.url
          )
      )
      .slice(
        0,
        100
      );


  const combined =
    removeDuplicates([

      ...selected,

      ...extraInternships,

    ]);


  /*
   * Keep the Python workload reasonable.
   */

  return combined.slice(
    0,
    400
  );
}


// =========================================================
// GET TRUSTED JOBS
// =========================================================

async function getTrustedJobs({

  location = "",

  targetRoles = [],

} = {}) {


  /*
   * IMPORTANT:
   *
   * Location is intentionally NOT part of the
   * fetch operation.
   *
   * We fetch a broad trusted pool and let the
   * recommendation service filter location later.
   */

  const cacheKey =
    "all-trusted-jobs";


  // =======================================================
  // CACHE
  // =======================================================

  const cached =
    trustedJobCache.get(
      cacheKey
    );


  if (
    cached &&
    Date.now() -
      cached.timestamp <
      CACHE_TTL
  ) {

    console.log(
      "Using cached trusted jobs."
    );


    return buildCandidatePool(
      cached.jobs,
      targetRoles
    );
  }


  // =======================================================
  // FETCH ALL SOURCES
  // =======================================================

  console.log(
    "\nFetching Greenhouse companies..."
  );


  const [
    greenhouseJobs,
    leverJobs,
  ] = await Promise.all([

    fetchGreenhouseJobs(),

    fetchLeverJobs(),

  ]);


  console.log(
    `Greenhouse jobs: ${greenhouseJobs.length}`
  );


  console.log(
    `Lever jobs: ${leverJobs.length}`
  );


  // =======================================================
  // COMBINE
  // =======================================================

  const allJobs =
    removeDuplicates([

      ...greenhouseJobs,

      ...leverJobs,

    ]);


  console.log(
    `Total trusted jobs: ${allJobs.length}`
  );


  // =======================================================
  // CACHE
  // =======================================================

  trustedJobCache.set(
    cacheKey,
    {
      timestamp:
        Date.now(),

      jobs:
        allJobs,
    }
  );


  // =======================================================
  // BUILD CANDIDATE POOL
  // =======================================================

  const candidatePool =
    buildCandidatePool(
      allJobs,
      targetRoles
    );


  console.log(
    `Trusted candidate pool: ${candidatePool.length}`
  );


  return candidatePool;
}


// =========================================================
// EXPORT
// =========================================================

module.exports = getTrustedJobs;