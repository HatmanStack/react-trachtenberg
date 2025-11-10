import { getTutorialHighlightIndices } from '../../src/utils/tutorialHighlighter';
import { TUTORIAL_EQUATION } from '../../src/data/tutorialContent';

describe('tutorialHighlighter', () => {
  // TUTORIAL_EQUATION is "123456 × 789"
  // Indices:             0123456789...

  describe('getTutorialHighlightIndices', () => {
    test('parses "9 x 6" format correctly', () => {
      // From step 2: "The units digit of 9 x 6 = 54 -> 4"
      const answerText = "The units digit of 9 x 6 = 54 -> 4\n\nThe first digit in our answer is 4";
      const indices = getTutorialHighlightIndices(answerText);

      // Should highlight '9' and '6' in "123456 × 789"
      expect(indices).toContain(TUTORIAL_EQUATION.indexOf('9')); // Index 8
      expect(indices).toContain(TUTORIAL_EQUATION.indexOf('6')); // Index 5
    });

    test('parses "9 x 5" format correctly', () => {
      // From step 3: "The units digit of 9 x 5 = 45 -> 5"
      const answerText = "The units digit of 9 x 5 = 45 -> 5\n\n5";
      const indices = getTutorialHighlightIndices(answerText);

      // Should highlight '9' and '5'
      expect(indices).toContain(TUTORIAL_EQUATION.indexOf('9'));
      expect(indices).toContain(TUTORIAL_EQUATION.indexOf('5'));
    });

    test('parses "8 x 6" format correctly', () => {
      // From step 5
      const answerText = "The units digit of 8 x 6 = 48 -> 8\n\n5 + 5 + 8 = 18\nThe second Digit is 8\nWe carry the 1 to the next digit";
      const indices = getTutorialHighlightIndices(answerText);

      // Should highlight '8' and '6'
      expect(indices).toContain(TUTORIAL_EQUATION.indexOf('8'));
      expect(indices).toContain(TUTORIAL_EQUATION.indexOf('6'));
    });

    test('parses "7 x 6" format correctly', () => {
      // From step 10
      const answerText = "The units digit of 7 x 6 = 42 -> 2\n\n1 + 6 + 4 + 0 + 4 + 2 = 17\n\nThe third digit in the answer is 7\nCarry 1 to the next digit";
      const indices = getTutorialHighlightIndices(answerText);

      // Should highlight '7' and '6'
      expect(indices).toContain(TUTORIAL_EQUATION.indexOf('7'));
      expect(indices).toContain(TUTORIAL_EQUATION.indexOf('6'));
    });

    test('returns empty array for empty string', () => {
      expect(getTutorialHighlightIndices("")).toEqual([]);
    });

    test('returns empty array for text without " of "', () => {
      expect(getTutorialHighlightIndices("Some random text")).toEqual([]);
    });

    test('returns empty array for malformed text', () => {
      expect(getTutorialHighlightIndices("text of X")).toEqual([]);
    });

    test('handles first two steps (no highlighting)', () => {
      // Steps 0 and 1 have empty answer text
      expect(getTutorialHighlightIndices("")).toEqual([]);
    });
  });
});
