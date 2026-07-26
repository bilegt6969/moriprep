export interface Graphic {
  type?: string;
  chart_title?: string;
  x_axis_title?: string;
  y_axis_title?: string;
  x_axis_ticks?: string[];
  y_axis_ticks?: string[];
  legend?: Array<{
    label: string;
    color_rgb: number[];
  }>;
  page?: number;
  raw_text?: string;
  image_path?: string;
  table_title?: string;
  headers?: string[];
  rows?: string[][];
}

export interface DSATQuestion {
  question_id: string;
  assessment: string;
  test: string;
  domain: string;
  skill: string;
  difficulty: string;
  passage: string;
  prompt: string;
  question: string;
  choices: {
    [key: string]: string;
  };
  correct_answer: string;
  correct_answer_text: string;
  rationale: string;
  parse_status: string;
  source_file: string;
  source_page?: number;
  has_graphic: boolean;
  graphics: Graphic[];
  has_underline: boolean;
  underlined_text?: string;
  raw_text: string;
}

export interface Attempt {
  answer: string;
  isCorrect: boolean;
  timeSpent: number;
  attemptedAt: Date;
}

export interface UserProgress {
  userId: string;
  questionId: string;
  attempts: Attempt[];
  lastAttemptedAt: Date;
}

export interface UserStats {
  userId: string;
  totalQuestions: number;
  correctAnswers: number;
  averageTime: number;
  weakDomains: string[];
  strongDomains: string[];
  lastUpdated: Date;
}

export interface PracticeSession {
  sessionId: string;
  userId: string;
  questions: string[];
  answers: { [questionId: string]: string };
  startTime: Date;
  endTime?: Date;
  score?: number;
}
