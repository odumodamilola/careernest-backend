import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/authController';
import { validate } from '../middleware/validate';
import { insertUserSchema, loginSchema } from '@shared/schema';
import { protect } from '../middleware/auth';

const router = express.Router();

// Register user
router.post('/register', validate(insertUserSchema), registerUser);

// Login user
router.post('/login', validate(loginSchema), loginUser);

// Logout user (protected)
router.post('/logout', protect, logoutUser);

export default router;
