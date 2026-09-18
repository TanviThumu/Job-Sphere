require("dotenv").config();

const mongoose = require("mongoose");
const Resume = require("./models/Resume");
const { analyzeResume } = require("./services/resumeAnalyzer");

async function testResumeAnalysis() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected.");

    const resume = await Resume.findOne().sort({
      createdAt: -1,
    });

    if (!resume) {
      throw new Error("No resume found in MongoDB.");
    }

    console.log(`Analyzing: ${resume.fileName}`);
    console.log(
      `Resume characters: ${resume.extractedText.length}`
    );

    const analysis = await analyzeResume(
      resume.extractedText
    );

    // Save the new Gemini analysis
    resume.analysis = analysis;

    await resume.save();

    console.log("\nAnalysis saved to MongoDB successfully.");

    console.log("\n==============================");
    console.log("GEMINI RESUME ANALYSIS");
    console.log("==============================\n");

    console.log(JSON.stringify(analysis, null, 2));

    console.log("\n==============================");
    console.log("Analysis completed successfully.");
    console.log("==============================");

  } catch (error) {
    console.error("\nResume Analysis Error:");
    console.error(error.message);

  } finally {
    await mongoose.disconnect();
  }
}

testResumeAnalysis();