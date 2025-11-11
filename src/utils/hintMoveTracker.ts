/**
 * Move Tracking Logic for Trachtenberg Hint System
 *
 * Ports the move tracking logic from Android's PracticeActivity.java
 * - setMove() method (lines 310-335)
 * - setIndex() method (lines 277-307)
 *
 * The move tracking system determines:
 * 1. Which "move" range applies to the current digit position (indexCount)
 * 2. Which digit indices to multiply for each move step
 */

/**
 * Move count array (updated for diagonal sweep stopping at position 1)
 * Maps indexCount (digit position) to move number boundaries
 * MOVES_COUNT[i] is the startMove for indexCount=i
 * MOVES_COUNT[i+1] is the moveCount (exclusive upper bound) for indexCount=i
 * indexCount 0: 1 move  [0, 1)
 * indexCount 1: 3 moves [1, 4)
 * indexCount 2: 5 moves [4, 9)
 * indexCount 3: 6 moves [9, 15)
 * indexCount 4: 6 moves [15, 21)
 * indexCount 5: 6 moves [21, 27)
 * indexCount 6: 6 moves [27, 33)
 */
const MOVES_COUNT = [0, 1, 4, 9, 15, 21, 27, 33];

/**
 * Result type for getMoveRange function
 */
export interface MoveRange {
  startMove: number;
  moveCount: number;
}

/**
 * Result type for getDigitIndices function
 */
export interface DigitIndices {
  firstStringIndex: number;
  secondStringIndex: number;
}

/**
 * Determines the move range for a given digit position
 * Ports Android's setMove() logic (lines 310-335)
 *
 * @param indexCount - Current digit position (0-6, right to left)
 * @returns Start move and total move count for this digit
 */
export function getMoveRange(indexCount: number): MoveRange {
  // Handle out of range cases
  if (indexCount < 0 || indexCount >= MOVES_COUNT.length - 1) {
    return {
      startMove: 0,
      moveCount: 0,
    };
  }

  // Use MOVES_COUNT array for all digit positions
  // MOVES_COUNT[i] = startMove, MOVES_COUNT[i+1] = moveCount
  const startMove = MOVES_COUNT[indexCount];
  const moveCount = MOVES_COUNT[indexCount + 1];

  return { startMove, moveCount };
}

/**
 * Determines which digit indices to multiply for a given move
 * Dynamically calculates based on indexCount and local move position
 *
 * @param move - Current move number (0-23)
 * @param indexCount - Current digit position being calculated (0-6, right to left)
 * @returns Indices in the first and second strings to multiply
 */
export function getDigitIndices(move: number, indexCount: number): DigitIndices {
  // Handle out of range
  if (move < 0 || indexCount < 0) {
    return { firstStringIndex: 0, secondStringIndex: 0 };
  }

  // Calculate which move this is within the current digit
  const { startMove } = getMoveRange(indexCount);
  const localMove = move - startMove;

  // Define Trachtenberg multiplication patterns for each digit position
  // Complete diagonal sweep pattern: start at [indexCount, 0], sweep diagonally
  // continuing all the way through until reaching [0, maxSecondIndex]
  // Each pattern is an array of [firstStringIndex, secondStringIndex] pairs
  // Indices are 0-based from the RIGHT (0 = rightmost digit)
  const patterns: { [key: number]: Array<[number, number]> } = {
    0: [[0, 0]], // First digit: rightmost × rightmost
    1: [
      [1, 0], // Complete diagonal sweep
      [0, 0],
      [0, 1],
    ],
    2: [
      [2, 0], // Complete diagonal sweep
      [1, 0],
      [1, 1],
      [0, 1],
      [0, 2],
    ],
    3: [
      [3, 0], // Complete diagonal sweep
      [2, 0],
      [2, 1],
      [1, 1],
      [1, 2],
      [0, 2],
    ],
    4: [
      [4, 0], // Continue diagonal sweep
      [3, 0],
      [3, 1],
      [2, 1],
      [2, 2],
      [1, 2], // Stop here (don't include [0,2] - position 0 with max second position)
    ],
    5: [
      [5, 0], // Continue diagonal sweep
      [4, 0],
      [4, 1],
      [3, 1],
      [3, 2],
      [2, 2], // Stop here (don't include [1,2] when at max second position)
    ],
    6: [
      [6, 0], // Continue diagonal sweep
      [5, 0],
      [5, 1],
      [4, 1],
      [4, 2],
      [3, 2], // Stop here
    ],
  };

  const pattern = patterns[indexCount];
  if (!pattern || localMove < 0 || localMove >= pattern.length) {
    console.warn(
      `No pattern for indexCount=${indexCount}, localMove=${localMove}, move=${move}`
    );
    return { firstStringIndex: 0, secondStringIndex: 0 };
  }

  const [firstStringIndex, secondStringIndex] = pattern[localMove];
  return { firstStringIndex, secondStringIndex };
}

/**
 * NOTE: The Android app has skip logic (line 288) for i+4 moves when hints enabled:
 * `if (move == i + 4 && sharedPreferences.getBoolean(HINT, false)) continue;`
 *
 * This skip pattern is handled implicitly in our implementation by the move iteration
 * in the store's nextHint() action, so no separate function is needed.
 */
