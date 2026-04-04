import Question from '../models/Question.js';

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