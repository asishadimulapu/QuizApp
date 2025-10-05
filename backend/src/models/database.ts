import sqlite3 from 'sqlite3';
import path from 'path';

const DB_PATH = path.join(__dirname, '../../quiz.db');

export interface Question {
  id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
}

export interface QuestionWithoutAnswer {
  id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
}

export class Database {
  private db: sqlite3.Database;

  constructor(dbPath: string = DB_PATH) {
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
      } else {
        console.log('Connected to SQLite database');
      }
    });
  }

  // Initialize database schema
  initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS questions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          question_text TEXT NOT NULL,
          option_a TEXT NOT NULL,
          option_b TEXT NOT NULL,
          option_c TEXT NOT NULL,
          option_d TEXT NOT NULL,
          correct_option TEXT NOT NULL
        )
      `;

      this.db.run(createTableQuery, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // Get all questions (without correct answers for quiz)
  getAllQuestions(): Promise<QuestionWithoutAnswer[]> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT id, question_text, option_a, option_b, option_c, option_d 
        FROM questions 
        ORDER BY id
      `;

      this.db.all(query, (err, rows: QuestionWithoutAnswer[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Get question with correct answer (for scoring)
  getQuestionById(id: number): Promise<Question | undefined> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM questions WHERE id = ?';

      this.db.get(query, [id], (err, row: Question) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Insert a question
  insertQuestion(question: Omit<Question, 'id'>): Promise<number> {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_option)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      this.db.run(
        query,
        [
          question.question_text,
          question.option_a,
          question.option_b,
          question.option_c,
          question.option_d,
          question.correct_option,
        ],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        }
      );
    });
  }

  // Clear all questions
  clearQuestions(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM questions', (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // Close database connection
  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

export default new Database();
