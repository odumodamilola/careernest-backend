import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { compareSync } from "bcryptjs";
import { storage } from "./storage";
import { User } from "@shared/schema";
import jwt from "jsonwebtoken";

// Add Express.User interface extension
declare global {
  namespace Express {
    interface User extends User {}
  }
}

export async function setupAuth(app: Express) {
  const JWT_SECRET = process.env.JWT_SECRET || "careerNest_jwt_secret";
  const SESSION_SECRET = process.env.SESSION_SECRET || "careerNest_session_secret";

  // Setup session middleware
  const sessionSettings: session.SessionOptions = {
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  
  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure local strategy for passport
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          if (!user) {
            return done(null, false, { message: "Invalid email or password" });
          }

          // Check password
          const isMatch = compareSync(password, user.password);
          if (!isMatch) {
            return done(null, false, { message: "Invalid email or password" });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Serialize and deserialize user for session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // JWT token generation helper
  app.use((req, res, next) => {
    req.generateJWT = (user: User) => {
      return jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "1d" }
      );
    };
    next();
  });
}

// Add generateJWT method to Request interface
declare global {
  namespace Express {
    interface Request {
      generateJWT: (user: User) => string;
    }
  }
}
