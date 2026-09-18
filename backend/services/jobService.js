const axios = require("axios");

async function searchJobs({
  country = "in",
  page = 1,
  query,
  location,
}) {
  try {
    if (!query) {
      throw new Error("Job search query is required.");
    }

    const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}`;

    const params = {
      app_id: process.env.ADZUNA_APP_ID,
      app_key: process.env.ADZUNA_APP_KEY,
      results_per_page: 20,
      what: query,
      "content-type": "application/json",
    };

    if (location) {
      params.where = location;
    }

    const response = await axios.get(url, {
      params,
    });

    return response.data;
  } catch (error) {
    console.error(
      "Adzuna API Error:",
      error.response?.data || error.message
    );

    throw new Error("Failed to fetch jobs from Adzuna.");
  }
}

module.exports = searchJobs;