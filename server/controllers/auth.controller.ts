import express, { Request, Response } from "express";
import { storage } from "../storage";
import passport from "passport";
import { hashSync } from "bcryptjs";
import { validateRegister, validateLogin } from "../utils/validators";

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", async (req: Request, res: Response) => {
  try {
    // Validate input
    const { error, value } = validateRegister(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if user already exists
    const existingUser = await storage.getUserByEmail(value.email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Hash password
    const hashedPassword = hashSync(value.password, 10);

    // Create user
    const user = await storage.createUser({
      name: value.name,
      email: value.email,
      password: hashedPassword,
    });

    // Remove password from response
    const userResponse = { ...user };
    delete userResponse.password;

    // Generate JWT token
    const token = req.generateJWT(user);

    // Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    // Login the user
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Error during login after registration" });
      }
      return res.status(201).json({
        user: userResponse,
        token,
      });
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", (req: Request, res: Response, next) => {
  try {
    // Validate input
    const { error } = validateLogin(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info.message || "Authentication failed" });
      }

      req.login(user, (loginErr) => {
        if (loginErr) {
          return next(loginErr);
        }

        // Generate JWT token
        const token = req.generateJWT(user);

        // Set token in cookie
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
        });

        // Remove password from response
        const userResponse = { ...user };
        delete userResponse.password;

        return res.json({
          user: userResponse,
          token,
        });
      });
    })(req, res, next);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user / clear cookie
// @access  Private
router.post("/logout", (req: Request, res: Response) => {
  // Clear cookie
  res.clearCookie("token");

  // Logout of passport session
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Error during logout" });
    }
    res.json({ message: "Logged out successfully" });
  });
});

export const authRouter = router;
