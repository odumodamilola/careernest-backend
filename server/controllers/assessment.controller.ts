import express, { Request, Response } from "express";
import { storage } from "../storage";
import { authenticateJWT } from "../middleware/auth.middleware";
import { validateParam, validateAssessmentSubmission } from "../utils/validators";

const router = express.Router();

// @route   GET /api/assessments
// @desc    Get all assessments
// @access  Public
router.get("/", async (_req: Request, res: Response) => {
  try {
    const assessments = await storage.getAllAssessments();
    res.json(assessments);
  } catch (error) {
    console.error("Get assessments error:", error);
    res.status(500).json({ message: "Server error while fetching assessments" });
  }
});

// @route   GET /api/assessments/:id
// @desc    Get assessment by ID with questions
// @access  Public
router.get("/:id", async (req: Request, res: Response) => {
  try {
    // Validate ID parameter
    const { error, value } = validateParam(req.params.id);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const assessment = await storage.getAssessment(value);
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    res.json(assessment);
  } catch (error) {
    console.error("Get assessment error:", error);
    res.status(500).json({ message: "Server error while fetching assessment" });
  }
});

// @route   POST /api/assessments/:id/submit
// @desc    Submit assessment answers
// @access  Private
router.post("/:id/submit", authenticateJWT, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Validate ID parameter
    const { error: idError, value: assessmentId } = validateParam(req.params.id);
    if (idError) {
      return res.status(400).json({ message: idError.details[0].message });
    }

    // Validate request body
    const { error: bodyError, value: answers } = validateAssessmentSubmission(req.body);
    if (bodyError) {
      return res.status(400).json({ message: bodyError.details[0].message });
    }

    // Check if assessment exists
    const assessment = await storage.getAssessment(assessmentId);
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    // Submit assessment and get results
    const result = await storage.submitAssessment(req.user.id, assessmentId, answers);
    res.json(result);
  } catch (error) {
    console.error("Submit assessment error:", error);
    res.status(500).json({ message: "Server error while submitting assessment" });
  }
});

// @route   GET /api/assessments/results
// @desc    Get user's assessment results
// @access  Private
router.get("/results", authenticateJWT, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const results = await storage.getUserAssessmentResults(req.user.id);
    res.json(results);
  } catch (error) {
    console.error("Get assessment results error:", error);
    res.status(500).json({ message: "Server error while fetching assessment results" });
  }
});

export const assessmentRouter = router;
