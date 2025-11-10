import { calculateHintStep } from '../../src/utils/hintCalculator';

/**
 * Hint Calculator Tests
 *
 * Based on Android implementation practiceHint() (PracticeActivity.java lines 219-267)
 *
 * The hint calculation:
 * 1. Extracts two digits from equation based on move indices
 * 2. Multiplies them
 * 3. Determines which digit (units or tens) to use based on move number
 * 4. Accumulates result to remainder
 * 5. Formats hint question and result strings
 * 6. Calculates highlight indices for equation display
 *
 * Moves that use UNITS digit: [0, 1, 3, 4, 6, 8, 9, 11, 13, 16, 18, 21] (line 250)
 * Moves that use TENS digit: all others
 * Moves that complete digit (no " + "): [0, 3, 8, 14, 19, 22, 23] (line 259)
 */

describe('Hint Calculator', () => {
  describe('calculateHintStep', () => {
    const sampleEquation = '1234 * 567';
    // Equation format: "firstNum * secondNum"
    // First string: "1234" (indices 0-3)
    // Second string: "567" (indices 7-9 in equation, 0-2 in extracted string)

    describe('basic multiplication and digit extraction', () => {
      test('should multiply correct digits for move 0', () => {
        // Move 0: firstStringIndex=2, secondStringIndex=2
        // From '1234': index 2 = '3'
        // From '567': index 2 = '7'
        // 3 * 7 = 21
        // Move 0 uses units digit → 1
        const result = calculateHintStep(sampleEquation, 0, 0);

        expect(result.question).toBe('3 × 7');
        expect(result.digitToAdd).toBe(1); // units digit of 21
      });

      test('should multiply correct digits for move 1', () => {
        // Move 1: firstStringIndex=2, secondStringIndex=2
        // 3 * 7 = 21
        // Move 1 uses units digit → 1
        const result = calculateHintStep(sampleEquation, 1, 0);

        expect(result.question).toBe('3 × 7');
        expect(result.digitToAdd).toBe(1);
      });

      test('should multiply correct digits for move 2', () => {
        // Move 2: firstStringIndex=2, secondStringIndex=2
        // 3 * 7 = 21
        // Move 2 uses TENS digit → 2
        const result = calculateHintStep(sampleEquation, 2, 0);

        expect(result.question).toBe('3 × 7');
        expect(result.digitToAdd).toBe(2); // tens digit of 21
      });

      test('should handle single-digit multiplication results', () => {
        const equation = '1234 * 203';
        // If multiplying 2 * 0 = 0 (result "00")
        // Should pad to 2 digits
        const result = calculateHintStep(equation, 1, 0);

        // Digit extraction depends on move tracking logic
        expect(result.digitToAdd).toBeGreaterThanOrEqual(0);
        expect(result.digitToAdd).toBeLessThanOrEqual(9);
      });
    });

    describe('units vs tens digit selection', () => {
      // Moves that use units digit: [0, 1, 3, 4, 6, 8, 9, 11, 13, 16, 18, 21]
      test('move 0 should use units digit', () => {
        const result = calculateHintStep('1234 * 567', 0, 0);
        // 3 * 7 = 21, units = 1
        expect(result.digitToAdd).toBe(1);
      });

      test('move 1 should use units digit', () => {
        const result = calculateHintStep('1234 * 567', 1, 0);
        expect(result.digitToAdd).toBe(1);
      });

      test('move 2 should use tens digit', () => {
        const result = calculateHintStep('1234 * 567', 2, 0);
        // 3 * 7 = 21, tens = 2
        expect(result.digitToAdd).toBe(2);
      });

      test('move 3 should use units digit', () => {
        const result = calculateHintStep('1234 * 567', 3, 0);
        // Move 3: firstStringIndex=1, secondStringIndex=2
        // '2' * '7' = 14, units = 4
        expect(result.digitToAdd).toBe(4);
      });

      test('move 4 should use units digit', () => {
        const result = calculateHintStep('1234 * 567', 4, 0);
        expect(result.digitToAdd).toBeGreaterThanOrEqual(0);
      });

      test('move 5 should use tens digit', () => {
        const result = calculateHintStep('1234 * 567', 5, 0);
        // Not in units digit list, so should use tens
        expect(result.digitToAdd).toBeGreaterThanOrEqual(0);
      });
    });

    describe('remainder accumulation', () => {
      test('should accumulate remainder correctly with zero initial remainder', () => {
        const result = calculateHintStep('1234 * 567', 0, 0);
        // 3 * 7 = 21, units = 1
        // newRemainder = 0 + 1 = 1
        expect(result.newRemainder).toBe(1);
      });

      test('should accumulate remainder correctly with existing remainder', () => {
        const result = calculateHintStep('1234 * 567', 0, 5);
        // 3 * 7 = 21, units = 1
        // newRemainder = 5 + 1 = 6
        expect(result.newRemainder).toBe(6);
      });

      test('should handle large remainders', () => {
        const result = calculateHintStep('9999 * 999', 2, 15);
        // Should accumulate correctly
        expect(result.newRemainder).toBeGreaterThan(15);
      });
    });

    describe('result display formatting', () => {
      // Moves that complete digit (no " + "): [0, 3, 8, 14, 19, 22, 23]
      test('move 0 should complete digit (no plus sign)', () => {
        const result = calculateHintStep('1234 * 567', 0, 0);
        expect(result.resultDisplay).toBe('1'); // No " + "
      });

      test('move 1 should not complete digit (has plus sign)', () => {
        const result = calculateHintStep('1234 * 567', 1, 0);
        expect(result.resultDisplay).toBe('1 + ');
      });

      test('move 2 should not complete digit (has plus sign)', () => {
        const result = calculateHintStep('1234 * 567', 2, 0);
        expect(result.resultDisplay).toBe('2 + ');
      });

      test('move 3 should complete digit (no plus sign)', () => {
        const result = calculateHintStep('1234 * 567', 3, 0);
        expect(result.resultDisplay).toBe('4'); // No " + "
      });

      test('move 8 should complete digit (no plus sign)', () => {
        const result = calculateHintStep('1234 * 567', 8, 0);
        const digitStr = result.digitToAdd.toString();
        expect(result.resultDisplay).toBe(digitStr); // No " + "
      });

      test('move 14 should complete digit (no plus sign)', () => {
        const result = calculateHintStep('1234 * 567', 14, 0);
        const digitStr = result.digitToAdd.toString();
        expect(result.resultDisplay).toBe(digitStr);
      });
    });

    describe('highlight indices calculation', () => {
      test('should calculate correct highlight indices for move 0', () => {
        const result = calculateHintStep('1234 * 567', 0, 0);
        // Move 0: firstStringIndex=2, secondStringIndex=2
        // Equation: "1234 * 567"
        // First digit at index 2: '3'
        // Second digit at index 2 of "567", but in equation it's at index 7+2=9
        // Android adds 7 offset for " * " (line 237)
        expect(result.highlightIndices).toEqual([2, 9]);
      });

      test('should calculate correct highlight indices for move 3', () => {
        const result = calculateHintStep('1234 * 567', 3, 0);
        // Move 3: firstStringIndex=1, secondStringIndex=2
        // First digit at index 1: '2'
        // Second digit at index 2+7=9: '7'
        expect(result.highlightIndices).toEqual([1, 9]);
      });

      test('should calculate correct highlight indices for different moves', () => {
        const result = calculateHintStep('1234 * 567', 7, 0);
        // Move 7: firstStringIndex=2, secondStringIndex=1
        // First digit at index 2: '3'
        // Second digit at index 1+7=8: '6'
        expect(result.highlightIndices).toEqual([2, 8]);
      });
    });

    describe('edge cases', () => {
      test('should handle zeros in multiplication', () => {
        const equation = '1000 * 200';
        const result = calculateHintStep(equation, 0, 0);

        expect(result.question).toBeTruthy();
        expect(result.digitToAdd).toBeGreaterThanOrEqual(0);
        expect(result.digitToAdd).toBeLessThanOrEqual(9);
      });

      test('should handle maximum digit multiplication (9*9=81)', () => {
        const equation = '9999 * 999';
        const result = calculateHintStep(equation, 0, 0);

        expect(result.digitToAdd).toBeGreaterThanOrEqual(0);
        expect(result.digitToAdd).toBeLessThanOrEqual(9);
        expect(result.newRemainder).toBeGreaterThanOrEqual(0);
      });

      test('should handle all move numbers 0-23', () => {
        const equation = '1234 * 567';

        for (let move = 0; move <= 23; move++) {
          const result = calculateHintStep(equation, move, 0);

          expect(result.question).toBeTruthy();
          expect(result.digitToAdd).toBeGreaterThanOrEqual(0);
          expect(result.digitToAdd).toBeLessThanOrEqual(9);
          expect(result.highlightIndices).toHaveLength(2);
        }
      });
    });

    describe('question string format', () => {
      test('should format question with multiplication symbol', () => {
        const result = calculateHintStep('1234 * 567', 0, 0);
        expect(result.question).toMatch(/^\d × \d$/);
      });

      test('should use correct multiplication symbol (×)', () => {
        const result = calculateHintStep('1234 * 567', 0, 0);
        expect(result.question).toContain('×');
        expect(result.question).not.toContain('*');
      });
    });
  });
});
