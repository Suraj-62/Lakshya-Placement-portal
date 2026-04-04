import express from 'express';
import { getRandomQuestion } from '../controllers/questionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// ✅ ADD THIS LINE (MOST IMPORTANT)
router.get('/random/:category', protect, getRandomQuestion);

export default router;