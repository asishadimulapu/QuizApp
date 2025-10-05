import request from 'supertest';
import app from '../index';
import { Database } from '../models/database';
import path from 'path';
import fs from 'fs';

const TEST_DB_PATH = path.join(__dirname, '../../test.db');
let testDb: Database;

beforeAll(async () => {
  // Create a test database
  testDb = new Database(TEST_DB_PATH);
  await testDb.initialize();

  // Insert test questions
  await testDb.insertQuestion({
    question_text: 'Test question 1?',
    option_a: 'Option A',
    option_b: 'Option B',
    option_c: 'Option C',
    option_d: 'Option D',
    correct_option: 'A',
  });

  await testDb.insertQuestion({
    question_text: 'Test question 2?',
    option_a: 'Option A',
    option_b: 'Option B',
    option_c: 'Option C',
    option_d: 'Option D',
    correct_option: 'B',
  });
});

afterAll(async () => {
  await testDb.close();
  // Clean up test database
  if (fs.existsSync(TEST_DB_PATH)) {
    fs.unlinkSync(TEST_DB_PATH);
  }
});

describe('Quiz API', () => {
  describe('GET /api/quiz/questions', () => {
    it('should return all questions without correct answers', async () => {
      const response = await request(app).get('/api/quiz/questions');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('questions');
      expect(Array.isArray(response.body.questions)).toBe(true);

      if (response.body.questions.length > 0) {
        const question = response.body.questions[0];
        expect(question).toHaveProperty('id');
        expect(question).toHaveProperty('question_text');
        expect(question).toHaveProperty('option_a');
        expect(question).toHaveProperty('option_b');
        expect(question).toHaveProperty('option_c');
        expect(question).toHaveProperty('option_d');
        expect(question).not.toHaveProperty('correct_option');
      }
    });
  });

  describe('POST /api/quiz/submit', () => {
    it('should calculate score correctly for all correct answers', async () => {
      const answers = {
        1: 'A',
        2: 'B',
      };

      const response = await request(app)
        .post('/api/quiz/submit')
        .send({ answers });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('score');
      expect(response.body).toHaveProperty('correctCount');
      expect(response.body).toHaveProperty('totalQuestions');
      expect(response.body).toHaveProperty('results');
      expect(Array.isArray(response.body.results)).toBe(true);
    });

    it('should calculate score correctly for mixed answers', async () => {
      const answers = {
        1: 'A', // Correct
        2: 'C', // Incorrect
      };

      const response = await request(app)
        .post('/api/quiz/submit')
        .send({ answers });

      expect(response.status).toBe(200);
      expect(response.body.results.length).toBe(2);

      const result1 = response.body.results.find((r: any) => r.questionId === 1);
      const result2 = response.body.results.find((r: any) => r.questionId === 2);

      expect(result1.isCorrect).toBe(true);
      expect(result2.isCorrect).toBe(false);
    });

    it('should return 400 for invalid answers format', async () => {
      const response = await request(app)
        .post('/api/quiz/submit')
        .send({ answers: 'invalid' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 0 score for all incorrect answers', async () => {
      const answers = {
        1: 'D', // Incorrect
        2: 'D', // Incorrect
      };

      const response = await request(app)
        .post('/api/quiz/submit')
        .send({ answers });

      expect(response.status).toBe(200);
      expect(response.body.correctCount).toBe(0);
      expect(response.body.score).toBe(0);
    });

    it('should calculate percentage score correctly', async () => {
      const answers = {
        1: 'A', // Correct
        2: 'D', // Incorrect
      };

      const response = await request(app)
        .post('/api/quiz/submit')
        .send({ answers });

      expect(response.status).toBe(200);
      expect(response.body.correctCount).toBe(1);
      expect(response.body.totalQuestions).toBe(2);
      expect(response.body.score).toBe(50);
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});
