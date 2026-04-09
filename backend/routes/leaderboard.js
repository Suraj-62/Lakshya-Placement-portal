import express from 'express';
import { getLeaderboard } from '../controllers/leaderboardController.js';

const router = express.Router();

router.get('/', getLeaderboard); // Public or protect? Usually leaderboards can be public, but let's keep it open

export default router;
