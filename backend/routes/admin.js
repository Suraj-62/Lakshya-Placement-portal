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
} from '../controllers/adminController.js';

const router = express.Router();

router.use(protect, admin);

router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

router.get('/questions', getAllQuestions);
router.post('/questions', createQuestion);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);

export default router;