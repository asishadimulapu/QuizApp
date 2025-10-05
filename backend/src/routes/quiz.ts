import { Router, Request, Response } from 'express';
import database from '../models/database';

const router = Router();

// GET /api/quiz/questions - Fetch all questions without correct answers
router.get('/questions', async (req: Request, res: Response) => {
  try {
    const questions = await database.getAllQuestions();
    res.json({ questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// POST /api/quiz/submit - Submit answers and get score
router.post('/submit', async (req: Request, res: Response) => {
  try {
    const { answers } = req.body;

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ error: 'Invalid answers format' });
    }

    let correctCount = 0;
    const results: Array<{
      questionId: number;
      userAnswer: string;
      correctAnswer: string;
      isCorrect: boolean;
    }> = [];

    // Check each answer
    for (const [questionId, userAnswer] of Object.entries(answers)) {
      const question = await database.getQuestionById(parseInt(questionId));

      if (!question) {
        continue;
      }

      const isCorrect = question.correct_option === userAnswer;
      if (isCorrect) {
        correctCount++;
      }

      results.push({
        questionId: parseInt(questionId),
        userAnswer: userAnswer as string,
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
  } catch (error) {
    console.error('Error calculating score:', error);
    res.status(500).json({ error: 'Failed to calculate score' });
  }
});

export default router;
