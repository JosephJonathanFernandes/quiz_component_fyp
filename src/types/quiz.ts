export interface Category {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface Question {
  id: string;
  category_id: string;
  question_text: string;
  media_url?: string;
  media_type?: 'image' | 'video';
  correct_answer: string;
  created_at: string;
  answer_options?: AnswerOption[];
}

export interface AnswerOption {
  id: string;
  question_id: string;
  option_text: string;
  media_url?: string;
  media_type?: 'image' | 'video';
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  question_id: string;
  selected_answer: string;
  is_correct: boolean;
  completed_at: string;
}

export interface QuizSession {
  questions: Question[];
  currentQuestionIndex: number;
  answers: { [questionId: string]: string };
  score: number;
  completed: boolean;
}