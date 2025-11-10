/**
 * Hint Calculation Logic for Trachtenberg Hint System
 *
 * Ports the hint calculation logic from Android's PracticeActivity.java
 * - practiceHint() method (lines 219-267)
 *
 * The hint calculator determines:
 * 1. Which two digits to multiply based on move number
 * 2. Whether to use units or tens digit from the product
 * 3. How to format the hint display
 * 4. Which digits to highlight in the equation
 */

import { getDigitIndices } from './hintMoveTracker';

/**
 * Moves that should use the units digit from multiplication result
 * From Android line 250
 */
const UNITS_DIGIT_MOVES = [0, 1, 3, 4, 6, 8, 9, 11, 13, 16, 18, 21];

/**
 * Moves that complete a digit (no " + " suffix in result display)
 * From Android line 259
 */
const COMPLETE_DIGIT_MOVES = [0, 3, 8, 14, 19, 22, 23];

/**
 * Result type for calculateHintStep function
 */
export interface HintStepResult {
  question: string;           // e.g., "3 × 7"
  digitToAdd: number;         // The digit to add to remainder (0-9)
  newRemainder: number;       // Updated remainder after adding digitToAdd
  resultDisplay: string;      // e.g., "1 + " or "1"
  highlightIndices: number[]; // Indices to highlight in equation [fsIndex, ssIndex+offset]
}

/**
 * Calculates a single hint step for Trachtenberg multiplication
 * Ports Android's practiceHint() logic (lines 219-267)
 *
 * @param equation - The current equation string (e.g., "1234 * 567")
 * @param move - Current move number (0-23)
 * @param currentRemainder - Accumulated remainder from previous steps
 * @returns Hint step information
 */
export function calculateHintStep(
  equation: string,
  move: number,
  currentRemainder: number
): HintStepResult {
  // 1. Split equation into first and second numbers (Android lines 221-222)
  // Equation format: "firstNum × secondNum" (using U+00D7 multiplication sign)
  const parts = equation.split(' × ');
  const firstString = parts[0];
  const secondString = parts[1];

  // 2. Get digit indices for this move (uses setIndex logic)
  const { firstStringIndex, secondStringIndex } = getDigitIndices(move);

  // 3. Extract the two digits (Android lines 225-226)
  const firstChar = firstString[firstStringIndex];
  const secondChar = secondString[secondStringIndex];

  // 4. Create question string (Android line 229)
  // Use × symbol instead of *
  const question = `${firstChar} × ${secondChar}`;

  // 5. Calculate multiplication result (Android line 245)
  const firstDigit = parseInt(firstChar, 10);
  const secondDigit = parseInt(secondChar, 10);
  const product = firstDigit * secondDigit;

  // 6. Pad result to 2 digits (Android lines 246-248)
  const productString = product.toString().padStart(2, '0');

  // 7. Determine which digit to use (units or tens) (Android lines 250-254)
  const useUnits = UNITS_DIGIT_MOVES.includes(move);
  const digitToAdd = parseInt(
    useUnits ? productString[1] : productString[0],
    10
  );

  // 8. Update remainder (Android line 255)
  const newRemainder = currentRemainder + digitToAdd;

  // 9. Format result display (Android lines 258-261)
  const isComplete = COMPLETE_DIGIT_MOVES.includes(move);
  const resultDisplay = digitToAdd + (isComplete ? '' : ' + ');

  // 10. Calculate highlight indices (Android lines 234-238)
  // The second string index needs offset for " × " in equation
  // Android uses +7 offset because " * " is between the numbers in Android (7 chars for " * 567")
  // In Expo: "1234 × 567", if secondString[2] = '7', it's at equation index 7+2 = 9
  // Offset calculation: firstString.length (4) + " × " (3) = 7, then + secondStringIndex
  const highlightIndices = [
    firstStringIndex,
    secondStringIndex + firstString.length + 3, // +3 for " × " (space + × + space)
  ];

  return {
    question,
    digitToAdd,
    newRemainder,
    resultDisplay,
    highlightIndices,
  };
}
