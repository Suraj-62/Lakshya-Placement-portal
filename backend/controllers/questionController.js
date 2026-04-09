import Question from '../models/Question.js';
import User from '../models/User.js';
import Exam from '../models/Exam.js';

export const getRandomQuestion = async (req, res, next) => {
  try {
    const { category } = req.params;

    const questions = await Question.find({ category }).populate('category');

    if (questions.length === 0) {
      return res.status(404).json({ message: "No questions found" });
    }

    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

    res.json(randomQuestion);

  } catch (error) {
    console.log(error);
    next(error);
  }
};

// ✅ SMART RECOMMENDATION ENGINE (GET /api/questions/recommend)
export const getRecommendedQuestions = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const accuracy = user.totalAttempts > 0 ? (user.totalCorrect / user.totalAttempts) * 100 : 0;

    // Difficulty heuristic based on running accuracy
    let targetDifficulty = 'medium';
    if (accuracy < 50) targetDifficulty = 'easy';
    if (accuracy > 70) targetDifficulty = 'hard';

    // Gather weakness context
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

    let weakTopic = null;
    let lowestAcc = 100;
    
    for (const [topic, stat] of Object.entries(topicStats)) {
       const acc = stat.total > 0 ? (stat.correct / stat.total) * 100 : 0;
       if (acc < lowestAcc && stat.total > 2) { // must have attempted > 2 logic for stability
          lowestAcc = acc;
          weakTopic = topic;
       }
    }

    let filter = { difficulty: targetDifficulty };
    if (weakTopic) filter.topic = weakTopic;

    let targetQuestions = await Question.find(filter).populate('category').limit(10);
    
    if (targetQuestions.length === 0) {
       // fallback dropping the specific strict weakness topic if ran out of content
       targetQuestions = await Question.find({ difficulty: targetDifficulty }).populate('category').limit(10);
    }
    
    res.json(targetQuestions);
  } catch(error) {
    next(error);
  }
};