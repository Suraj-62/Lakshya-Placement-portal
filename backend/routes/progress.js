import express from 'express';
import { getStats, getHistory } from '../controllers/progressController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', protect, getStats);
router.get('/history', protect, getHistory);

export default router;