import React from 'react';

interface StartScreenProps {
  onStart: () => void;
  loading: boolean;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, loading }) => {
  return (
    <div className="start-screen">
      <h1>Knowledge Assessment</h1>
      <p>You'll have 5 minutes to answer 10 questions.</p>
      <button className="start-button" onClick={onStart} disabled={loading}>
        {loading ? 'Loading Questions...' : 'Start Quiz'}
      </button>
    </div>
  );
};

export default StartScreen;
