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

import { getDigitIndices, getMoveRange } from './hintMoveTracker';

/**
 * Moves that complete a digit (no " + " suffix in result display)
 * These are the last move of each digit: moveCount - 1
 */
const COMPLETE_DIGIT_MOVES = [0, 3, 8, 14, 20, 26, 32];

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
 * @param indexCount - Current digit position being calculated (0-6, right to left)
 * @returns Hint step information
 */
export function calculateHintStep(
  equation: string,
  move: number,
  currentRemainder: number,
  indexCount: number
): HintStepResult {
  // 1. Split equation into first and second numbers (Android lines 221-222)
  // Equation format: "firstNum × secondNum" (using U+00D7 multiplication sign)
  const parts = equation.split(' × ');
  let firstString = parts[0];
  const secondString = parts[1];

  // Pad first number internally for calculations
  // Need to pad to at least (indexCount + 1) digits to access position indexCount
  const originalLength = firstString.length;
  const minLength = indexCount + 1;
  if (originalLength < minLength) {
    firstString = firstString.padStart(minLength, '0');
  }

  // 2. Get digit indices for this move based on current indexCount
  const { firstStringIndex, secondStringIndex } = getDigitIndices(move, indexCount);

  // Calculate local move within this digit (for determining units vs tens)
  const { startMove } = getMoveRange(indexCount);
  const localMove = move - startMove;

  // 3. Extract the two digits (Android lines 225-226)
  // NOTE: Indices are from the RIGHT (0 = rightmost)
  // Padding ensures all positions exist, no bounds checking needed
  const firstActualIndex = firstString.length - 1 - firstStringIndex;
  const secondActualIndex = secondString.length - 1 - secondStringIndex;

  const firstChar = firstString[firstActualIndex];
  const secondChar = secondString[secondActualIndex];

  // 4. Create question string (Android line 229)
  // Use × symbol instead of *
  const question = `${firstChar} × ${secondChar}`;

  // 5. Calculate multiplication result (Android line 245)
  const firstDigit = parseInt(firstChar, 10);
  const secondDigit = parseInt(secondChar, 10);
  const product = firstDigit * secondDigit;

  // 6. Pad result to 2 digits (Android lines 246-248)
  const productString = product.toString().padStart(2, '0');

  // 7. Determine which digit to use based on localMove
  // Pattern: even localMove (0,2,4,...) uses units digit, odd (1,3,5,...) uses tens
  const useUnits = localMove % 2 === 0;
  const digitToAdd = parseInt(
    useUnits ? productString[1] : productString[0],
    10
  );

  // 8. Update remainder (Android line 255)
  // Handle NaN by treating as 0
  const safeCurrentRemainder = isNaN(currentRemainder) ? 0 : currentRemainder;
  const safeDigitToAdd = isNaN(digitToAdd) ? 0 : digitToAdd;
  const newRemainder = safeCurrentRemainder + safeDigitToAdd;

  // 9. Format result display (Android lines 258-261)
  const isComplete = COMPLETE_DIGIT_MOVES.includes(move);
  const resultDisplay = safeDigitToAdd + (isComplete ? '' : ' + ');

  // 10. Calculate highlight indices (Android lines 234-238)
  // Convert right-based indices to left-based string positions for highlighting
  // Note: Internal padding and displayed padding are the same length
  // Both pad to support accessing position indexCount
  const highlightIndices = [
    firstActualIndex,
    secondActualIndex + firstString.length + 3, // +3 for " × "
  ];

  return {
    question,
    digitToAdd: safeDigitToAdd,
    newRemainder,
    resultDisplay,
    highlightIndices,
  };
}
