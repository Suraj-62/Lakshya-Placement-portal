import Category from '../models/Category.js';
import Question from '../models/Question.js';

export const createCategory = async (req, res, next) => {
  try {
    const { name, description, icon } = req.body;
    const category = await Category.create({ name, description, icon });
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      category.name = req.body.name || category.name;
      category.description = req.body.description || category.description;
      category.icon = req.body.icon || category.icon;
      const updated = await category.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      await category.deleteOne();
      res.json({ message: 'Category removed' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const createQuestion = async (req, res, next) => {
  try {
    const { category, topic, difficulty, questionText, options, correctAnswer, explanation, type } = req.body;
    const question = await Question.create({
      category,
      topic,
      difficulty,
      questionText,
      options,
      correctAnswer,
      explanation,
      type,
      createdBy: req.user._id,
    });
    res.status(201).json(question);
  } catch (error) {
    next(error);
  }
};

export const updateQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (question) {
      question.category = req.body.category || question.category;
      question.topic = req.body.topic || question.topic;
      question.difficulty = req.body.difficulty || question.difficulty;
      question.questionText = req.body.questionText || question.questionText;
      question.options = req.body.options || question.options;
      question.correctAnswer = req.body.correctAnswer || question.correctAnswer;
      question.explanation = req.body.explanation || question.explanation;
      question.type = req.body.type || question.type;
      const updated = await question.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Question not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (question) {
      await question.deleteOne();
      res.json({ message: 'Question removed' });
    } else {
      res.status(404).json({ message: 'Question not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const getAllQuestions = async (req, res, next) => {
  try {
    const questions = await Question.find({}).populate('category', 'name');
    res.json(questions);
  } catch (error) {
    next(error);
  }
};