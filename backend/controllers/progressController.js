import Attempt from '../models/Attempt.js';

export const getStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const totalAttempts = await Attempt.countDocuments({ user: userId });
    const correctAttempts = await Attempt.countDocuments({ user: userId, isCorrect: true });
    const accuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;

    const categoryStats = await Attempt.aggregate([
      { $match: { user: userId } },
      { $lookup: { from: 'questions', localField: 'question', foreignField: '_id', as: 'q' } },
      { $unwind: '$q' },
      { $group: {
          _id: '$q.category',
          total: { $sum: 1 },
          correct: { $sum: { $cond: ['$isCorrect', 1, 0] } },
      }},
      { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'cat' } },
      { $unwind: '$cat' },
      { $project: {
          categoryName: '$cat.name',
          total: 1,
          correct: 1,
          accuracy: { $multiply: [{ $divide: ['$correct', '$total'] }, 100] },
      }},
    ]);

    res.json({
      totalAttempts,
      correctAttempts,
      accuracy: accuracy.toFixed(2),
      categoryStats,
    });
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const attempts = await Attempt.find({ user: req.user._id })
      .populate('question', 'questionText category difficulty')
      .sort('-createdAt')
      .limit(20);
    res.json(attempts);
  } catch (error) {
    next(error);
  }
};