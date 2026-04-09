import express from 'express';
import { getRandomQuestion, getRecommendedQuestions } from '../controllers/questionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// ✅ ADD THIS LINE (MOST IMPORTANT)
router.get('/random/:category', protect, getRandomQuestion);
router.get('/recommend', protect, getRecommendedQuestions);

export default router;