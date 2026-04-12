import Category from '../models/Category.js';
import Question from '../models/Question.js';
import User from '../models/User.js';
import Attempt from '../models/Attempt.js';
import { GoogleGenAI } from '@google/genai';
import mongoose from 'mongoose';

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
    const { 
      category, topic, difficulty, questionText, options, 
      correctAnswer, explanation, type,
      testCases, starterCode, functionName, constraints, drivers 
    } = req.body;
    
    const question = await Question.create({
      category,
      topic,
      difficulty,
      questionText,
      options,
      correctAnswer,
      explanation,
      type,
      testCases,
      starterCode,
      functionName,
      constraints,
      drivers,
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
      
      // Coding specific fields
      if (req.body.testCases) question.testCases = req.body.testCases;
      if (req.body.starterCode) question.starterCode = req.body.starterCode;
      if (req.body.functionName !== undefined) question.functionName = req.body.functionName;
      if (req.body.constraints !== undefined) question.constraints = req.body.constraints;
      if (req.body.drivers) question.drivers = req.body.drivers;
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

export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'student' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalQuestions = await Question.countDocuments();
    const totalCategories = await Category.countDocuments();
    
    // Category distribution
    const categories = await Category.find({});
    const distribution = await Promise.all(categories.map(async (cat) => {
      const count = await Question.countDocuments({ category: cat._id });
      return { _id: cat._id, name: cat.name, count };
    }));

    res.json({
      totalUsers,
      totalAdmins,
      totalQuestions,
      totalCategories,
      distribution
    });
  } catch (error) {
    next(error);
  }
};

export const getUsersAnalytics = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'student' })
      .select('-password')
      .sort({ lastActiveDate: -1 });

    const analytics = await Promise.all(users.map(async (user) => {
      const mcqAttempts = await Attempt.countDocuments({ user: user._id });
      const mcqCorrect = await Attempt.countDocuments({ user: user._id, isCorrect: true });
      const codingSolved = user.solvedCodingQuestions?.length || 0;

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        points: user.points,
        streak: user.streak,
        lastActive: user.lastActiveDate,
        createdAt: user.createdAt,
        isBlocked: user.isBlocked,
        stats: {
          mcqTotal: mcqAttempts,
          mcqCorrect: mcqCorrect,
          mcqAccuracy: mcqAttempts > 0 ? ((mcqCorrect / mcqAttempts) * 100).toFixed(1) : 0,
          codingSolved: codingSolved
        }
      };
    }));

    res.json(analytics);
  } catch (error) {
    next(error);
  }
};

export const toggleUserBlock = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent blocking self
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot block yourself' });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ 
        message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, 
        isBlocked: user.isBlocked 
    });
  } catch (error) {
    next(error);
  }
};

export const seedCategoryWithAI = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cat = await Category.findById(id);
    if (!cat) return res.status(404).json({ message: 'Category not found' });

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // We'll generate 10 questions at a time for maximum reliability
    const prompt = `
Generate 10 professional-grade technical placement questions (MCQs) for the category: "${cat.name}".
Difficulty Distribution: 30% Easy, 40% Medium, 30% Hard.
Focus: FAANG, Top MNCs, and Competitive Programming standards.

OUTPUT RAW JSON ONLY. No markdown, no formatting.
Format:
[
  {
    "questionText": "...",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "...",
    "explanation": "...",
    "difficulty": "easy/medium/hard",
    "topic": "..."
  }
]
`;

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    console.log("AI result received. Type:", typeof result);
    const rawText = result.text ? result.text.trim() : "";
    
    if (!rawText) {
      console.error("AI response text is empty. Full result:", result);
      throw new Error("AI returned an empty response. Check safety filters or quota.");
    }

    // Robust extraction: Find the first [ and last ]
    const jsonStart = rawText.indexOf('[');
    const jsonEnd = rawText.lastIndexOf(']');
    
    if (jsonStart === -1 || jsonEnd === -1) {
      console.error("No JSON found in AI response:", rawText);
      throw new Error(`Invalid AI response shape. Response began with: ${rawText.substring(0, 50)}...`);
    }

    const cleanJson = rawText.substring(jsonStart, jsonEnd + 1);
    const questionsData = JSON.parse(cleanJson);

    const docs = questionsData.map(q => ({
      ...q,
      category: id,
      type: 'mcq',
      isAIGenerated: true
    }));

    await Question.insertMany(docs);

    res.json({ 
      success: true, 
      count: docs.length, 
      message: `Successfully seeded ${docs.length} questions into ${cat.name}` 
    });

  } catch (error) {
    console.error("Seeding Error Details:", error);
    res.status(500).json({ 
      message: `AI Generation Failed: ${error.message}`,
      error: error.stack
    });
  }
};