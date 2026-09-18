const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const Resume = require("../models/Resume");

const searchJobs = require("../services/jobService");

const {
  getJobRecommendations,
} = require("../services/jobRecommendationService");

// ========================================
// Validation Helpers
// ========================================

function isValidString(value, maxLength = 100) {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.length <= maxLength
  );
}

function isOptionalString(value, maxLength = 100) {
  return (
    value === undefined ||
    value === null ||
    value === "" ||
    (
      typeof value === "string" &&
      value.length <= maxLength
    )
  );
}

function isValidPositiveInteger(value) {
  const number = Number(value);

  return (
    Number.isInteger(number) &&
    number > 0
  );
}

function isValidJobCount(value) {
  const allowedJobCounts = [5, 10, 15, 20];

  return allowedJobCounts.includes(
    Number(value)
  );
}


// ========================================
// GET /api/jobs/search
// ========================================

router.get(
  "/search",
  protect,

  async (req, res) => {
    try {

      const {
        query,
        location,
        country = "in",
        page = 1,
      } = req.query;


      // ========================================
      // Validate query
      // ========================================

      if (!isValidString(query, 100)) {
        return res.status(400).json({
          message:
            "Job search query is required and must be 100 characters or less.",
        });
      }


      // ========================================
      // Validate location
      // ========================================

      if (
        !isOptionalString(location, 100)
      ) {
        return res.status(400).json({
          message:
            "Location must be 100 characters or less.",
        });
      }


      // ========================================
      // Validate country
      // ========================================

      if (
        typeof country !== "string" ||
        !/^[a-zA-Z]{2}$/.test(country)
      ) {
        return res.status(400).json({
          message:
            "Country must be a valid 2-letter country code.",
        });
      }


      // ========================================
      // Validate page
      // ========================================

      if (
        !isValidPositiveInteger(page)
      ) {
        return res.status(400).json({
          message:
            "Page must be a positive integer.",
        });
      }


      // ========================================
      // Search jobs
      // ========================================

      const jobs = await searchJobs({
        country:
          country.toLowerCase(),

        page:
          Number(page),

        query:
          query.trim(),

        location:
          location?.trim() || "",
      });


      return res.status(200).json({
        message:
          "Jobs retrieved successfully.",

        jobs,
      });

    } catch (error) {

      console.error(
        "Job Search Error:",
        error.message
      );

      return res.status(500).json({
        message:
          "Failed to retrieve jobs.",
      });
    }
  }
);


// ========================================
// POST /api/jobs/recommendations
// ========================================

router.post(
  "/recommendations",
  protect,

  async (req, res) => {
    try {

      const {
        type = "Any",
        experience = "Fresher",
        location = "",
        workMode = "Any",
        jobCount = 5,
      } = req.body;


      // ========================================
      // Validate request body
      // ========================================

      if (
        typeof req.body !== "object" ||
        req.body === null ||
        Array.isArray(req.body)
      ) {
        return res.status(400).json({
          message:
            "Invalid request body.",
        });
      }


      // ========================================
      // Validate type
      // ========================================

      if (
        typeof type !== "string" ||
        type.length > 50
      ) {
        return res.status(400).json({
          message:
            "Invalid job type.",
        });
      }


      // ========================================
      // Validate experience
      // ========================================

      if (
        typeof experience !== "string" ||
        experience.length > 50
      ) {
        return res.status(400).json({
          message:
            "Invalid experience value.",
        });
      }


      // ========================================
      // Validate location
      // ========================================

      if (
        !isOptionalString(
          location,
          100
        )
      ) {
        return res.status(400).json({
          message:
            "Location must be 100 characters or less.",
        });
      }


      // ========================================
      // Validate work mode
      // ========================================

      if (
        typeof workMode !== "string" ||
        workMode.length > 50
      ) {
        return res.status(400).json({
          message:
            "Invalid work mode.",
        });
      }


      // ========================================
      // Validate job count
      // ========================================

      if (
        !isValidJobCount(jobCount)
      ) {
        return res.status(400).json({
          message:
            "Job count must be 5, 10, 15, or 20.",
        });
      }


      // ========================================
      // Get latest resume
      // ========================================

      const resume =
        await Resume.findOne({
          userId:
            req.user.userId,
        }).sort({
          createdAt: -1,
        });


      // ========================================
      // Resume not found
      // ========================================

      if (!resume) {
        return res.status(404).json({
          message:
            "No resume found. Please upload a resume first.",
        });
      }


      // ========================================
      // Resume analysis check
      // ========================================

      if (!resume.analysis) {
        return res.status(400).json({
          message:
            "Resume analysis is not available. Please analyze your resume first.",
        });
      }


      // ========================================
      // Generate recommendations
      // ========================================

      const recommendations =
        await getJobRecommendations({

          resumeText:
            resume.extractedText,

          analysis:
            resume.analysis,

          filters: {

            type:
              type.trim(),

            experience:
              experience.trim(),

            location:
              location.trim(),

            workMode:
              workMode.trim(),

            jobCount:
              Number(jobCount),
          },
        });


      // ========================================
      // Success
      // ========================================

      return res.status(200).json({

        message:
          "Job recommendations retrieved successfully.",

        recommendations,
      });

    } catch (error) {

      console.error(
        "Job Recommendation Error:",
        error.message
      );

      return res.status(500).json({
        message:
          "Failed to generate job recommendations.",
      });
    }
  }
);


module.exports = router;