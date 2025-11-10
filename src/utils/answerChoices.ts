/**
 * Answer choice generation for Practice mode multiple choice quiz
 * Ported from Android PracticeActivity.buttonQuestion()
 */

/**
 * Generates four answer choices for a multiple choice quiz
 * @param correctDigit - The correct digit (0-9)
 * @returns Object with choices array and correctIndex
 */
export function generateAnswerChoices(correctDigit: number): {
  choices: number[];
  correctIndex: number;
} {
  // Random position for correct answer (0-3)
  const correctIndex = Math.floor(Math.random() * 4);

  const choices: number[] = new Array(4).fill(-1);
  choices[correctIndex] = correctDigit;

  // Fill remaining positions with unique incorrect digits
  for (let i = 0; i < 4; i++) {
    if (i === correctIndex) continue;

    let incorrectDigit = Math.floor(Math.random() * 10);

    // Ensure uniqueness - no duplicates allowed
    while (choices.includes(incorrectDigit)) {
      incorrectDigit = Math.floor(Math.random() * 10);
    }

    choices[i] = incorrectDigit;
  }

  return { choices, correctIndex };
}

/**
 * Extracts a digit from a number at a specific position (right-to-left)
 * Position 0 is the rightmost digit (ones place)
 * @param number - The number to extract from
 * @param position - Position from right (0 = rightmost)
 * @returns The digit at that position, or 0 if position is out of bounds
 */
export function getDigitAtPosition(number: number, position: number): number {
  const str = Math.abs(number).toString();
  const index = str.length - 1 - position;

  if (index < 0) return 0;

  return parseInt(str[index], 10);
}

/**
 * Extracts all digits from a number as an array (right-to-left)
 * @param number - The number to extract from
 * @returns Array of digits from right to left
 */
export function getDigitsArray(number: number): number[] {
  const str = Math.abs(number).toString();
  const digits: number[] = [];

  for (let i = str.length - 1; i >= 0; i--) {
    digits.push(parseInt(str[i], 10));
  }

  return digits;
}
