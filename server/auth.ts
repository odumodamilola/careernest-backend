import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { User as UserType } from "@shared/schema";
import jwt from "jsonwebtoken";

// Define custom user interface for Express
declare global {
  namespace Express {
    // Use a different name to avoid circular reference
    interface User extends UserType {}
  }
}

export function setupAuth(app: Express) {
  // Use environment variables or fallback to default values for secrets
  const JWT_SECRET = process.env.JWT_SECRET || "careernest_jwt_secret";
  const SESSION_SECRET = process.env.SESSION_SECRET || "careernest_session_secret";

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
    new LocalStrategy(async (username, password, done) => {
      try {
        // Try to find by username first
        let user = await storage.getUserByUsername(username);
        
        // If not found, try by email
        if (!user) {
          user = await storage.getUserByEmail(username);
        }
        
        // If user not found
        if (!user) {
          return done(null, false, { message: "Invalid username/email or password" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Invalid username/email or password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  // Serialize and deserialize user for session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  
  // Add JWT generation helper to request object
  app.use((req: Request, _res: Response, next: NextFunction) => {
    req.generateJWT = (user: Express.User) => {
      return jwt.sign(
        { 
          id: user.id, 
          username: user.username,
          email: user.email 
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );
    };
    next();
  });
  
  // API route for user registration
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const user = await storage.createUser(req.body);
      
      // Login the user after registration
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Error during login after registration", error: err.message });
        }
        
        // Return user with JWT token
        return res.status(201).json({
          ...user,
          password: undefined, // Don't send password back
          token: req.generateJWT(user as Express.User)
        });
      });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });

  // Also keep the old route for backward compatibility
  app.post("/api/register", (req: Request, res: Response) => {
    app.handle(req, res, () => {
      req.url = "/api/auth/register";
      app.handle(req, res);
    });
  });

  // API route for user login
  app.post("/api/auth/login", (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", (err: Error | null, user: Express.User | false, info: { message: string } | undefined) => {
      if (err) {
        return res.status(500).json({ message: "Server error during login", error: err.message });
      }
      
      if (!user) {
        return res.status(401).json({ message: info?.message || "Authentication failed" });
      }
      
      req.login(user, (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ message: "Error during login", error: loginErr.message });
        }
        
        // Return user with JWT token
        return res.status(200).json({
          ...user,
          password: undefined, // Don't send password back
          token: req.generateJWT(user)
        });
      });
    })(req, res, next);
  });

  // Also keep the old route for backward compatibility
  app.post("/api/login", (req: Request, res: Response, next: NextFunction) => {
    app.handle(req, res, () => {
      req.url = "/api/auth/login";
      app.handle(req, res, next);
    });
  });

  // API route for user logout
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Error during logout", error: err.message });
      }
      
      return res.status(200).json({ message: "Logged out successfully" });
    });
  });

  // Also keep the old route for backward compatibility
  app.post("/api/logout", (req: Request, res: Response) => {
    app.handle(req, res, () => {
      req.url = "/api/auth/logout";
      app.handle(req, res);
    });
  });

  // API route to get current user
  app.get("/api/users/profile", (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const user = req.user;
    return res.status(200).json({
      ...user,
      password: undefined // Don't send password back
    });
  });

  // Also keep the old route for backward compatibility
  app.get("/api/user", (req: Request, res: Response) => {
    app.handle(req, res, () => {
      req.url = "/api/users/profile";
      app.handle(req, res);
    });
  });
}

// Add generateJWT method to Request interface
declare global {
  namespace Express {
    interface Request {
      generateJWT: (user: Express.User) => string;
    }
  }
}
