import { generateAnswerChoices, getDigitAtPosition, getDigitsArray } from '../../src/utils/answerChoices';

describe('answerChoices', () => {
  describe('generateAnswerChoices', () => {
    test('generates 4 unique choices', () => {
      const { choices, correctIndex } = generateAnswerChoices(5);

      expect(choices.length).toBe(4);
      expect(new Set(choices).size).toBe(4); // All unique
      expect(choices[correctIndex]).toBe(5);
    });

    test('all choices are valid digits (0-9)', () => {
      for (let digit = 0; digit <= 9; digit++) {
        const { choices } = generateAnswerChoices(digit);

        choices.forEach(choice => {
          expect(choice).toBeGreaterThanOrEqual(0);
          expect(choice).toBeLessThanOrEqual(9);
        });
      }
    });

    test('correct answer is placed at specified index', () => {
      for (let i = 0; i < 20; i++) {
        const { choices, correctIndex } = generateAnswerChoices(7);
        expect(choices[correctIndex]).toBe(7);
      }
    });

    test('places correct answer at random positions', () => {
      const positions = new Set<number>();

      for (let i = 0; i < 50; i++) {
        const { correctIndex } = generateAnswerChoices(3);
        positions.add(correctIndex);
      }

      // Should use multiple different positions (very likely with 50 iterations)
      expect(positions.size).toBeGreaterThan(1);
    });

    test('incorrect choices are different from correct answer', () => {
      for (let correctDigit = 0; correctDigit <= 9; correctDigit++) {
        const { choices, correctIndex } = generateAnswerChoices(correctDigit);

        choices.forEach((choice, index) => {
          if (index !== correctIndex) {
            expect(choice).not.toBe(correctDigit);
          }
        });
      }
    });

    test('handles edge case digit 0', () => {
      const { choices, correctIndex } = generateAnswerChoices(0);

      expect(choices[correctIndex]).toBe(0);
      expect(new Set(choices).size).toBe(4);
    });

    test('handles edge case digit 9', () => {
      const { choices, correctIndex } = generateAnswerChoices(9);

      expect(choices[correctIndex]).toBe(9);
      expect(new Set(choices).size).toBe(4);
    });

    test('no duplicates in multiple generations', () => {
      for (let i = 0; i < 100; i++) {
        const { choices } = generateAnswerChoices(Math.floor(Math.random() * 10));

        const uniqueChoices = new Set(choices);
        expect(uniqueChoices.size).toBe(4);
      }
    });
  });

  describe('getDigitAtPosition', () => {
    test('extracts digits from right to left', () => {
      expect(getDigitAtPosition(12345, 0)).toBe(5); // Rightmost
      expect(getDigitAtPosition(12345, 1)).toBe(4);
      expect(getDigitAtPosition(12345, 2)).toBe(3);
      expect(getDigitAtPosition(12345, 3)).toBe(2);
      expect(getDigitAtPosition(12345, 4)).toBe(1); // Leftmost
    });

    test('returns 0 for out-of-bounds positions', () => {
      expect(getDigitAtPosition(123, 5)).toBe(0);
      expect(getDigitAtPosition(5, 2)).toBe(0);
    });

    test('handles single-digit numbers', () => {
      expect(getDigitAtPosition(7, 0)).toBe(7);
      expect(getDigitAtPosition(7, 1)).toBe(0);
    });

    test('handles large numbers', () => {
      const largeNumber = 9876543;
      expect(getDigitAtPosition(largeNumber, 0)).toBe(3);
      expect(getDigitAtPosition(largeNumber, 6)).toBe(9);
    });

    test('handles negative numbers (uses absolute value)', () => {
      expect(getDigitAtPosition(-12345, 0)).toBe(5);
      expect(getDigitAtPosition(-12345, 4)).toBe(1);
    });

    test('handles zero', () => {
      expect(getDigitAtPosition(0, 0)).toBe(0);
      expect(getDigitAtPosition(0, 1)).toBe(0);
    });
  });

  describe('getDigitsArray', () => {
    test('extracts all digits in reverse order', () => {
      expect(getDigitsArray(12345)).toEqual([5, 4, 3, 2, 1]);
    });

    test('handles single-digit numbers', () => {
      expect(getDigitsArray(7)).toEqual([7]);
    });

    test('handles zero', () => {
      expect(getDigitsArray(0)).toEqual([0]);
    });

    test('handles large numbers', () => {
      expect(getDigitsArray(987654321)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test('handles negative numbers (uses absolute value)', () => {
      expect(getDigitsArray(-456)).toEqual([6, 5, 4]);
    });
  });
});
