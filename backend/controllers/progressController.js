import Attempt from '../models/Attempt.js';
import Exam from '../models/Exam.js';
import User from '../models/User.js';
import Question from '../models/Question.js';
import { judgePerformance } from '../utils/aiAnalysis.js';

/**
 * Basic stats for charts
 */
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

/**
 * Historical attempts
 */
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

/**
 * Weakness Analyzer
 */
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
      .slice(0, 3);

    res.json({ weakTopics });
  } catch (error) {
    next(error);
  }
};

/**
 * Professional AI performance judge
 */
export const getSummary = async (req, res, next) => {
   try {
     const userId = req.user._id;
     
     // Fetch all completed exams to get a full picture
     const exams = await Exam.find({ user: userId, status: 'completed' }).populate('questions');
     
     if (exams.length === 0) {
        return res.json({ summary: "Initialize your first technical assessment to activate our A.I. Career Mentorship engine." });
     }

     // Compile performance snapshot
     const topicPerformance = {};
     exams.forEach(e => {
        e.answers.forEach(ans => {
           const q = e.questions.find(item => item._id.toString() === ans.question.toString());
           if (q && q.topic) {
               if(!topicPerformance[q.topic]) topicPerformance[q.topic] = { correct: 0, total: 0 };
               topicPerformance[q.topic].total++;
               if(ans.isCorrect) topicPerformance[q.topic].correct++;
           }
        });
     });

     const verdict = await judgePerformance({ 
         topics: topicPerformance,
         totalExams: exams.length,
         avgScore: exams.reduce((acc, e) => acc + e.score, 0) / exams.length
     });
     
     res.json({ summary: verdict });
   } catch (error) {
     next(error);
   }
};

/**
 * Main Dashboard Stats
 */
export const getDashboard = async (req, res, next) => {
  try {
     const userId = req.user._id;
     const user = await User.findById(userId);
     
     // 1. Accuracy trend from last 7 exams
     const exams = await Exam.find({ user: userId, status: 'completed' }).sort({ endTime: -1 }).limit(7);
     const trend = exams.map(e => ({ name: e.createdAt.toLocaleDateString(), score: e.score })).reverse();

     const accuracy = user.totalAttempts > 0 ? Math.round((user.totalCorrect / user.totalAttempts) * 100) : 0;

     // 2. Skill Mastery (All topics accuracy by Category)
     const skillMastery = await Attempt.aggregate([
        { $match: { user: userId } },
        { $lookup: { from: 'questions', localField: 'question', foreignField: '_id', as: 'q' } },
        { $unwind: '$q' },
        { $group: {
            _id: '$q.category',
            total: { $sum: 1 },
            correct: { $sum: { $cond: ['$isCorrect', 1, 0] } }
        }},
        { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'cat' } },
        { $unwind: '$cat' },
        { $project: {
            subject: '$cat.name',
            value: { $multiply: [{ $divide: ['$correct', '$total'] }, 100] }
        }}
     ]).sort({ value: -1 });

     // 3. Total counts in DB for progress tracking
     const [totalMcqsInDb, totalCodingInDb] = await Promise.all([
        Question.countDocuments({ type: 'mcq' }),
        Question.countDocuments({ type: 'code' }) // Fixed from 'coding' to 'code' based on schema
     ]);

     res.json({
       totalAttempts: user.totalAttempts,
       totalCorrect: user.totalCorrect,
       codingSolved: user.solvedCodingQuestions?.length || 0,
       totalMcqsInDb,
       totalCodingInDb,
       overallAccuracy: accuracy,
       accuracyTrend: trend,
       skillMastery,
       points: user.points,
       badges: user.badges,
       streak: user.streak
     });
  } catch (error) {
    next(error);
  }
};