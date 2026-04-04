import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  startExam,
  getExam,
  submitExamAnswer,
  tabSwitch,
  completeExam,
  getStats
} from '../controllers/examController.js';

const router = express.Router();

// 🔥 FIRST put static routes
router.get('/stats', protect, getStats);

// 🔥 then dynamic routes
router.post('/start', protect, startExam);
router.get('/:id', protect, getExam);
router.post('/:id/answer', protect, submitExamAnswer);
router.post('/:id/tab-switch', protect, tabSwitch);
router.post('/:id/complete', protect, completeExam);

export default router;