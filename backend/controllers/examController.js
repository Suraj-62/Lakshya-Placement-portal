import mongoose from 'mongoose';
import Question from '../models/Question.js';
import Exam from '../models/Exam.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import { GoogleGenAI } from '@google/genai';

// ✅ START EXAM (Unified Smart Assessment)
export const startExam = async (req, res, next) => {
  try {
    const { category, difficulty, count = 10, duration = 30 } = req.body;

    const filter = { type: { $ne: 'code' } }; // Only fetch MCQs for practice sessions
    if (category && mongoose.Types.ObjectId.isValid(category)) {
      filter.category = new mongoose.Types.ObjectId(category);
    }
    if (difficulty) {
      filter.difficulty = difficulty;
    }

    const questions = await Question.find(filter);

    // Shuffle and pick
    const shuffled = questions.sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, Math.min(count, questions.length));

    if (selectedQuestions.length === 0) {
      return res.status(400).json({ message: 'No questions found for this configuration' });
    }

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

// ✅ START AI EXAM (Optimized with Caching and Refill)
export const startAIExam = async (req, res, next) => {
  try {
    const { category, count = 10, duration = 30 } = req.body;

    if (!category || !mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: "Valid Category is required for AI generation." });
    }

    const catId = new mongoose.Types.ObjectId(category);
    const catObj = await Category.findById(catId);
    if (!catObj) return res.status(404).json({ message: "Category not found" });

    // 1. Check existing AI pool size
    const existingCount = await Question.countDocuments({ category: catId, isAIGenerated: true });
    
    // Threshold: If we have at least 25 questions, we can serve instantly.
    // If not, we refill the pool to 50-100.
    if (existingCount < 30) {
      console.log(`Refilling AI pool for ${catObj.name}... Current count: ${existingCount}`);
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const prompt = `
Generate 10 high-quality technical placement questions (MCQs) for the category: "${catObj.name}".
Difficulty Distribution: 30% Easy, 40% Medium, 30% Hard.
Focus: FAANG and top-tier tech company interview standards.

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

      try {
        const result = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt
        });

        const rawText = result.text.trim();
        const jsonStart = rawText.indexOf('[');
        const jsonEnd = rawText.lastIndexOf(']');

        if (jsonStart !== -1 && jsonEnd !== -1) {
          const cleanJson = rawText.substring(jsonStart, jsonEnd + 1);
          const questionsData = JSON.parse(cleanJson);

          if (Array.isArray(questionsData) && questionsData.length > 0) {
            const docs = questionsData.map(q => ({
              ...q,
              category: catId,
              type: 'mcq',
              isAIGenerated: true
            }));
            await Question.insertMany(docs);
            console.log(`Successfully added ${docs.length} AI questions to the pool.`);
          }
        }
      } catch (aiErr) {
        console.error("Refill Error:", aiErr);
        if (existingCount === 0) throw aiErr;
      }
    }

    // 2. Select questions from the pool (Randomly)
    const examQuestions = await Question.aggregate([
      { $match: { category: catId, isAIGenerated: true } },
      { $sample: { size: Math.min(count, 100) } }
    ]);

    if (!examQuestions || examQuestions.length === 0) {
      return res.status(500).json({ message: "AI Pool empty and generation failed. Try again." });
    }

    // 3. Create Exam
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + duration * 60000);

    const exam = await Exam.create({
      user: req.user._id,
      questions: examQuestions.map(q => q._id),
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
      isInstant: existingCount >= 30 // Tell frontend if it was from cache
    });

  } catch (error) {
    console.log("AI Exam Start Error:", error);
    res.status(500).json({ message: "Failed to initialize AI Exam." });
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

    // 🏆 GAMIFICATION & ANALYTICS
    const userObj = await User.findById(exam.user);
    if (userObj) {
      userObj.totalAttempts += exam.questions.length;
      userObj.totalCorrect += correctCount;
      userObj.points += (correctCount * 10); // 10 points per correct answer

      // Badges system
      if (userObj.totalCorrect >= 10 && !userObj.badges.includes("Beginner")) {
        userObj.badges.push("Beginner");
      }
      if (userObj.totalCorrect >= 50 && !userObj.badges.includes("Intermediate")) {
        userObj.badges.push("Intermediate");
      }
      if (userObj.totalCorrect >= 100 && !userObj.badges.includes("Expert")) {
        userObj.badges.push("Expert");
      }

      await userObj.save();
    }

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