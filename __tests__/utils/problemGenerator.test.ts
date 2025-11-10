import { generateProblem, formatEquation, isValidProblem } from '../../src/utils/problemGenerator';

describe('problemGenerator', () => {
  describe('generateProblem', () => {
    test('generates valid 4-digit × 3-digit problems', () => {
      for (let i = 0; i < 100; i++) {
        const problem = generateProblem();

        // First number should be 4 digits (1000-9999)
        expect(problem.firstNumber).toBeGreaterThanOrEqual(1000);
        expect(problem.firstNumber).toBeLessThan(10000);

        // Second number should be 3 digits (100-999)
        expect(problem.secondNumber).toBeGreaterThanOrEqual(100);
        expect(problem.secondNumber).toBeLessThan(1000);

        // Answer should be correct
        expect(problem.answer).toBe(problem.firstNumber * problem.secondNumber);
      }
    });

    test('generates different problems on subsequent calls', () => {
      const problem1 = generateProblem();
      const problem2 = generateProblem();

      // Very unlikely to be identical (1 in ~9 million chance)
      const areDifferent =
        problem1.firstNumber !== problem2.firstNumber ||
        problem1.secondNumber !== problem2.secondNumber;

      expect(areDifferent).toBe(true);
    });

    test('all generated problems are valid', () => {
      for (let i = 0; i < 50; i++) {
        const problem = generateProblem();
        expect(isValidProblem(problem)).toBe(true);
      }
    });
  });

  describe('formatEquation', () => {
    test('formats problem as equation string with × symbol', () => {
      const problem = {
        firstNumber: 1234,
        secondNumber: 567,
        answer: 699678
      };

      expect(formatEquation(problem)).toBe('1234 × 567');
    });

    test('handles maximum values', () => {
      const problem = {
        firstNumber: 9999,
        secondNumber: 999,
        answer: 9989001
      };

      expect(formatEquation(problem)).toBe('9999 × 999');
    });

    test('handles minimum values', () => {
      const problem = {
        firstNumber: 1000,
        secondNumber: 100,
        answer: 100000
      };

      expect(formatEquation(problem)).toBe('1000 × 100');
    });
  });

  describe('isValidProblem', () => {
    test('returns true for valid 4×3 digit problem', () => {
      const problem = {
        firstNumber: 5678,
        secondNumber: 234,
        answer: 5678 * 234
      };

      expect(isValidProblem(problem)).toBe(true);
    });

    test('returns false if first number is too small', () => {
      const problem = {
        firstNumber: 999,
        secondNumber: 234,
        answer: 999 * 234
      };

      expect(isValidProblem(problem)).toBe(false);
    });

    test('returns false if first number is too large', () => {
      const problem = {
        firstNumber: 10000,
        secondNumber: 234,
        answer: 10000 * 234
      };

      expect(isValidProblem(problem)).toBe(false);
    });

    test('returns false if second number is too small', () => {
      const problem = {
        firstNumber: 5678,
        secondNumber: 99,
        answer: 5678 * 99
      };

      expect(isValidProblem(problem)).toBe(false);
    });

    test('returns false if second number is too large', () => {
      const problem = {
        firstNumber: 5678,
        secondNumber: 1000,
        answer: 5678 * 1000
      };

      expect(isValidProblem(problem)).toBe(false);
    });

    test('returns false if answer is incorrect', () => {
      const problem = {
        firstNumber: 5678,
        secondNumber: 234,
        answer: 999999
      };

      expect(isValidProblem(problem)).toBe(false);
    });
  });
});
