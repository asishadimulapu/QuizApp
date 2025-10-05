import React from 'react';
import { Question, QuizSubmission, UserAnswers } from '../types/quiz';

interface ResultsScreenProps {
  results: QuizSubmission;
  questions: Question[];
  userAnswers: UserAnswers;
  onRestart: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({
  results,
  questions,
  userAnswers,
  onRestart,
}) => {
  const getQuestionText = (questionId: number) => {
    const question = questions.find((q) => q.id === questionId);
    return question?.question_text || '';
  };

  const getOptionText = (questionId: number, option: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return '';
    const optionKey = `option_${option.toLowerCase()}` as keyof Question;
    return question[optionKey] as string;
  };

  return (
    <div className="results-screen">
      <h2>Assessment Complete</h2>
      
      <div className="score-display">{results.score}%</div>

      <div className="score-summary">
        You answered {results.correctCount} out of {results.totalQuestions} questions correctly
      </div>

      <div className="results-details">
        <h3>Answer Review</h3>
        {results.results.map((result, index) => (
          <div
            key={result.questionId}
            className={`result-item ${result.isCorrect ? 'correct' : 'incorrect'}`}
          >
            <div className="result-question">
              {index + 1}. {getQuestionText(result.questionId)}
            </div>
            <div className="result-answer">
              <span>
                <strong>Your answer:</strong> {result.userAnswer} - {getOptionText(result.questionId, result.userAnswer)}
              </span>
              {!result.isCorrect && (
                <span>
                  <strong>Correct:</strong> {result.correctAnswer} - {getOptionText(result.questionId, result.correctAnswer)}
                </span>
              )}
            </div>
            <div className={`result-status ${result.isCorrect ? 'correct-status' : 'incorrect-status'}`}>
              {result.isCorrect ? '✓ Correct' : '✗ Incorrect'}
            </div>
          </div>
        ))}
      </div>

      <button className="restart-button" onClick={onRestart}>Retake Assessment</button>
    </div>
  );
};

export default ResultsScreen;
