/**
 * Tutorial highlighting utilities
 * Ported from Android LearnActivity.setAccentColor()
 */

import { TUTORIAL_EQUATION } from '../data/tutorialContent';

/**
 * Extracts highlight indices from tutorial answer text
 * Parses format: "... of X and Y" where X and Y are digits to highlight
 * Based on Android's setAccentColor() logic
 * @param answerText - The answer text from tutorial step
 * @returns Array of character indices to highlight in the equation
 */
export function getTutorialHighlightIndices(answerText: string): number[] {
  if (!answerText || answerText === "" || !answerText.includes(" of ")) {
    return [];
  }

  try {
    // Split by " of " to get the part after it
    const parts = answerText.split(" of ");
    if (parts.length < 2) {
      return [];
    }

    const afterOf = parts[1];

    // Get first character after " of " (the first digit)
    if (afterOf.length < 1) {
      return [];
    }
    const firstChar = afterOf.substring(0, 1);

    // Get character at index 4 after " of " (after "X and " - the second digit)
    if (afterOf.length < 5) {
      return [];
    }
    const secondChar = afterOf.substring(4, 5);

    // Find indices of these characters in the equation
    const equation = TUTORIAL_EQUATION; // "123456 × 789"
    const indices: number[] = [];

    const firstIndex = equation.indexOf(firstChar);
    if (firstIndex !== -1) {
      indices.push(firstIndex);
    }

    const secondIndex = equation.indexOf(secondChar);
    if (secondIndex !== -1) {
      indices.push(secondIndex);
    }

    return indices;
  } catch (error) {
    // Return empty array on any parsing error
    return [];
  }
}
