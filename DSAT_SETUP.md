# DSAT Prep Website - Setup Guide

## Overview
Free DSAT prep website using Firebase Firestore (generous free tier) for 3-4k questions with user authentication and progress tracking.

## Features Implemented
- **Question Browser** (`/dsat`) - Filter by difficulty, domain, skill
- **Practice Mode** (`/dsat/practice`) - Timed 30-minute sessions with 20 questions
- **Dashboard** (`/dsat/dashboard`) - Progress analytics, weak/strong areas, recent activity
- **User Progress Tracking** - Saves answers, timing, and accuracy to Firebase
- **Authentication** - Uses existing Firebase Auth setup

## Setup Instructions

### 1. Firebase Configuration
Ensure your Firebase project has Firestore enabled:
- Go to Firebase Console → Build → Firestore Database
- Create database (choose production mode or test mode)
- Enable Firestore

### 2. Environment Variables
Add these to your `.env.local` file (already configured in your project):
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Import Questions
Place your JSON questions file in the project root as `questions.json`, then run:

```bash
# Install ts-node if not already installed
npm install -g ts-node

# Run the import script
ts-node scripts/import-questions.ts
```

This will batch import all questions to Firestore (500 at a time).

### 4. Access the Application
- **Practice Mode**: `/dsat` - Browse and practice questions with filters
- **Timed Practice**: `/dsat/practice` - 30-minute timed sessions
- **Dashboard**: `/dsat/dashboard` - View your progress and analytics

## Cost Analysis (Firebase Free Tier)
- **50K reads/day** - Enough for browsing questions
- **20K writes/day** - Sufficient for user progress tracking
- **1GB storage** - Plenty for 3-4k questions
- **Real-time sync** - Progress updates across devices
- **No credit card required** for testing

## Database Structure

### Questions Collection
```javascript
{
  question_id: string,
  assessment: string,
  test: string,
  domain: string,
  skill: string,
  difficulty: string,
  question: string,
  choices: { A: string, B: string, ... },
  correct_answer: string,
  correct_answer_text: string,
  rationale: string,
  // ... other fields from your JSON
}
```

### UserProgress Collection
```javascript
{
  userId: string,
  questionId: string,
  answer: string,
  isCorrect: boolean,
  timeSpent: number,
  attemptedAt: timestamp
}
```

### UserStats Collection
```javascript
{
  userId: string,
  totalQuestions: number,
  correctAnswers: number,
  averageTime: number,
  weakDomains: string[],
  strongDomains: string[],
  lastUpdated: timestamp
}
```

## Next Steps
1. Add navigation links to your existing navbar
2. Customize the UI to match your existing design
3. Add more analytics features (charts, graphs)
4. Implement spaced repetition for incorrect answers
5. Add question bookmarking feature

## Files Created
- `types/dsat.ts` - TypeScript interfaces
- `lib/dsat/questions.ts` - Firestore helper functions
- `scripts/import-questions.ts` - Data migration script
- `app/(dsat)/page.tsx` - Main practice page
- `app/(dsat)/practice/page.tsx` - Timed practice mode
- `app/(dsat)/dashboard/page.tsx` - Progress dashboard
- `lib/firebase.js` - Updated with Firestore export
