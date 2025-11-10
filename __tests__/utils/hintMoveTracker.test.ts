import { getMoveRange, getDigitIndices } from '../../src/utils/hintMoveTracker';

/**
 * Move Tracking System Tests
 *
 * Based on Android implementation:
 * - movesCount array: [0, 4, 9, 15, 20, 23, 24] (PracticeActivity.java line 311)
 * - movesIndexes array: [2, 2, 2, 1, 2, 1, 0, 2, 1, 0, 1, 0, 0] (PracticeActivity.java line 281)
 *
 * The move tracking system maps:
 * - indexCount (digit position 0-6) -> move range for that digit
 * - move number (0-23) -> which digit indices to multiply
 */

describe('Move Tracking System', () => {
  describe('getMoveRange', () => {
    /**
     * Tests for getMoveRange function
     * Maps indexCount (digit position) to move number ranges
     * Based on movesCount array: [0, 4, 9, 15, 20, 23, 24]
     */

    test('indexCount 0 should return startMove 0, moveCount 0', () => {
      const result = getMoveRange(0);
      expect(result.startMove).toBe(0);
      expect(result.moveCount).toBe(0);
    });

    test('indexCount 1 should return startMove 1, moveCount 3', () => {
      // From Android: move ranges from movesCount[0]=0 to movesCount[1]=4
      // startMove should be 1 (movesCount[0] != 0 ? movesCount[0] : 1)
      // moveCount should be 3 (movesCount[1] - 1 = 4 - 1 = 3)
      const result = getMoveRange(1);
      expect(result.startMove).toBe(1);
      expect(result.moveCount).toBe(3);
    });

    test('indexCount 2 should return startMove 4, moveCount 8', () => {
      // From Android: move ranges from movesCount[1]=4 to movesCount[2]=9
      // startMove should be 4 (movesCount[1])
      // moveCount should be 8 (movesCount[2] - 1 = 9 - 1 = 8)
      const result = getMoveRange(2);
      expect(result.startMove).toBe(4);
      expect(result.moveCount).toBe(8);
    });

    test('indexCount 3 should return startMove 9, moveCount 14', () => {
      // From Android: move ranges from movesCount[2]=9 to movesCount[3]=15
      // startMove should be 9 (movesCount[2])
      // moveCount should be 14 (movesCount[3] - 1 = 15 - 1 = 14)
      const result = getMoveRange(3);
      expect(result.startMove).toBe(9);
      expect(result.moveCount).toBe(14);
    });

    test('indexCount 4 should return startMove 15, moveCount 19', () => {
      // From Android: move ranges from movesCount[3]=15 to movesCount[4]=20
      // startMove should be 15 (movesCount[3])
      // moveCount should be 19 (movesCount[4] - 1 = 20 - 1 = 19)
      const result = getMoveRange(4);
      expect(result.startMove).toBe(15);
      expect(result.moveCount).toBe(19);
    });

    test('indexCount 5 should return startMove 20, moveCount 22', () => {
      // From Android: move ranges from movesCount[4]=20 to movesCount[5]=23
      // startMove should be 20 (movesCount[4])
      // moveCount should be 22 (movesCount[5] - 1 = 23 - 1 = 22)
      const result = getMoveRange(5);
      expect(result.startMove).toBe(20);
      expect(result.moveCount).toBe(22);
    });

    test('indexCount 6 should return startMove 23, moveCount 23', () => {
      // From Android: move ranges from movesCount[5]=23 to movesCount[6]=24
      // startMove should be 23 (movesCount[5])
      // moveCount should be 23 (movesCount[6] - 1 = 24 - 1 = 23)
      const result = getMoveRange(6);
      expect(result.startMove).toBe(23);
      expect(result.moveCount).toBe(23);
    });

    test('indexCount out of range should handle gracefully', () => {
      // Edge case: indexCount beyond expected range
      expect(() => getMoveRange(7)).not.toThrow();
      expect(() => getMoveRange(-1)).not.toThrow();
    });
  });

  describe('getDigitIndices', () => {
    /**
     * Tests for getDigitIndices function
     * Maps move number to which digit indices to multiply
     * Based on movesIndexes array and complex conditional logic from Android setIndex()
     *
     * The Android logic (lines 284-306) uses:
     * - movesIndexes array: [2, 2, 2, 1, 2, 1, 0, 2, 1, 0, 1, 0, 0]
     * - Complex conditionals for fsIndex and ssIndex calculation
     */

    // Move 0-3: Based on indices 0-3 in movesIndexes
    test('move 0 should select digit indices firstStringIndex=2, secondStringIndex=2', () => {
      const result = getDigitIndices(0);
      expect(result.firstStringIndex).toBe(2);
      expect(result.secondStringIndex).toBe(2);
    });

    test('move 1 should select digit indices firstStringIndex=2, secondStringIndex=2', () => {
      const result = getDigitIndices(1);
      expect(result.firstStringIndex).toBe(2);
      expect(result.secondStringIndex).toBe(2);
    });

    test('move 2 should select digit indices firstStringIndex=2, secondStringIndex=2', () => {
      const result = getDigitIndices(2);
      expect(result.firstStringIndex).toBe(2);
      expect(result.secondStringIndex).toBe(2);
    });

    test('move 3 should select digit indices firstStringIndex=1, secondStringIndex=2', () => {
      const result = getDigitIndices(3);
      expect(result.firstStringIndex).toBe(1);
      expect(result.secondStringIndex).toBe(2);
    });

    // Move 4-8: Based on indices 0-4 (with i+4 pattern)
    test('move 4 should select digit indices firstStringIndex=2, secondStringIndex=2', () => {
      const result = getDigitIndices(4);
      expect(result.firstStringIndex).toBe(2);
      expect(result.secondStringIndex).toBe(2);
    });

    test('move 5 should select digit indices firstStringIndex=2, secondStringIndex=2', () => {
      const result = getDigitIndices(5);
      expect(result.firstStringIndex).toBe(2);
      expect(result.secondStringIndex).toBe(2);
    });

    test('move 6 should select digit indices firstStringIndex=1, secondStringIndex=2', () => {
      const result = getDigitIndices(6);
      expect(result.firstStringIndex).toBe(1);
      expect(result.secondStringIndex).toBe(2);
    });

    test('move 7 should select digit indices firstStringIndex=2, secondStringIndex=1', () => {
      const result = getDigitIndices(7);
      expect(result.firstStringIndex).toBe(2);
      expect(result.secondStringIndex).toBe(1);
    });

    test('move 8 should select digit indices firstStringIndex=1, secondStringIndex=2', () => {
      const result = getDigitIndices(8);
      expect(result.firstStringIndex).toBe(1);
      expect(result.secondStringIndex).toBe(2);
    });

    // Move 9-14: Continue pattern
    test('move 9 should select digit indices firstStringIndex=0, secondStringIndex=1', () => {
      const result = getDigitIndices(9);
      expect(result.firstStringIndex).toBe(0);
      expect(result.secondStringIndex).toBe(1);
    });

    test('move 10 should select digit indices firstStringIndex=2, secondStringIndex=1', () => {
      const result = getDigitIndices(10);
      expect(result.firstStringIndex).toBe(2);
      expect(result.secondStringIndex).toBe(1);
    });

    test('move 11 should select digit indices firstStringIndex=1, secondStringIndex=1', () => {
      const result = getDigitIndices(11);
      expect(result.firstStringIndex).toBe(1);
      expect(result.secondStringIndex).toBe(1);
    });

    test('move 12 should select digit indices firstStringIndex=0, secondStringIndex=1', () => {
      const result = getDigitIndices(12);
      expect(result.firstStringIndex).toBe(0);
      expect(result.secondStringIndex).toBe(1);
    });

    test('move 13 should select digit indices firstStringIndex=1, secondStringIndex=0', () => {
      const result = getDigitIndices(13);
      expect(result.firstStringIndex).toBe(1);
      expect(result.secondStringIndex).toBe(0);
    });

    test('move 14 should select digit indices firstStringIndex=0, secondStringIndex=1', () => {
      const result = getDigitIndices(14);
      expect(result.firstStringIndex).toBe(0);
      expect(result.secondStringIndex).toBe(1);
    });

    // Move 15-19
    test('move 15 should select digit indices firstStringIndex=2, secondStringIndex=0', () => {
      const result = getDigitIndices(15);
      expect(result.firstStringIndex).toBe(2);
      expect(result.secondStringIndex).toBe(0);
    });

    test('move 16 should select digit indices firstStringIndex=1, secondStringIndex=0', () => {
      const result = getDigitIndices(16);
      expect(result.firstStringIndex).toBe(1);
      expect(result.secondStringIndex).toBe(0);
    });

    test('move 17 should select digit indices firstStringIndex=0, secondStringIndex=0', () => {
      const result = getDigitIndices(17);
      expect(result.firstStringIndex).toBe(0);
      expect(result.secondStringIndex).toBe(0);
    });

    test('move 18 should select digit indices firstStringIndex=1, secondStringIndex=0', () => {
      const result = getDigitIndices(18);
      expect(result.firstStringIndex).toBe(1);
      expect(result.secondStringIndex).toBe(0);
    });

    test('move 19 should select digit indices firstStringIndex=0, secondStringIndex=0', () => {
      const result = getDigitIndices(19);
      expect(result.firstStringIndex).toBe(0);
      expect(result.secondStringIndex).toBe(0);
    });

    // Move 20-23 (final moves)
    test('move 20 should select digit indices firstStringIndex=2, secondStringIndex=0', () => {
      const result = getDigitIndices(20);
      expect(result.firstStringIndex).toBe(2);
      expect(result.secondStringIndex).toBe(0);
    });

    test('move 21 should select digit indices firstStringIndex=1, secondStringIndex=0', () => {
      const result = getDigitIndices(21);
      expect(result.firstStringIndex).toBe(1);
      expect(result.secondStringIndex).toBe(0);
    });

    test('move 22 should select digit indices firstStringIndex=0, secondStringIndex=0', () => {
      const result = getDigitIndices(22);
      expect(result.firstStringIndex).toBe(0);
      expect(result.secondStringIndex).toBe(0);
    });

    test('move 23 should select digit indices firstStringIndex=0, secondStringIndex=0', () => {
      const result = getDigitIndices(23);
      expect(result.firstStringIndex).toBe(0);
      expect(result.secondStringIndex).toBe(0);
    });

    test('move out of range should handle gracefully', () => {
      // Edge case: move number beyond expected range
      expect(() => getDigitIndices(24)).not.toThrow();
      expect(() => getDigitIndices(-1)).not.toThrow();
    });
  });
});
