import Attempt from '../models/Attempt.js';
import Exam from '../models/Exam.js';
import User from '../models/User.js';

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

// ✅ WEAKNESS ANALYZER (GET /api/progress/weakness)
export const getWeakness = async (req, res, next) => {
  try {
    const exams = await Exam.find({ user: req.user._id, status: 'completed' }).populate('questions');
    
    const topicStats = {};

    exams.forEach(exam => {
       exam.answers.forEach(ans => {
         const question = exam.questions.find(q => q._id.toString() === ans.question.toString());
         if (question && question.topic) {
            if (!topicStats[question.topic]) {
               topicStats[question.topic] = { total: 0, correct: 0 };
            }
            topicStats[question.topic].total += 1;
            if (ans.isCorrect) topicStats[question.topic].correct += 1;
         }
       });
    });

    const weakTopics = Object.keys(topicStats).map(topic => {
      const stat = topicStats[topic];
      const accuracy = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
      return { topic, accuracy };
    }).sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 3); // top 3 weakest

    res.json({ weakTopics });
  } catch (error) {
    next(error);
  }
};

// ✅ PERFORMANCE DASHBOARD LOGIC (GET /api/progress/dashboard)
export const getDashboard = async (req, res, next) => {
  try {
     const user = await User.findById(req.user._id);
     
     // accuracy trend from last 7 exams
     const exams = await Exam.find({ user: req.user._id, status: 'completed' }).sort({ endTime: -1 }).limit(7);
     const trend = exams.map(e => ({ name: e.createdAt.toLocaleDateString(), score: e.score })).reverse();

     const accuracy = user.totalAttempts > 0 ? Math.round((user.totalCorrect / user.totalAttempts) * 100) : 0;

     res.json({
       totalAttempts: user.totalAttempts,
       totalCorrect: user.totalCorrect,
       overallAccuracy: accuracy,
       accuracyTrend: trend,
       points: user.points,
       badges: user.badges,
       streak: user.streak
     });
  } catch (error) {
    next(error);
  }
};

// ✅ RESUME INSIGHT FEATURE (GET /api/progress/summary)
export const getSummary = async (req, res, next) => {
   try {
     const user = await User.findById(req.user._id);
     const acc = user.totalAttempts > 0 ? Math.round((user.totalCorrect / user.totalAttempts) * 100) : 0;
     
     res.json({
        summary: `Solved ${user.totalAttempts >= 100 ? Math.floor(user.totalAttempts/100)*100 + '+' : user.totalAttempts} questions with ${acc}% accuracy`
     });
   } catch (error) {
     next(error);
   }
};