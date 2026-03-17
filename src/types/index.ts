// Common types used across the app

export interface TutorialStep {
  id: number;
  explanation: string;
  answer: string;
  bottomArrow: string;
}

export interface PracticeProblem {
  firstNumber: number;
  secondNumber: number;
  answer: number;
}

export interface AnswerChoice {
  value: number;
  isCorrect: boolean;
}
