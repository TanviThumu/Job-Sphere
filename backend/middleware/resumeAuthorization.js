const mongoose = require("mongoose");

const Resume = require("../models/Resume");

const authorizeResume = async (req, res, next) => {
  try {
    const resumeId = req.params.resumeId;

    // Check whether the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(400).json({
        message: "Invalid resume ID.",
      });
    }

    // Find resume belonging to the authenticated user
    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.user.userId,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found.",
      });
    }

    // Attach authorized resume to request
    req.resume = resume;

    next();

  } catch (error) {
    console.error(
      "Resume Authorization Error:",
      error.message
    );

    return res.status(500).json({
      message:
        "Failed to authorize resume access.",
    });
  }
};

module.exports = authorizeResume;