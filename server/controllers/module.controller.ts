import express, { Request, Response } from "express";
import { storage } from "../storage";
import { authenticateJWT } from "../middleware/auth.middleware";
import { validateParam } from "../utils/validators";

const router = express.Router();

// @route   GET /api/modules
// @desc    Get all learning modules
// @access  Public
router.get("/", async (_req: Request, res: Response) => {
  try {
    const modules = await storage.getAllModules();
    res.json(modules);
  } catch (error) {
    console.error("Get modules error:", error);
    res.status(500).json({ message: "Server error while fetching modules" });
  }
});

// @route   GET /api/modules/:id
// @desc    Get module by ID
// @access  Public
router.get("/:id", async (req: Request, res: Response) => {
  try {
    // Validate ID parameter
    const { error, value } = validateParam(req.params.id);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const module = await storage.getModule(value);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    res.json(module);
  } catch (error) {
    console.error("Get module error:", error);
    res.status(500).json({ message: "Server error while fetching module" });
  }
});

// @route   POST /api/modules/:id/complete
// @desc    Mark a module as completed
// @access  Private
router.post("/:id/complete", authenticateJWT, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Validate ID parameter
    const { error, value } = validateParam(req.params.id);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if module exists
    const module = await storage.getModule(value);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    // Mark as completed
    const result = await storage.completeModule(req.user.id, value);
    res.json(result);
  } catch (error) {
    console.error("Complete module error:", error);
    res.status(500).json({ message: "Server error while completing module" });
  }
});

export const moduleRouter = router;
