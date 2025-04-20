import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { storage } from "../storage";

// JWT authentication middleware
export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from auth header or cookie
    let token;
    
    // Check authorization header first
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
    
    // If no token in header, check for token in cookie
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      // If user is authenticated via session, allow
      if (req.isAuthenticated()) {
        return next();
      }
      return res.status(401).json({ message: "Authentication required. No token provided." });
    }

    // Verify token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "careerNest_jwt_secret");
    
    // Get user from database
    const user = await storage.getUser(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Set user on request
    req.user = user;
    next();
  } catch (error) {
    // If token is invalid/expired but user is authenticated via session, allow
    if (req.isAuthenticated()) {
      return next();
    }
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token expired" });
    }
    
    return res.status(500).json({ message: "Server error during authentication" });
  }
};
