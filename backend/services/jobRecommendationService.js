const axios = require("axios");

const getTrustedJobs = require("./trustedJobSourceService");
const searchJobs = require("./jobService");

const { rankJob } = require("./mlService");


// =========================================================
// PYTHON ML SERVICE
// =========================================================

async function analyzeJobWithPython(job) {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/analyze-job",
      {
        title: job.title || "",
        description: job.description || "",
      },
      {
        timeout: 10000,
      }
    );

    return response.data;

  } catch (error) {
    console.error(
      "Python Job Analysis Error:",
      error.response?.data || error.message
    );

    return {
      opportunityType: "Unknown",
      minimumExperience: null,
      workMode: "Unknown",
    };
  }
}


// =========================================================
// CLEAN JOB DESCRIPTION
// =========================================================

function cleanJobDescription(text) {
  if (!text) {
    return "";
  }

  let cleaned = String(text);

  // Decode common HTML entities
  const htmlEntities = {
    "&nbsp;": " ",
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&#x27;": "'",
  };

  for (const [entity, character] of Object.entries(htmlEntities)) {
    cleaned = cleaned.split(entity).join(character);
  }

  // Remove script/style blocks
  cleaned = cleaned.replace(
    /<(script|style)[^>]*>[\s\S]*?<\/\1>/gi,
    " "
  );

  // Convert HTML separators into spaces
  cleaned = cleaned.replace(
    /<\/(p|div|section|article|li|h1|h2|h3|h4|h5|h6|br)>/gi,
    " "
  );

  // Remove remaining HTML tags
  cleaned = cleaned.replace(/<[^>]*>/g, " ");

  // Decode numeric HTML entities
  cleaned = cleaned.replace(
    /&#(\d+);/g,
    (_, code) => {
      try {
        return String.fromCharCode(Number(code));
      } catch {
        return " ";
      }
    }
  );

  // Decode hexadecimal HTML entities
  cleaned = cleaned.replace(
    /&#x([0-9a-f]+);/gi,
    (_, code) => {
      try {
        return String.fromCharCode(parseInt(code, 16));
      } catch {
        return " ";
      }
    }
  );

  // Remove excessive whitespace
  cleaned = cleaned
    .replace(/\s+/g, " ")
    .trim();

  return cleaned;
}


// =========================================================
// OPPORTUNITY TYPE FILTER
// =========================================================

function matchesOpportunityType(job, selectedType) {
  if (
    !selectedType ||
    selectedType === "Any" ||
    selectedType === "All"
  ) {
    return true;
  }

  const jobType = String(
    job.opportunityType || ""
  )
    .toLowerCase()
    .trim();

  const selected = String(selectedType)
    .toLowerCase()
    .trim();

  if (selected === "internship") {
    return jobType === "internship";
  }

  if (selected === "full-time") {
    return jobType === "full-time";
  }

  if (selected === "part-time") {
    return jobType === "part-time";
  }

  return true;
}


// =========================================================
// EXPERIENCE FILTER
// =========================================================

function matchesExperience(job, selectedExperience) {
  if (
    !selectedExperience ||
    selectedExperience === "Any" ||
    selectedExperience === "All"
  ) {
    return true;
  }

  const requiredYears = job.minimumExperience;

  // -------------------------------------------------------
  // FRESHER
  // -------------------------------------------------------

  if (selectedExperience === "Fresher") {
    /*
     * Fresher:
     * - No explicit experience requirement
     * - 0 years
     *
     * If the job explicitly requires more than
     * 0 years, reject it.
     */

    if (
      requiredYears !== null &&
      requiredYears > 0
    ) {
      return false;
    }

    return true;
  }


  // -------------------------------------------------------
  // 0-1 YEARS
  // -------------------------------------------------------

  if (
    selectedExperience === "0-1 years" ||
    selectedExperience === "0–1 years"
  ) {
    if (
      requiredYears !== null &&
      requiredYears > 1
    ) {
      return false;
    }

    return true;
  }


  // -------------------------------------------------------
  // 1-3 YEARS
  // -------------------------------------------------------

  if (
    selectedExperience === "1-3 years" ||
    selectedExperience === "1–3 years"
  ) {
    if (
      requiredYears !== null &&
      requiredYears > 3
    ) {
      return false;
    }

    return true;
  }


  // -------------------------------------------------------
  // 3-5 YEARS
  // -------------------------------------------------------

  if (
    selectedExperience === "3-5 years" ||
    selectedExperience === "3–5 years"
  ) {
    if (
      requiredYears !== null &&
      requiredYears > 5
    ) {
      return false;
    }

    return true;
  }


  // -------------------------------------------------------
  // 5+ YEARS
  // -------------------------------------------------------

  if (selectedExperience === "5+ years") {
    if (
      requiredYears !== null &&
      requiredYears < 5
    ) {
      return false;
    }

    return true;
  }

  return true;
}


// =========================================================
// WORK MODE FILTER
// =========================================================

function matchesWorkMode(job, selectedWorkMode) {
  if (
    !selectedWorkMode ||
    selectedWorkMode === "Any" ||
    selectedWorkMode === "All"
  ) {
    return true;
  }

  return job.workMode === selectedWorkMode;
}


// =========================================================
// LOCATION FILTER
// =========================================================

function matchesLocation(job, selectedLocation) {
  // Empty location means ALL locations
  if (
    !selectedLocation ||
    selectedLocation === "Any" ||
    selectedLocation === "All"
  ) {
    return true;
  }

  const jobLocation = String(
    job.location || ""
  )
    .toLowerCase()
    .trim();

  const location = String(
    selectedLocation
  )
    .toLowerCase()
    .trim();


  // Location aliases
  const locationAliases = {
    bengaluru: [
      "bengaluru",
      "bangalore",
    ],

    bangalore: [
      "bengaluru",
      "bangalore",
    ],

    hyderabad: [
      "hyderabad",
    ],

    mumbai: [
      "mumbai",
      "bombay",
    ],

    kolkata: [
      "kolkata",
      "calcutta",
    ],

    chennai: [
      "chennai",
      "madras",
    ],

    delhi: [
      "delhi",
      "new delhi",
    ],

    gurugram: [
      "gurugram",
      "gurgaon",
    ],

    pune: [
      "pune",
    ],

    noida: [
      "noida",
    ],

    ahmedabad: [
      "ahmedabad",
    ],
  };

  const aliases =
    locationAliases[location] || [location];

  return aliases.some((alias) =>
    jobLocation.includes(alias)
  );
}


// =========================================================
// OPPORTUNITY TYPE NORMALIZATION
// =========================================================

function normalizeOpportunityType(value) {
  if (!value) {
    return "Unknown";
  }

  const text = String(value)
    .toLowerCase()
    .trim();

  if (text.includes("intern")) {
    return "Internship";
  }

  if (text.includes("part")) {
    return "Part-time";
  }

  if (text.includes("full")) {
    return "Full-time";
  }

  return "Unknown";
}


// =========================================================
// EXPERIENCE NORMALIZATION
// =========================================================

function normalizeExperience(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return null;
  }

  return number;
}


// =========================================================
// NORMALIZE JOB
// =========================================================

function normalizeJob(job) {
  return {
    id:
      job.id ||
      job.jobId ||
      `${job.company}-${job.title}-${job.location}`,

    title: job.title || "",

    company: job.company || "",

    location: job.location || "",

    // Clean HTML before ML matching
    description: cleanJobDescription(
      job.description
    ),

    contractTime:
      job.contractTime || "",

    contractType:
      job.contractType || "",

    workMode:
      job.workMode || "Unknown",

    postedDate:
      job.postedDate || "",

    url:
      job.url || "",

    source:
      job.source || "",

    salary:
      job.salary || "",

    opportunityType:
      job.opportunityType || "Unknown",

    minimumExperience:
      normalizeExperience(
        job.minimumExperience
      ),

    matchPercentage:
      Number(job.matchPercentage || 0),

    semanticSimilarity:
      Number(
        job.semanticSimilarity || 0
      ),

    roleRelevance:
      Number(
        job.roleRelevance || 0
      ),
  };
}


// =========================================================
// REMOVE DUPLICATES
// =========================================================

function removeDuplicates(jobs) {
  const seen = new Set();

  return jobs.filter((job) => {
    const key = (
      job.url ||
      `${job.company}-${job.title}-${job.location}`
    )
      .toLowerCase()
      .trim();

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);

    return true;
  });
}


// =========================================================
// SORT JOBS WITHIN A SOURCE GROUP
// =========================================================

function sortByRelevance(a, b) {
  // Highest ML match first
  if (
    a.matchPercentage !==
    b.matchPercentage
  ) {
    return (
      b.matchPercentage -
      a.matchPercentage
    );
  }

  // Highest role relevance next
  if (
    (a.roleRelevance || 0) !==
    (b.roleRelevance || 0)
  ) {
    return (
      (b.roleRelevance || 0) -
      (a.roleRelevance || 0)
    );
  }

  // Highest semantic similarity last
  return (
    (b.semanticSimilarity || 0) -
    (a.semanticSimilarity || 0)
  );
}


// =========================================================
// MAIN RECOMMENDATION FUNCTION
// =========================================================

async function getJobRecommendations({
  resumeText,
  analysis,
  filters = {},
}) {
  console.log(
    "\n================================"
  );

  console.log(
    "JOB RECOMMENDATION PIPELINE"
  );

  console.log(
    "================================"
  );


  // =======================================================
  // USER FILTERS
  // =======================================================

  const {
    type = "Any",
    experience = "Fresher",
    location = "",
    workMode = "Any",
    jobCount = 5,
  } = filters;


  // =======================================================
  // CHECK RESUME
  // =======================================================

  if (!resumeText) {
    throw new Error(
      "Resume text is not available."
    );
  }


  // =======================================================
  // TARGET ROLES FROM GEMINI
  // =======================================================

  const targetRoles =
    Array.isArray(
      analysis?.targetRoles
    )
      ? analysis.targetRoles
      : [];

  console.log(
    "\nTarget Roles:"
  );

  console.log(targetRoles);


  // =======================================================
  // FETCH TRUSTED JOBS
  // =======================================================

  console.log(
    "\nFetching trusted jobs..."
  );

  let trustedJobs = [];

  try {
    trustedJobs =
      await getTrustedJobs({
        location,
        targetRoles,
      });
  } catch (error) {
    console.error(
      "Trusted Jobs Error:",
      error.message
    );

    trustedJobs = [];
  }

  console.log(
    `Trusted jobs fetched: ${trustedJobs.length}`
  );


  // =======================================================
  // FETCH ADZUNA JOBS
  // =======================================================

  let adzunaJobs = [];

  try {
    const rolesToSearch =
      targetRoles.slice(0, 6);

    const adzunaResults =
      await Promise.all(
        rolesToSearch.map(
          async (role) => {
            try {
              let query = "";

              if (
                typeof role === "string"
              ) {
                query = role;
              } else {
                query =
                  role.role ||
                  role.title ||
                  "";
              }

              if (!query) {
                return [];
              }

              const result =
                await searchJobs({
                  country: "in",
                  page: 1,
                  query,
                  location,
                });

              return (
                result?.results || []
              );

            } catch (error) {
              console.error(
                "Adzuna role search failed:",
                error.message
              );

              return [];
            }
          }
        )
      );

    adzunaJobs =
      adzunaResults.flat();

  } catch (error) {
    console.error(
      "Adzuna search failed:",
      error.message
    );

    adzunaJobs = [];
  }

  console.log(
    `Adzuna jobs fetched: ${adzunaJobs.length}`
  );


  // =======================================================
  // NORMALIZE TRUSTED JOBS
  // =======================================================

  const normalizedTrustedJobs =
    trustedJobs.map(
      normalizeJob
    );


  // =======================================================
  // NORMALIZE ADZUNA JOBS
  // =======================================================

  const normalizedAdzunaJobs =
    adzunaJobs.map((job) => {
      return normalizeJob({
        id: job.id,

        title: job.title,

        company:
          job.company?.display_name ||
          "",

        location:
          job.location?.display_name ||
          "",

        description:
          job.description ||
          "",

        contractTime:
          job.contract_time ||
          "",

        contractType:
          job.contract_type ||
          "",

        workMode:
          "Unknown",

        postedDate:
          job.created ||
          "",

        url:
          job.redirect_url ||
          "",

        source:
          "Adzuna",

        salary:
          job.salary_min &&
          job.salary_max
            ? `${job.salary_min} - ${job.salary_max}`
            : "",
      });
    });


  // =======================================================
  // COMBINE ALL JOBS
  // =======================================================

  const allJobs =
    removeDuplicates([
      ...normalizedTrustedJobs,
      ...normalizedAdzunaJobs,
    ]);

  console.log(
    `Combined unique jobs: ${allJobs.length}`
  );


  // =======================================================
  // PYTHON JOB ANALYSIS
  // =======================================================

  console.log(
    "\nAnalyzing jobs with Python..."
  );

  const BATCH_SIZE = 10;

  for (
    let i = 0;
    i < allJobs.length;
    i += BATCH_SIZE
  ) {
    const batch =
      allJobs.slice(
        i,
        i + BATCH_SIZE
      );

    await Promise.all(
      batch.map(async (job) => {
        const result =
          await analyzeJobWithPython(
            job
          );


        // Opportunity type
        job.opportunityType =
          normalizeOpportunityType(
            result.opportunityType
          );


        // Experience
        job.minimumExperience =
          normalizeExperience(
            result.minimumExperience
          );


        // Work mode
        job.workMode =
          result.workMode ||
          "Unknown";
      })
    );

    console.log(
      `Python analyzed ${Math.min(
        i + BATCH_SIZE,
        allJobs.length
      )}/${allJobs.length} jobs`
    );
  }


  // =======================================================
  // APPLY USER FILTERS
  // =======================================================

  console.log(
    "\nApplying filters..."
  );

  console.log(
    "Opportunity Type:",
    type
  );

  console.log(
    "Experience:",
    experience
  );

  console.log(
    "Work Mode:",
    workMode
  );

  console.log(
    "Location:",
    location || "ANY LOCATION"
  );


  const filteredJobs =
    allJobs.filter((job) => {
      return (
        matchesOpportunityType(
          job,
          type
        ) &&

        matchesExperience(
          job,
          experience
        ) &&

        matchesWorkMode(
          job,
          workMode
        ) &&

        matchesLocation(
          job,
          location
        )
      );
    });


  console.log(
    `Jobs after filters: ${filteredJobs.length}`
  );


  // =======================================================
  // ML RANKING
  // =======================================================

  console.log(
    "\nCalculating intelligent job relevance..."
  );

  const MATCH_BATCH_SIZE = 5;

  for (
    let i = 0;
    i < filteredJobs.length;
    i += MATCH_BATCH_SIZE
  ) {
    const batch =
      filteredJobs.slice(
        i,
        i + MATCH_BATCH_SIZE
      );

    await Promise.all(
      batch.map(async (job) => {
        const ranking =
          await rankJob(
            resumeText,
            job,
            targetRoles
          );

        job.semanticSimilarity =
          ranking.semanticSimilarity || 0;

        job.roleRelevance =
          ranking.roleRelevance || 0;

        job.matchPercentage =
          ranking.matchPercentage || 0;
      })
    );

    console.log(
      `Ranked ${Math.min(
        i + MATCH_BATCH_SIZE,
        filteredJobs.length
      )}/${filteredJobs.length} jobs`
    );
  }


  // =======================================================
  // SOURCE PRIORITY
  // =======================================================
  //
  // PRIMARY SOURCES:
  //   1. Greenhouse
  //   2. Lever
  //
  // FALLBACK SOURCE:
  //   3. Adzuna
  //
  // Greenhouse + Lever are treated as trusted sources.
  // Adzuna is only used to fill remaining slots.
  //
  // IMPORTANT:
  // ML ranking still decides the order INSIDE each
  // source group.
  //
  // Example:
  //
  // Greenhouse 88%
  // Lever      84%
  // Greenhouse 81%
  // Adzuna     90%
  //
  // Final:
  //
  // Greenhouse 88%
  // Lever      84%
  // Greenhouse 81%
  // Adzuna     90%
  //
  // This ensures trusted sources are preferred.
  //


  // =======================================================
  // TRUSTED JOBS
  // =======================================================

  const trustedJobsRanked =
    filteredJobs
      .filter((job) => {
        return (
          job.source === "Greenhouse" ||
          job.source === "Lever"
        );
      })
      .sort(sortByRelevance);


  // =======================================================
  // ADZUNA FALLBACK JOBS
  // =======================================================

  const adzunaJobsRanked =
    filteredJobs
      .filter((job) => {
        return job.source === "Adzuna";
      })
      .sort(sortByRelevance);


  // =======================================================
  // FINAL JOB SELECTION
  // =======================================================

  const requestedJobCount =
    Number(jobCount) || 5;


  /*
   * IMPORTANT:
   *
   * Greenhouse + Lever come FIRST.
   *
   * Adzuna comes AFTER them and fills any
   * remaining positions.
   */

  const finalJobs = [
    ...trustedJobsRanked,
    ...adzunaJobsRanked,
  ].slice(
    0,
    requestedJobCount
  );


  // =======================================================
  // SOURCE DISTRIBUTION LOG
  // =======================================================

  const greenhouseCount =
    finalJobs.filter(
      (job) =>
        job.source === "Greenhouse"
    ).length;

  const leverCount =
    finalJobs.filter(
      (job) =>
        job.source === "Lever"
    ).length;

  const adzunaCount =
    finalJobs.filter(
      (job) =>
        job.source === "Adzuna"
    ).length;


  console.log(
    "\n================================"
  );

  console.log(
    "SOURCE DISTRIBUTION"
  );

  console.log(
    "================================"
  );

  console.log(
    `Greenhouse: ${greenhouseCount}`
  );

  console.log(
    `Lever: ${leverCount}`
  );

  console.log(
    `Adzuna: ${adzunaCount}`
  );


  // =======================================================
  // FINAL RESULTS
  // =======================================================

  console.log(
    "\n================================"
  );

  console.log(
    `Returning ${finalJobs.length} jobs`
  );

  console.log(
    "================================"
  );


  finalJobs.forEach(
    (job, index) => {
      console.log(
        `${index + 1}. ` +
        `${job.title} | ` +
        `${job.company} | ` +
        `${job.location} | ` +
        `${job.matchPercentage}% | ` +
        `${job.source}`
      );
    }
  );


  // =======================================================
  // RETURN
  // =======================================================

  return {
    targetRoles,

    jobs: finalJobs,

    total: finalJobs.length,
  };
}


// =========================================================
// EXPORT
// =========================================================

module.exports = {
  getJobRecommendations,
};  