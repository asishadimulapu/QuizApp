import React, { useState, useEffect } from 'react';
import './App.css';
import { Question, UserAnswers, QuizSubmission } from './types/quiz';
import { fetchQuestions, submitQuiz } from './services/api';
import StartScreen from './components/StartScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';

type AppState = 'start' | 'quiz' | 'results';

function App() {
  const [appState, setAppState] = useState<AppState>('start');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [results, setResults] = useState<QuizSubmission | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedQuestions = await fetchQuestions();
      setQuestions(fetchedQuestions);
      setUserAnswers({});
      setAppState('quiz');
    } catch (err) {
      setError('Failed to load quiz. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      const submissionResults = await submitQuiz(userAnswers);
      setResults(submissionResults);
      setAppState('results');
    } catch (err) {
      setError('Failed to submit quiz. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const restartQuiz = () => {
    setAppState('start');
    setQuestions([]);
    setUserAnswers({});
    setResults(null);
    setError(null);
  };

  return (
    <div className="App">
      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {appState === 'start' && (
        <StartScreen onStart={startQuiz} loading={loading} />
      )}

      {appState === 'quiz' && (
        <QuizScreen
          questions={questions}
          userAnswers={userAnswers}
          setUserAnswers={setUserAnswers}
          onSubmit={handleSubmitQuiz}
          loading={loading}
        />
      )}

      {appState === 'results' && results && (
        <ResultsScreen
          results={results}
          questions={questions}
          userAnswers={userAnswers}
          onRestart={restartQuiz}
        />
      )}
    </div>
  );
}

export default App;
