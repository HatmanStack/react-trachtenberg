/**
 * Answer choice generation for Practice mode multiple choice quiz
 * Ported from Android PracticeActivity.buttonQuestion()
 */

/**
 * Generates four answer choices for a multiple choice quiz
 * Uses Fisher-Yates selection to guarantee unique choices in O(1)
 * @param correctDigit - The correct digit (0-9)
 * @returns Object with choices tuple and correctIndex
 */
export function generateAnswerChoices(correctDigit: number): {
  choices: readonly [number, number, number, number];
  correctIndex: number;
} {
  // Random position for correct answer (0-3)
  const correctIndex = Math.floor(Math.random() * 4);

  // Build pool of digits 0-9 excluding the correct digit
  const pool = Array.from({ length: 10 }, (_, i) => i).filter(
    (d) => d !== correctDigit
  );

  // Fisher-Yates partial shuffle: select 3 unique elements from pool
  for (let i = pool.length - 1; i > pool.length - 4; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j]!, pool[i]!];
  }
  const selected = pool.slice(pool.length - 3);

  // Place correct digit at correctIndex, fill rest with selected
  const choices: number[] = new Array(4).fill(-1);
  choices[correctIndex] = correctDigit;
  let selectedIdx = 0;
  for (let i = 0; i < 4; i++) {
    if (i === correctIndex) continue;
    choices[i] = selected[selectedIdx]!;
    selectedIdx++;
  }

  return { choices: choices as [number, number, number, number], correctIndex };
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

  const char = str[index];
  if (char === undefined) return 0;

  return parseInt(char, 10);
}
