import User from '../models/User.js';

// ✅ GET LEADERBOARD (GET /api/leaderboard)
export const getLeaderboard = async (req, res, next) => {
  try {
    // 1. Get total students count
    const totalStudents = await User.countDocuments({ role: 'student' });

    // 2. Get top 10 users
    const users = await User.find({ role: 'student' })
      .select('name avatar totalCorrect totalAttempts points badges streak')
      .sort({ totalCorrect: -1, points: -1 })
      .limit(10);

    // 3. Calculate current user's rank
    let userRank = 0;
    if (req.user && req.user.role === 'student') {
        const currentUser = await User.findById(req.user._id);
        if (currentUser) {
            const higherRankCount = await User.countDocuments({
                role: 'student',
                $or: [
                    { totalCorrect: { $gt: currentUser.totalCorrect } },
                    { totalCorrect: currentUser.totalCorrect, points: { $gt: currentUser.points } }
                ]
            });
            userRank = higherRankCount + 1;
        }
    }

    // 4. Format leaderboard data
    const leaderboard = users.map((user, index) => {
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
        streak: user.streak,
        rank: index + 1
      };
    });

    res.json({
        leaderboard,
        totalStudents,
        userRank
    });

  } catch (error) {
    next(error);
  }
};

