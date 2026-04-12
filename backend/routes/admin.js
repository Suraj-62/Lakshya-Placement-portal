import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import {
  createCategory,
  updateCategory,
  deleteCategory,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getAllQuestions,
  getDashboardStats,
  getUsersAnalytics,
  toggleUserBlock,
  seedCategoryWithAI,
} from '../controllers/adminController.js';

const router = express.Router();

router.use(protect, admin);

router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);
router.post('/categories/:id/seed-ai', seedCategoryWithAI);

router.get('/questions', getAllQuestions);
router.post('/questions', createQuestion);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);
router.get('/stats', getDashboardStats);
router.get('/users', getUsersAnalytics);
router.put('/users/:id/toggle-block', toggleUserBlock);

export default router;