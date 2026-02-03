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

// Branded types for type safety
declare const __brand: unique symbol;
type Brand<T, B> = T & { [__brand]: B };

/** A single digit (0-9) */
export type Digit = Brand<number, 'Digit'>;

/** Answer position index (0-6, right to left) */
export type IndexPosition = Brand<number, 'IndexPosition'>;

/** Move number for hint system (0-32) */
export type MoveNumber = Brand<number, 'MoveNumber'>;

/** Button index for answer choices (0-3) */
export type ButtonIndex = Brand<number, 'ButtonIndex'>;

// Type guards
export function isDigit(value: number): value is Digit {
  return Number.isInteger(value) && value >= 0 && value <= 9;
}

export function isIndexPosition(value: number): value is IndexPosition {
  return Number.isInteger(value) && value >= 0 && value <= 6;
}

export function isMoveNumber(value: number): value is MoveNumber {
  return Number.isInteger(value) && value >= 0 && value <= 32;
}

export function isButtonIndex(value: number): value is ButtonIndex {
  return Number.isInteger(value) && value >= 0 && value <= 3;
}

// Factory functions for creating branded types with validation
export function asDigit(value: number): Digit {
  if (!isDigit(value)) {
    throw new Error(`Invalid digit: ${value}. Must be 0-9.`);
  }
  return value as Digit;
}

export function asIndexPosition(value: number): IndexPosition {
  if (!isIndexPosition(value)) {
    throw new Error(`Invalid index position: ${value}. Must be 0-6.`);
  }
  return value as IndexPosition;
}

export function asMoveNumber(value: number): MoveNumber {
  if (!isMoveNumber(value)) {
    throw new Error(`Invalid move number: ${value}. Must be 0-32.`);
  }
  return value as MoveNumber;
}

export function asButtonIndex(value: number): ButtonIndex {
  if (!isButtonIndex(value)) {
    throw new Error(`Invalid button index: ${value}. Must be 0-3.`);
  }
  return value as ButtonIndex;
}

// Discriminated union for validation outcomes (distinct from answerValidator.ts ValidationResult)
export type ValidationOutcome =
  | { success: true; isComplete: boolean; newIndexCount: number; newAnswerProgress: string; newRemainder: number }
  | { success: false; error: string };

// Tuple type for answer choices (always exactly 4 choices)
export type AnswerChoicesTuple = readonly [number, number, number, number];
