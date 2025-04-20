import express, { Request, Response } from "express";
import { storage } from "../storage";
import { authenticateJWT } from "../middleware/auth.middleware";
import { validateParam } from "../utils/validators";

const router = express.Router();

// @route   GET /api/careers
// @desc    Get all careers
// @access  Public
router.get("/", async (_req: Request, res: Response) => {
  try {
    const careers = await storage.getAllCareers();
    res.json(careers);
  } catch (error) {
    console.error("Get careers error:", error);
    res.status(500).json({ message: "Server error while fetching careers" });
  }
});

// @route   GET /api/careers/:id
// @desc    Get career by ID
// @access  Public
router.get("/:id", async (req: Request, res: Response) => {
  try {
    // Validate ID parameter
    const { error, value } = validateParam(req.params.id);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const career = await storage.getCareer(value);
    if (!career) {
      return res.status(404).json({ message: "Career not found" });
    }

    res.json(career);
  } catch (error) {
    console.error("Get career error:", error);
    res.status(500).json({ message: "Server error while fetching career" });
  }
});

// @route   POST /api/careers/bookmark/:id
// @desc    Bookmark a career
// @access  Private
router.post("/bookmark/:id", authenticateJWT, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Validate ID parameter
    const { error, value } = validateParam(req.params.id);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if career exists
    const career = await storage.getCareer(value);
    if (!career) {
      return res.status(404).json({ message: "Career not found" });
    }

    // Add bookmark
    const result = await storage.bookmarkCareer(req.user.id, value);
    res.json(result);
  } catch (error) {
    console.error("Bookmark career error:", error);
    res.status(500).json({ message: "Server error while bookmarking career" });
  }
});

// @route   GET /api/careers/bookmarks
// @desc    Get all bookmarked careers for a user
// @access  Private
router.get("/bookmarks", authenticateJWT, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const bookmarks = await storage.getUserBookmarks(req.user.id);
    res.json(bookmarks);
  } catch (error) {
    console.error("Get bookmarks error:", error);
    res.status(500).json({ message: "Server error while fetching bookmarks" });
  }
});

export const careerRouter = router;
