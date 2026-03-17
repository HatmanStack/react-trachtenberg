/**
 * Answer validation logic for Practice mode
 * Ported from Android PracticeActivity.pickAnswer()
 */

export interface ValidationResult {
  isCorrect: boolean;
  isComplete: boolean;
  newIndexCount: number;
  newAnswerProgress: string;
  newRemainder: number;
}

/**
 * Validates a user's answer for the current digit
 * Handles progressive answer building (right-to-left)
 *
 * @param selectedIndex - Index of button pressed (0-3)
 * @param correctIndex - Index of correct answer (0-3)
 * @param currentAnswer - Full answer string
 * @param indexCount - Current digit position (0 = rightmost)
 * @param currentRemainder - Carry from previous digit
 * @returns Validation result with next state
 */
export function validateAnswer(
  selectedIndex: number,
  correctIndex: number,
  currentAnswer: string,
  indexCount: number,
  currentRemainder: number
): ValidationResult {
  const isCorrect = selectedIndex === correctIndex;

  if (!isCorrect) {
    // Wrong answer - no progression
    return {
      isCorrect: false,
      isComplete: false,
      newIndexCount: indexCount,
      newAnswerProgress: currentAnswer.substring(
        currentAnswer.length - indexCount
      ),
      newRemainder: currentRemainder,
    };
  }

  // Correct answer - advance to next digit
  const newIndexCount = indexCount + 1;
  const isComplete = newIndexCount >= currentAnswer.length;

  // Extract partial answer for display (right-to-left)
  const newAnswerProgress = currentAnswer.substring(
    currentAnswer.length - newIndexCount
  );

  // The carry value for the next digit is computed by the store via
  // Math.floor(state.remainderHint / 10) in appStore.ts, not here.
  // The store overwrites this field with the hint system's carry value.
  // This is an intentional design choice — see ADR-4 in Phase-0.md.
  const newRemainder = 0;

  return {
    isCorrect: true,
    isComplete,
    newIndexCount,
    newAnswerProgress,
    newRemainder,
  };
}
