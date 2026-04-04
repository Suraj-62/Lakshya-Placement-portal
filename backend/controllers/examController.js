import mongoose from 'mongoose';
import Question from '../models/Question.js';
import Exam from '../models/Exam.js';

// ✅ START EXAM
export const startExam = async (req, res, next) => {
  try {
    const { category, difficulty, count = 12, duration = 30 } = req.body;

    const filter = {};

    if (category && mongoose.Types.ObjectId.isValid(category)) {
      filter.category = new mongoose.Types.ObjectId(category);
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    const allQuestions = await Question.find(filter);

    if (allQuestions.length === 0) {
      return res.status(400).json({ message: 'No questions found' });
    }

    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, Math.min(count, allQuestions.length));

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + duration * 60000);

    const exam = await Exam.create({
      user: req.user._id,
      questions: selectedQuestions.map(q => q._id),
      duration,
      startTime,
      endTime,
      status: 'ongoing',
      answers: [],
      tabSwitchCount: 0,
    });

    const populatedExam = await Exam.findById(exam._id).populate({
      path: 'questions',
      populate: { path: 'category' }
    });

    res.json({
      examId: exam._id,
      questions: populatedExam.questions,
      endTime: exam.endTime,
      duration: exam.duration,
    });

  } catch (error) {
    console.log(error);
    next(error);
  }
};

// ✅ GET EXAM
export const getExam = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate({
        path: 'questions',
        populate: { path: 'category' }
      })
      .populate('user', 'name email');

    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    res.json(exam);

  } catch (error) {
    next(error);
  }
};

// ✅ SUBMIT ANSWER
export const submitExamAnswer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { questionId, selectedAnswer } = req.body;

    const exam = await Exam.findById(id).populate('questions');

    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    const question = exam.questions.find(q => q._id.toString() === questionId);

    if (!question) return res.status(400).json({ message: 'Invalid question' });

    const isCorrect = question.correctAnswer === selectedAnswer;

    const alreadyAnswered = exam.answers.some(a => a.question.toString() === questionId);

    if (!alreadyAnswered) {
      exam.answers.push({
        question: questionId,
        selectedAnswer,
        isCorrect,
      });
      await exam.save();
    }

    res.json({ success: true });

  } catch (error) {
    next(error);
  }
};

// ✅ TAB SWITCH
export const tabSwitch = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id);

    exam.tabSwitchCount += 1;

    if (exam.tabSwitchCount >= 3) {
      exam.status = 'terminated';
    }

    await exam.save();

    res.json({
      tabSwitchCount: exam.tabSwitchCount,
      status: exam.status,
    });

  } catch (error) {
    next(error);
  }
};

// ✅ COMPLETE EXAM (🔥 THIS WAS MISSING)
export const completeExam = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    exam.status = 'completed';

    const correctCount = exam.answers.filter(a => a.isCorrect).length;

    exam.score = exam.questions.length > 0
      ? (correctCount / exam.questions.length) * 100
      : 0;

    await exam.save();

    res.json(exam);

  } catch (error) {
    next(error);
  }
};
export const getStats = async (req, res) => {
  const exams = await Exam.find({ user: req.user._id });

  let total = 0;
  let correct = 0;

  exams.forEach(exam => {
    exam.answers.forEach(ans => {
      total++;
      if (ans.isCorrect) correct++;
    });
  });

  const incorrect = total - correct;
  const accuracy = total === 0 ? 0 : ((correct / total) * 100).toFixed(2);

  res.json({
    total,
    correct,
    incorrect,
    accuracy,
  });
};