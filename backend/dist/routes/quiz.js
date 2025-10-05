"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = __importDefault(require("../models/database"));
const router = (0, express_1.Router)();
// GET /api/quiz/questions - Fetch all questions without correct answers
router.get('/questions', async (req, res) => {
    try {
        const questions = await database_1.default.getAllQuestions();
        res.json({ questions });
    }
    catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
});
// POST /api/quiz/submit - Submit answers and get score
router.post('/submit', async (req, res) => {
    try {
        const { answers } = req.body;
        if (!answers || typeof answers !== 'object') {
            return res.status(400).json({ error: 'Invalid answers format' });
        }
        let correctCount = 0;
        const results = [];
        // Check each answer
        for (const [questionId, userAnswer] of Object.entries(answers)) {
            const question = await database_1.default.getQuestionById(parseInt(questionId));
            if (!question) {
                continue;
            }
            const isCorrect = question.correct_option === userAnswer;
            if (isCorrect) {
                correctCount++;
            }
            results.push({
                questionId: parseInt(questionId),
                userAnswer: userAnswer,
                correctAnswer: question.correct_option,
                isCorrect,
            });
        }
        const totalQuestions = results.length;
        const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
        res.json({
            score,
            correctCount,
            totalQuestions,
            results,
        });
    }
    catch (error) {
        console.error('Error calculating score:', error);
        res.status(500).json({ error: 'Failed to calculate score' });
    }
});
exports.default = router;
