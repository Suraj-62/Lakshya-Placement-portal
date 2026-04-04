import Attempt from '../models/Attempt.js';
import Question from '../models/Question.js';

export const attemptQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { selectedAnswer } = req.body;
    const userId = req.user._id;

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const isCorrect = question.correctAnswer === selectedAnswer;

    const attempt = await Attempt.create({
      user: userId,
      question: id,
      selectedAnswer,
      isCorrect,
    });

    res.json({
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
    });
  } catch (error) {
    next(error);
  }
};