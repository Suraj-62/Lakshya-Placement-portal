import express from 'express';
import { executeCode, submitCode } from '../controllers/executionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/run', protect, executeCode);
router.post('/submit', protect, submitCode);

export default router;
