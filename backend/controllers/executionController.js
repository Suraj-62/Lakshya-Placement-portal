import Question from '../models/Question.js';
import User from '../models/User.js';
import Submission from '../models/Submission.js';
import { runAgainstTestCases } from '../utils/codeRunner.js';

export const executeCode = async (req, res) => {
    try {
        const { questionId, code, language } = req.body;
        if (!code || !language || !questionId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        const testCases = question.testCases.filter(tc => !tc.isHidden);
        if (testCases.length === 0) testCases.push({ input: "", output: "" });

        const results = await runAgainstTestCases(code, language, testCases, question.functionName, question.drivers);

        res.json({
            results,
            allPassed: results.every(r => r.passed)
        });
    } catch (error) {
        console.error("Execution Error:", error);
        res.status(500).json({ message: "Execution failed", error: error.message });
    }
};

export const submitCode = async (req, res) => {
    try {
        const { questionId, code, language } = req.body;
        const userId = req.user._id;

        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        const testCases = question.testCases;
        const results = await runAgainstTestCases(code, language, testCases, question.functionName, question.drivers);

        const allPassed = results.every(r => r.passed);
        const passedCount = results.filter(r => r.passed).length;
        const status = allPassed ? 'Accepted' : (passedCount > 0 ? 'Wrong Answer' : 'Compile Error');

        const submission = await Submission.create({
            user: userId,
            question: questionId,
            code,
            language,
            status,
            passedCount,
            totalCount: testCases.length,
            results: results.map(r => ({ ...r, expectedOutput: "HIDDEN" })),
            pointsEarned: 0
        });

        if (allPassed) {
            const user = await User.findById(userId);
            if (user) {
                const alreadySolved = user.solvedCodingQuestions.some(id => id.toString() === questionId);
                if (!alreadySolved) {
                    user.solvedCodingQuestions.push(questionId);
                    const points = question.difficulty === 'hard' ? 30 : (question.difficulty === 'medium' ? 20 : 10);
                    user.points += points;
                    user.totalCorrect += 1;
                    submission.pointsEarned = points;
                    await submission.save();
                }
                user.totalAttempts += 1;
                await user.save();
            }
        } else {
            await User.findByIdAndUpdate(userId, { $inc: { totalAttempts: 1 } });
        }

        res.json({
            results: results.map(r => ({ ...r, expectedOutput: "HIDDEN" })),
            allPassed,
            passedCount,
            totalCount: testCases.length,
            submissionId: submission._id,
            pointsEarned: submission.pointsEarned
        });
    } catch (error) {
        console.error("Submission Error:", error);
        res.status(500).json({ message: "Submission failed", error: error.message });
    }
};
