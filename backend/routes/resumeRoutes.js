const express = require("express");
const multer = require("multer");
const { PDFParse } = require("pdf-parse");
const mammoth = require("mammoth");
const { createWorker } = require("tesseract.js");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const Resume = require("../models/Resume");
const { analyzeResume } = require("../services/resumeAnalyzer");

// ========================================
// Constants
// ========================================

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const MAX_RESUME_TEXT_LENGTH = 30000;

const DOCX_MIME_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  DOCX_MIME_TYPE,
];

// ========================================
// Filename validation
// ========================================

function isValidResumeFilename(filename) {
  if (!filename) {
    return false;
  }

  const extension = filename
    .toLowerCase()
    .split(".")
    .pop();

  return extension === "pdf" || extension === "docx";
}

// ========================================
// Multer configuration
// ========================================

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: MAX_FILE_SIZE,
  },

  fileFilter: (req, file, cb) => {
    // Check MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(
        new Error("Only PDF and DOCX files are allowed.")
      );
    }

    // Check file extension
    if (!isValidResumeFilename(file.originalname)) {
      return cb(
        new Error("Only PDF and DOCX files are allowed.")
      );
    }

    cb(null, true);
  },
});

// ========================================
// OCR PDF
// ========================================

async function extractTextWithOCR(parser) {
  console.log("Normal PDF text is too short.");
  console.log("Starting OCR...");

  const screenshot = await parser.getScreenshot({
    partial: [1],
    desiredWidth: 1800,
    imageBuffer: true,
  });

  if (
    !screenshot ||
    !screenshot.pages ||
    screenshot.pages.length === 0
  ) {
    throw new Error(
      "Could not render PDF page for OCR."
    );
  }

  const worker = await createWorker("eng");

  try {
    let ocrText = "";

    for (const page of screenshot.pages) {
      if (!page.data) {
        continue;
      }

      console.log("Running OCR on PDF page...");

      const result = await worker.recognize(
        page.data
      );

      ocrText += result.data.text + "\n";
    }

    return ocrText.trim();

  } finally {
    await worker.terminate();
  }
}

// ========================================
// POST /api/resume/upload
// ========================================

router.post(
  "/upload",
  protect,
  upload.single("resume"),

  async (req, res) => {
    let parser = null;

    try {
      // ========================================
      // Check file
      // ========================================

      if (!req.file) {
        return res.status(400).json({
          message: "Please upload a resume.",
        });
      }

      // ========================================
      // Filename validation
      // ========================================

      if (
        !isValidResumeFilename(
          req.file.originalname
        )
      ) {
        return res.status(400).json({
          message:
            "Only PDF and DOCX resumes are allowed.",
        });
      }

      // ========================================
      // MIME type validation
      // ========================================

      if (
        !ALLOWED_MIME_TYPES.includes(
          req.file.mimetype
        )
      ) {
        return res.status(400).json({
          message:
            "Only PDF and DOCX resumes are allowed.",
        });
      }

      // ========================================
      // File size validation
      // ========================================

      if (req.file.size > MAX_FILE_SIZE) {
        return res.status(400).json({
          message:
            "Resume file size must be 5 MB or less.",
        });
      }

      let extractedText = "";

      // ========================================
      // PDF
      // ========================================

      if (
        req.file.mimetype ===
        "application/pdf"
      ) {
        console.log(
          `Processing PDF: ${req.file.originalname}`
        );

        parser = new PDFParse({
          data: req.file.buffer,
        });

        // Normal text extraction
        const result = await parser.getText();

        extractedText = result.text || "";

        console.log(
          `Normal extracted characters: ${extractedText.length}`
        );

        // ========================================
        // OCR FALLBACK
        // ========================================

        if (
          extractedText.trim().length < 100
        ) {
          extractedText =
            await extractTextWithOCR(parser);

          console.log(
            `OCR extracted characters: ${extractedText.length}`
          );
        }
      }

      // ========================================
      // DOCX
      // ========================================

      else if (
        req.file.mimetype === DOCX_MIME_TYPE
      ) {
        console.log(
          `Processing DOCX: ${req.file.originalname}`
        );

        const result =
          await mammoth.extractRawText({
            buffer: req.file.buffer,
          });

        extractedText =
          result.value || "";

        console.log(
          `DOCX extracted characters: ${extractedText.length}`
        );
      }

      // ========================================
      // Validate extracted text
      // ========================================

      if (!extractedText.trim()) {
        return res.status(400).json({
          message:
            "Could not extract text from the resume.",
        });
      }

      // ========================================
      // Limit extracted text
      // ========================================

      if (
        extractedText.length >
        MAX_RESUME_TEXT_LENGTH
      ) {
        console.log(
          `Resume text exceeds ${MAX_RESUME_TEXT_LENGTH} characters. Truncating.`
        );

        extractedText =
          extractedText.substring(
            0,
            MAX_RESUME_TEXT_LENGTH
          );
      }

      // ========================================
      // Gemini Resume Analysis
      // ========================================

      console.log(
        "Starting Gemini resume analysis..."
      );

      const analysis =
        await analyzeResume(
          extractedText
        );

      console.log(
        "Gemini resume analysis completed successfully."
      );

      // ========================================
      // Save Resume to MongoDB
      // ========================================

      const resume =
        await Resume.create({
          userId: req.user.userId,
          fileName: req.file.originalname,
          fileSize: req.file.size,
          extractedText: extractedText,
          analysis: analysis,
        });

      console.log(
        "Resume saved to MongoDB successfully."
      );

      console.log(
        "Resume ID:",
        resume._id
      );

      console.log(
        "Resume User ID:",
        resume.userId
      );

      // ========================================
      // Success
      // ========================================

      console.log(
        `Resume processed successfully: ${req.file.originalname}`
      );

      console.log(
        `Final extracted characters: ${extractedText.length}`
      );

      console.log(
        "========================================"
      );

      return res.status(200).json({
        message:
          "Resume uploaded and processed successfully.",

        resumeId:
          resume._id,

        fileName:
          req.file.originalname,

        fileSize:
          req.file.size,
      });

    } catch (error) {
      console.error(
        "Resume Upload Error:",
        error.message
      );

      return res.status(500).json({
        message:
          "Failed to process the resume.",
      });

    } finally {
      // ========================================
      // PDF parser cleanup
      // ========================================

      if (parser) {
        try {
          await parser.destroy();
        } catch (cleanupError) {
          console.error(
            "PDF parser cleanup error:",
            cleanupError.message
          );
        }
      }
    }
  }
);

// ========================================
// Multer Error Handler
// ========================================

router.use(
  (error, req, res, next) => {
    if (error instanceof multer.MulterError) {

      if (
        error.code ===
        "LIMIT_FILE_SIZE"
      ) {
        return res.status(400).json({
          message:
            "Resume file size must be 5 MB or less.",
        });
      }

      return res.status(400).json({
        message:
          "Resume upload failed.",
      });
    }

    // File type / filename errors
    if (
      error &&
      error.message ===
        "Only PDF and DOCX files are allowed."
    ) {
      return res.status(400).json({
        message:
          "Only PDF and DOCX files are allowed.",
      });
    }

    next(error);
  }
);

// ========================================
// GET MY RESUME
// GET /api/resume/my-resume
// ========================================

router.get(
  "/my-resume",
  protect,

  async (req, res) => {
    try {
      const resume =
        await Resume.findOne({
          userId: req.user.userId,
        }).sort({
          createdAt: -1,
        });

      if (!resume) {
        return res.status(404).json({
          message:
            "No resume found.",
        });
      }

      return res.status(200).json({
        message:
          "Resume retrieved successfully.",

        resume: {
          id:
            resume._id,

          fileName:
            resume.fileName,

          fileSize:
            resume.fileSize,

          extractedText:
            resume.extractedText,

          // Gemini AI analysis
          analysis:
            resume.analysis,

          createdAt:
            resume.createdAt,

          updatedAt:
            resume.updatedAt,
        },
      });

    } catch (error) {
      console.error(
        "Get Resume Error:",
        error.message
      );

      return res.status(500).json({
        message:
          "Failed to retrieve resume.",
      });
    }
  }
);

module.exports = router;