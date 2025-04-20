import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { updateUserSchema } from '@shared/schema';

const router = express.Router();

// All routes in this file are protected
router.use(protect);

// Get user profile
router.get('/profile', getUserProfile);

// Update user profile
router.put('/profile', validate(updateUserSchema), updateUserProfile);

export default router;
