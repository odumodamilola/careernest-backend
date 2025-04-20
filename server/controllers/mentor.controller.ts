import express, { Request, Response } from "express";
import { storage } from "../storage";
import { authenticateJWT } from "../middleware/auth.middleware";
import { validateParam, validateScheduleSession } from "../utils/validators";

const router = express.Router();

// @route   GET /api/mentors
// @desc    Get all mentors
// @access  Public
router.get("/", async (_req: Request, res: Response) => {
  try {
    const mentors = await storage.getAllMentors();
    res.json(mentors);
  } catch (error) {
    console.error("Get mentors error:", error);
    res.status(500).json({ message: "Server error while fetching mentors" });
  }
});

// @route   GET /api/mentors/:id
// @desc    Get mentor by ID
// @access  Public
router.get("/:id", async (req: Request, res: Response) => {
  try {
    // Validate ID parameter
    const { error, value } = validateParam(req.params.id);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const mentor = await storage.getMentor(value);
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    res.json(mentor);
  } catch (error) {
    console.error("Get mentor error:", error);
    res.status(500).json({ message: "Server error while fetching mentor" });
  }
});

// @route   POST /api/mentors/schedule/:id
// @desc    Schedule a mentorship session
// @access  Private
router.post("/schedule/:id", authenticateJWT, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Validate ID parameter
    const { error: idError, value: mentorId } = validateParam(req.params.id);
    if (idError) {
      return res.status(400).json({ message: idError.details[0].message });
    }

    // Validate request body
    const { error: bodyError, value: sessionData } = validateScheduleSession(req.body);
    if (bodyError) {
      return res.status(400).json({ message: bodyError.details[0].message });
    }

    // Check if mentor exists
    const mentor = await storage.getMentor(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    // Schedule session
    const session = await storage.scheduleSession(req.user.id, mentorId, sessionData);
    res.status(201).json(session);
  } catch (error) {
    console.error("Schedule session error:", error);
    res.status(500).json({ message: "Server error while scheduling session" });
  }
});

export const mentorRouter = router;
