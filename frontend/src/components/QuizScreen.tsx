import React, { useState, useEffect } from 'react';
import { Question, UserAnswers } from '../types/quiz';

interface QuizScreenProps {
  questions: Question[];
  userAnswers: UserAnswers;
  setUserAnswers: React.Dispatch<React.SetStateAction<UserAnswers>>;
  onSubmit: () => void;
  loading: boolean;
}

const QUIZ_TIME_SECONDS = 300; // 5 minutes

const QuizScreen: React.FC<QuizScreenProps> = ({
  questions,
  userAnswers,
  setUserAnswers,
  onSubmit,
  loading,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(QUIZ_TIME_SECONDS);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onSubmit]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleOptionSelect = (option: string) => {
    setUserAnswers({
      ...userAnswers,
      [currentQuestion.id]: option,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const selectedAnswer = userAnswers[currentQuestion.id];

  return (
    <div className="container quiz-screen">
      <div className="quiz-header">
        <div className="progress-bar">
          <div className="progress-text">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className={`timer ${timeRemaining < 60 ? 'warning' : ''}`}>
          ⏱️ {formatTime(timeRemaining)}
        </div>
      </div>

      <div className="question-container">
        <h2 className="question-text">{currentQuestion.question_text}</h2>
        <div className="options">
          {['A', 'B', 'C', 'D'].map((option) => {
            const optionKey = `option_${option.toLowerCase()}` as keyof Question;
            const optionText = currentQuestion[optionKey] as string;
            return (
              <div
                key={option}
                className={`option ${selectedAnswer === option ? 'selected' : ''}`}
                onClick={() => handleOptionSelect(option)}
              >
                <div className="option-label">{option}</div>
                <div className="option-text">{optionText}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="navigation">
        <button
          className="nav-button"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          ← Previous
        </button>
        {isLastQuestion ? (
          <button
            className="nav-button"
            onClick={onSubmit}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Quiz'}
          </button>
        ) : (
          <button className="nav-button" onClick={handleNext}>
            Next →
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizScreen;
