import User from '../models/User.js';

// ✅ GET LEADERBOARD (GET /api/leaderboard)
export const getLeaderboard = async (req, res, next) => {
  try {
    // Rank logic: Priority 1: totalCorrect, Priority 2: accuracy (calculated if needed)
    // We will just order by totalCorrect (desc), then points (desc)
    const users = await User.find({ role: 'student' })
      .select('name avatar totalCorrect totalAttempts points badges streak')
      .sort({ totalCorrect: -1, points: -1 })
      .limit(10);

    // Calculate dynamic accuracy
    const leaderboard = users.map(user => {
      const accuracy = user.totalAttempts > 0 
        ? ((user.totalCorrect / user.totalAttempts) * 100).toFixed(1) 
        : 0;

      return {
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        totalCorrect: user.totalCorrect,
        accuracy: Number(accuracy),
        points: user.points,
        badges: user.badges,
        streak: user.streak
      };
    });

    res.json(leaderboard);

  } catch (error) {
    next(error);
  }
};
