# Quiz Assessment Platform

A modern, full-stack quiz application built with React and Node.js, featuring real-time assessment capabilities and comprehensive result analytics.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)

## Overview

This application provides a professional quiz assessment platform with a clean, minimalist interface. Users can take timed assessments, receive instant feedback, and review their answers with detailed explanations.

## Features

### Core Functionality
- ✓ **Multiple Choice Questions** - Navigate through questions with Previous/Next buttons
- ✓ **Timed Assessment** - 5-minute countdown timer with visual warnings
- ✓ **Instant Scoring** - Automatic score calculation upon submission
- ✓ **Answer Review** - Detailed review showing correct and incorrect answers
- ✓ **Persistent Storage** - SQLite database for question management

### Technical Features
- ✓ **RESTful API** - Clean separation of frontend and backend
- ✓ **Type Safety** - Full TypeScript implementation
- ✓ **Security** - Correct answers hidden from frontend
- ✓ **Testing** - Comprehensive backend test suite
- ✓ **Responsive Design** - Mobile-friendly interface

## Technology Stack

### Frontend
```
React 18.x          - UI framework
TypeScript 5.x      - Type-safe JavaScript
React Hooks         - State management
Fetch API           - HTTP client
CSS3                - Styling
```

### Backend
```
Node.js             - Runtime environment
Express 4.x         - Web framework
SQLite3             - Database
TypeScript 5.x      - Type safety
Jest                - Testing framework
```

## Project Structure

```
Verto/
│
├── backend/                    # Express API Server
│   ├── src/
│   │   ├── index.ts           # Server entry point
│   │   ├── models/
│   │   │   └── database.ts    # Database operations
│   │   ├── routes/
│   │   │   ├── quiz.ts        # Quiz API endpoints
│   │   │   └── quiz.test.ts   # API tests
│   │   └── scripts/
│   │       └── initDb.ts      # Database initialization
│   ├── package.json
│   ├── tsconfig.json
│   └── quiz.db                # SQLite database (generated)
│
└── frontend/                   # React Application
    ├── src/
    │   ├── App.tsx            # Main application component
    │   ├── App.css            # Application styles
    │   ├── components/
    │   │   ├── StartScreen.tsx
    │   │   ├── QuizScreen.tsx
    │   │   └── ResultsScreen.tsx
    │   ├── services/
    │   │   └── api.ts         # API service layer
    │   └── types/
    │       └── quiz.ts        # TypeScript interfaces
    ├── public/
    │   └── index.html
    └── package.json
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Initialize database with sample questions:
```bash
npm run init-db
```

4. Start development server:
```bash
npm run dev
```

Server will start at `http://localhost:3001`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm start
```

Application will open at `http://localhost:3000`

## API Documentation

### Endpoints

#### GET `/api/quiz/questions`
Fetch all quiz questions (without correct answers)

**Response:**
```json
{
  "questions": [
    {
      "id": 1,
      "question_text": "What is the capital of France?",
      "option_a": "London",
      "option_b": "Berlin",
      "option_c": "Paris",
      "option_d": "Madrid"
    }
  ]
}
```

#### POST `/api/quiz/submit`
Submit user answers and receive score

**Request:**
```json
{
  "answers": {
    "1": "C",
    "2": "B",
    "3": "A"
  }
}
```

**Response:**
```json
{
  "score": 67,
  "correctCount": 2,
  "totalQuestions": 3,
  "results": [
    {
      "questionId": 1,
      "userAnswer": "C",
      "correctAnswer": "C",
      "isCorrect": true
    }
  ]
}
```

#### GET `/health`
Health check endpoint

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-10-05T10:30:00.000Z"
}
```

## Database Schema

### Questions Table

| Column          | Type    | Description                      |
|-----------------|---------|----------------------------------|
| id              | INTEGER | Primary key (auto-increment)     |
| question_text   | TEXT    | Question content                 |
| option_a        | TEXT    | First option                     |
| option_b        | TEXT    | Second option                    |
| option_c        | TEXT    | Third option                     |
| option_d        | TEXT    | Fourth option                    |
| correct_option  | TEXT    | Correct answer (A, B, C, or D)   |

## Testing

### Run Backend Tests
```bash
cd backend
npm test
```

**Test Coverage:**
- API endpoint validation
- Score calculation logic
- Error handling
- Edge cases (all correct, all incorrect, mixed answers)

## Scripts

### Backend Scripts
```bash
npm run dev        # Start development server with ts-node
npm run build      # Compile TypeScript to JavaScript
npm start          # Run compiled JavaScript
npm run init-db    # Initialize database with sample questions
npm test           # Run test suite
```

### Frontend Scripts
```bash
npm start          # Start development server
npm run build      # Create production build
npm test           # Run tests
```

## Usage Guide

1. **Start the Application**
   - Ensure backend server is running on port 3001
   - Ensure frontend server is running on port 3000

2. **Begin Assessment**
   - Click "START QUIZ" button on the landing page

3. **Answer Questions**
   - Select one option per question
   - Use "Next" and "Previous" buttons to navigate
   - Timer shows remaining time (5 minutes total)

4. **Submit Assessment**
   - Click "SUBMIT" button on the last question
   - Cannot modify answers after submission

5. **Review Results**
   - View overall score percentage
   - Review each question with correct/incorrect indicators
   - See correct answers for missed questions
   - Click "RETAKE ASSESSMENT" to start over

## Configuration

### Backend Configuration
- **Port**: Default `3001` (can be changed via `PORT` environment variable)
- **Database**: `quiz.db` in backend root directory

### Frontend Configuration
- **API URL**: `http://localhost:3001/api` (configured in `services/api.ts`)
- **Timer Duration**: 5 minutes (300 seconds) (configured in `QuizScreen.tsx`)

## Development

### Adding New Questions

Edit `backend/src/scripts/initDb.ts`:

```typescript
const sampleQuestions = [
  {
    question_text: 'Your question here?',
    option_a: 'Option A',
    option_b: 'Option B',
    option_c: 'Option C',
    option_d: 'Option D',
    correct_option: 'C', // A, B, C, or D
  },
  // Add more questions...
];
```

Then run:
```bash
npm run init-db
```

### Modifying Timer Duration

Edit `frontend/src/components/QuizScreen.tsx`:
```typescript
const QUIZ_DURATION = 300; // Change to desired seconds
```

## Security Features

- Correct answers are never sent to the frontend
- All scoring calculations happen server-side
- Input validation on API endpoints
- SQL injection prevention through parameterized queries

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)


## Author

Built with ❤️ for Verto Assessment

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Note**: This is a demonstration project for assessment purposes.
