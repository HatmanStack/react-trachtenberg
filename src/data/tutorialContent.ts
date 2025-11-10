import { TutorialStep } from '../types';

// Tutorial content migrated from Android app's array.xml
// Hardcoded example: 123456 × 789
export const TUTORIAL_EQUATION = "123456 × 789";
export const TUTORIAL_STEP_COUNT = 18;

export const tutorialSteps: readonly TutorialStep[] = [
  {
    id: 0,
    explanation: "The Trachtenberg system is a system of rapid mental calculation. The system consists of a number of readily memorized operations that allow one to perform arithmetic computations very quickly. It was developed by the Russian Jewish engineer Jakow Trachtenberg in order to keep his mind occupied while being held in a Nazi concentration camp.  (Wikipedia)",
    answer: "",
    bottomArrow: ""
  },
  {
    id: 1,
    explanation: "It's implemented by the algorithm\n\na(digit at i) x b(digit at(n-i))\n\nStart by Multiplying the last digits",
    answer: "",
    bottomArrow: ""
  },
  {
    id: 2,
    explanation: "Find the Second Digit",
    answer: "The units digit of 9 x 6 = 54 -> 4\n\nThe first digit in our answer is 4",
    bottomArrow: "4"
  },
  {
    id: 3,
    explanation: "Find the Second Digit",
    answer: "The units digit of 9 x 5 = 45 -> 5\n\n5",
    bottomArrow: "4"
  },
  {
    id: 4,
    explanation: "Find the Second Digit",
    answer: "The tens digit of 9 x 6 = 54 -> 5\n\n5 + 5",
    bottomArrow: "4"
  },
  {
    id: 5,
    explanation: "Find the Second Digit",
    answer: "The units digit of 8 x 6 = 48 -> 8\n\n5 + 5 + 8 = 18\nThe second Digit is 8\nWe carry the 1 to the next digit",
    bottomArrow: "84"
  },
  {
    id: 6,
    explanation: "Find the Third Digit",
    answer: "The units digit of 9 x 4 = 36 -> 6 Plus\n\n1 + 6",
    bottomArrow: "84"
  },
  {
    id: 7,
    explanation: "Find the Third Digit",
    answer: "The tens digit of 9 x 5 = 45 -> 4 Plus\n\n1 + 6 + 4",
    bottomArrow: "84"
  },
  {
    id: 8,
    explanation: "Find the Third Digit",
    answer: "The units digit of 8 x 5 = 40 -> 0 Plus\n\n1 + 6 + 4 + 0",
    bottomArrow: "84"
  },
  {
    id: 9,
    explanation: "Find the Third Digit",
    answer: "The tens digit of 8 x 6 = 48 -> 4\n\n1 + 6 + 4 + 0 + 4",
    bottomArrow: "84"
  },
  {
    id: 10,
    explanation: "Find the Third Digit",
    answer: "The units digit of 7 x 6 = 42 -> 2\n\n1 + 6 + 4 + 0 + 4 + 2 = 17\n\nThe third digit in the answer is 7\nCarry 1 to the next digit",
    bottomArrow: "784"
  },
  {
    id: 11,
    explanation: "Find the Fourth Digit",
    answer: "The units digit of 9 × 3 = 27 -> 7 Plus\n\n1 + 7",
    bottomArrow: "784"
  },
  {
    id: 12,
    explanation: "Find the Fourth Digit",
    answer: "The tens digit of 9 x 4 = 36 -> 3 Plus\n\n1 + 7 + 3",
    bottomArrow: "784"
  },
  {
    id: 13,
    explanation: "Find the Fourth Digit",
    answer: "The units digit of 8 x 4 = 32 -> 2 Plus\n\n1 + 7 + 3 + 2",
    bottomArrow: "784"
  },
  {
    id: 14,
    explanation: "Find the Fourth Digit",
    answer: "The tens digit of 8 x 5 = 40 -> 4 Plus\n\n1 + 7 + 3 + 2 + 4",
    bottomArrow: "784"
  },
  {
    id: 15,
    explanation: "Find the Fourth Digit",
    answer: "The units digit of 7 x 5 = 35 -> 5\n\n1 + 7 + 3 + 2 + 4 + 5",
    bottomArrow: "784"
  },
  {
    id: 16,
    explanation: "Find the Fourth Digit",
    answer: "The tens digit of 7 x 6 = 42 -> 4\n\n1 + 7 + 3 + 2 + 4 + 5 + 4 = 26\n\nThe fourth digit is 6\nCarry the two forward to the next digits",
    bottomArrow: "6784"
  },
  {
    id: 17,
    explanation: "Continue this to find the last Four digits of the Answer \n\nClick Next Practice",
    answer: "",
    bottomArrow: "6784"
  }
] as const;
