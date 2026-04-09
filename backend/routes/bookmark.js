import express from 'express';
import { protect } from '../middleware/auth.js';
import { toggleBookmark, getBookmarks } from '../controllers/bookmarkController.js';

const router = express.Router();

router.get('/', protect, getBookmarks);
router.post('/:questionId', protect, toggleBookmark);

export default router;
