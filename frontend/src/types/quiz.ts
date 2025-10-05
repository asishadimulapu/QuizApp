export interface Question {
  id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
}

export interface QuizResult {
  questionId: number;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface QuizSubmission {
  score: number;
  correctCount: number;
  totalQuestions: number;
  results: QuizResult[];
}

export type UserAnswers = Record<number, string>;
