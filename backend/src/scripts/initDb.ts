import { Database } from '../models/database';
import path from 'path';

const sampleQuestions = [
  {
    question_text: 'What is the capital of France?',
    option_a: 'London',
    option_b: 'Berlin',
    option_c: 'Paris',
    option_d: 'Madrid',
    correct_option: 'C',
  },
  {
    question_text: 'Which planet is known as the Red Planet?',
    option_a: 'Venus',
    option_b: 'Mars',
    option_c: 'Jupiter',
    option_d: 'Saturn',
    correct_option: 'B',
  },
  {
    question_text: 'What is 2 + 2?',
    option_a: '3',
    option_b: '4',
    option_c: '5',
    option_d: '6',
    correct_option: 'B',
  },
  {
    question_text: 'Who wrote "Romeo and Juliet"?',
    option_a: 'Charles Dickens',
    option_b: 'Mark Twain',
    option_c: 'William Shakespeare',
    option_d: 'Jane Austen',
    correct_option: 'C',
  },
  {
    question_text: 'What is the largest ocean on Earth?',
    option_a: 'Atlantic Ocean',
    option_b: 'Indian Ocean',
    option_c: 'Arctic Ocean',
    option_d: 'Pacific Ocean',
    correct_option: 'D',
  },
  {
    question_text: 'In which year did World War II end?',
    option_a: '1943',
    option_b: '1944',
    option_c: '1945',
    option_d: '1946',
    correct_option: 'C',
  },
  {
    question_text: 'What is the smallest prime number?',
    option_a: '0',
    option_b: '1',
    option_c: '2',
    option_d: '3',
    correct_option: 'C',
  },
  {
    question_text: 'Which programming language is known for its use in web development?',
    option_a: 'Python',
    option_b: 'JavaScript',
    option_c: 'C++',
    option_d: 'Java',
    correct_option: 'B',
  },
  {
    question_text: 'What is the chemical symbol for gold?',
    option_a: 'Go',
    option_b: 'Gd',
    option_c: 'Au',
    option_d: 'Ag',
    correct_option: 'C',
  },
  {
    question_text: 'How many continents are there on Earth?',
    option_a: '5',
    option_b: '6',
    option_c: '7',
    option_d: '8',
    correct_option: 'C',
  },
];

async function initializeDatabase() {
  const dbPath = path.join(__dirname, '../../quiz.db');
  const db = new Database(dbPath);

  try {
    console.log('Initializing database...');
    await db.initialize();

    console.log('Clearing existing questions...');
    await db.clearQuestions();

    console.log('Inserting sample questions...');
    for (const question of sampleQuestions) {
      await db.insertQuestion(question);
    }

    console.log('Database initialized successfully');
    console.log(`Inserted ${sampleQuestions.length} questions`);

    await db.close();
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    await db.close();
    process.exit(1);
  }
}

initializeDatabase();
