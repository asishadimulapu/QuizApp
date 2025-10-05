const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const fetchQuestions = async () => {
  const response = await fetch(`${API_BASE_URL}/quiz/questions`);
  if (!response.ok) {
    throw new Error('Failed to fetch questions');
  }
  const data = await response.json();
  return data.questions;
};

export const submitQuiz = async (answers: Record<number, string>) => {
  const response = await fetch(`${API_BASE_URL}/quiz/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ answers }),
  });

  if (!response.ok) {
    throw new Error('Failed to submit quiz');
  }

  return await response.json();
};
