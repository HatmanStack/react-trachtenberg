import { validateAnswer } from '../../src/utils/answerValidator';

describe('answerValidator', () => {
  describe('validateAnswer', () => {
    test('returns isCorrect true when selected index matches correct index', () => {
      const result = validateAnswer(2, 2, '12345', 0, 0);
      expect(result.isCorrect).toBe(true);
    });

    test('returns isCorrect false when selected index differs from correct index', () => {
      const result = validateAnswer(1, 2, '12345', 0, 0);
      expect(result.isCorrect).toBe(false);
    });

    test('does not progress when answer is incorrect', () => {
      const result = validateAnswer(0, 1, '12345', 2, 0);

      expect(result.isCorrect).toBe(false);
      expect(result.newIndexCount).toBe(2); // Same as input
      expect(result.isComplete).toBe(false);
    });

    test('builds answer progressively from right to left', () => {
      // First digit (rightmost)
      let result = validateAnswer(0, 0, '12345', 0, 0);
      expect(result.newAnswerProgress).toBe('5');
      expect(result.newIndexCount).toBe(1);
      expect(result.isComplete).toBe(false);

      // Second digit
      result = validateAnswer(0, 0, '12345', 1, 0);
      expect(result.newAnswerProgress).toBe('45');
      expect(result.newIndexCount).toBe(2);
      expect(result.isComplete).toBe(false);

      // Third digit
      result = validateAnswer(0, 0, '12345', 2, 0);
      expect(result.newAnswerProgress).toBe('345');
      expect(result.newIndexCount).toBe(3);
      expect(result.isComplete).toBe(false);

      // Fourth digit
      result = validateAnswer(0, 0, '12345', 3, 0);
      expect(result.newAnswerProgress).toBe('2345');
      expect(result.newIndexCount).toBe(4);
      expect(result.isComplete).toBe(false);

      // Fifth digit (complete)
      result = validateAnswer(0, 0, '12345', 4, 0);
      expect(result.newAnswerProgress).toBe('12345');
      expect(result.newIndexCount).toBe(5);
      expect(result.isComplete).toBe(true);
    });

    test('detects completion when all digits entered', () => {
      // 5-digit answer, at index 4 (last digit)
      const result = validateAnswer(0, 0, '12345', 4, 0);
      expect(result.isComplete).toBe(true);
    });

    test('does not mark as complete when digits remain', () => {
      const result = validateAnswer(0, 0, '12345', 3, 0);
      expect(result.isComplete).toBe(false);
    });

    test('handles single-digit answers', () => {
      const result = validateAnswer(1, 1, '7', 0, 0);
      expect(result.isCorrect).toBe(true);
      expect(result.newAnswerProgress).toBe('7');
      expect(result.newIndexCount).toBe(1);
      expect(result.isComplete).toBe(true);
    });

    test('handles large answers (7 digits)', () => {
      const result = validateAnswer(2, 2, '9876543', 6, 0);
      expect(result.isCorrect).toBe(true);
      expect(result.newAnswerProgress).toBe('9876543');
      expect(result.newIndexCount).toBe(7);
      expect(result.isComplete).toBe(true);
    });

    test('maintains remainder value for incorrect answers', () => {
      const result = validateAnswer(0, 1, '12345', 2, 5);
      expect(result.newRemainder).toBe(5);
    });

    test('handles zero as first digit correctly', () => {
      const result = validateAnswer(0, 0, '10203', 0, 0);
      expect(result.isCorrect).toBe(true);
      expect(result.newAnswerProgress).toBe('3');
    });

    test('answer progress shows correct substring', () => {
      const answer = '987654321';

      // At index 0 (rightmost digit '1')
      let result = validateAnswer(0, 0, answer, 0, 0);
      expect(result.newAnswerProgress).toBe('1');

      // At index 2 (showing '321')
      result = validateAnswer(0, 0, answer, 2, 0);
      expect(result.newAnswerProgress).toBe('321');

      // At index 8 (complete answer)
      result = validateAnswer(0, 0, answer, 8, 0);
      expect(result.newAnswerProgress).toBe('987654321');
    });
  });
});
