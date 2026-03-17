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
 * @returns Validation result with next state
 */
export function validateAnswer(
  selectedIndex: number,
  correctIndex: number,
  currentAnswer: string,
  indexCount: number
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
      newRemainder: 0,
    };
  }

  // Correct answer - advance to next digit
  const newIndexCount = indexCount + 1;
  const isComplete = newIndexCount >= currentAnswer.length;

  // Extract partial answer for display (right-to-left)
  const newAnswerProgress = currentAnswer.substring(
    currentAnswer.length - newIndexCount
  );

  return {
    isCorrect: true,
    isComplete,
    newIndexCount,
    newAnswerProgress,
    newRemainder: 0,
  };
}
