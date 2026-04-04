import express from 'express';
import { updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// ✅ profile update route
router.put('/profile', protect, upload.single('avatar'), updateProfile);

export default router;