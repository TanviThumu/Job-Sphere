const axios = require("axios");

const LEVER_BASE_URL = "https://api.lever.co/v0/postings";

async function getLeverJobs({
  site,
  companyName,
  location = "",
}) {
  try {
    if (!site) {
      throw new Error("Lever site name is required.");
    }

    const response = await axios.get(
      `${LEVER_BASE_URL}/${site}`,
      {
        params: {
          mode: "json",
        },
        timeout: 10000,
      }
    );

    const jobs = Array.isArray(response.data)
      ? response.data
      : [];

    return jobs
      .filter((job) => {
        if (!location) return true;

        const jobLocations = [
          job.categories?.location,
          ...(job.categories?.allLocations || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return jobLocations.includes(location.toLowerCase());
      })
      .map((job) => ({
        id: `lever-${job.id}`,
        title: job.text || "",
        company: companyName || "",
        location:
          job.categories?.location ||
          job.categories?.allLocations?.join(", ") ||
          "",
        description:
          job.descriptionBodyPlain ||
          job.descriptionPlain ||
          "",
        contractTime:
          job.categories?.commitment || "",
        contractType:
          job.categories?.team || "",
        workMode: job.workplaceType || "",
        postedDate: "",
        url: job.applyUrl || job.hostedUrl || "",
        source: "Lever",
      }))
      .filter((job) => job.url);
  } catch (error) {
    console.error(
      `Lever API Error (${companyName || site}):`,
      error.response?.data || error.message
    );

    return [];
  }
}

module.exports = {
  getLeverJobs,
};