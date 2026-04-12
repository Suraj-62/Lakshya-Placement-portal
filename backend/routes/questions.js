import express from 'express';
import { getRandomQuestion, getRecommendedQuestions, getCodingQuestions, getQuestionById } from '../controllers/questionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/random/:category', protect, getRandomQuestion);
router.get('/recommend', protect, getRecommendedQuestions);
router.get('/coding', protect, getCodingQuestions);
router.get('/:id', protect, getQuestionById);

export default router;
