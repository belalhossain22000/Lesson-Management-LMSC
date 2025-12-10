export type TLesson = {
  id: string;
  name: string;
  email: string;
};

export interface QuizAnswerPayload {
  [questionId: string]: string; // e.g. { "q1": "A", "q2": "C" }
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}