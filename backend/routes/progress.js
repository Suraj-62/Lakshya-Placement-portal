import express from 'express';
import { getStats, getHistory, getWeakness, getDashboard, getSummary } from '../controllers/progressController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', protect, getStats);
router.get('/history', protect, getHistory);

// 🔥 Advanced Features
router.get('/weakness', protect, getWeakness);
router.get('/dashboard', protect, getDashboard);
router.get('/summary', protect, getSummary);

export default router;