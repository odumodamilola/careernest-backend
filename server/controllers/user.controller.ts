import express, { Request, Response } from "express";
import { storage } from "../storage";
import { authenticateJWT } from "../middleware/auth.middleware";
import { validateUpdateProfile } from "../utils/validators";

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get("/profile", authenticateJWT, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await storage.getUser(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove password from response
    const userResponse = { ...user };
    delete userResponse.password;

    res.json(userResponse);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error while fetching profile" });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", authenticateJWT, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Validate request body
    const { error, value } = validateUpdateProfile(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // If user is trying to update email, check if it's already taken
    if (value.email && value.email !== req.user.email) {
      const existingUser = await storage.getUserByEmail(value.email);
      if (existingUser && existingUser.id !== req.user.id) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // Update user
    const updatedUser = await storage.updateUser(req.user.id, value);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove password from response
    const userResponse = { ...updatedUser };
    delete userResponse.password;

    res.json(userResponse);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error while updating profile" });
  }
});

export const userRouter = router;
