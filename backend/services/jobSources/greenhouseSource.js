const axios = require("axios");

const GREENHOUSE_BASE_URL =
  "https://boards-api.greenhouse.io/v1/boards";

async function getGreenhouseJobs({
  boardToken,
  companyName,
  location = "",
}) {
  try {
    if (!boardToken) {
      throw new Error("Greenhouse board token is required.");
    }

    const response = await axios.get(
      `${GREENHOUSE_BASE_URL}/${boardToken}/jobs`,
      {
        params: {
          content: true,
        },
        timeout: 10000,
      }
    );

    const jobs = response.data?.jobs || [];

    return jobs
      .filter((job) => {
        if (!location) return true;

        const jobLocation =
          job.location?.name?.toLowerCase() || "";

        return jobLocation.includes(location.toLowerCase());
      })
      .map((job) => ({
        id: `greenhouse-${job.id}`,
        title: job.title || "",
        company: companyName || "",
        location: job.location?.name || "",
        description: job.content || "",
        contractTime: "",
        contractType: "",
        workMode: "",
        postedDate: job.updated_at || "",
        url: job.absolute_url || "",
        source: "Greenhouse",
      }))
      .filter((job) => job.url);
  } catch (error) {
    console.error(
      `Greenhouse API Error (${companyName || boardToken}):`,
      error.response?.data || error.message
    );

    return [];
  }
}

module.exports = {
  getGreenhouseJobs,
};