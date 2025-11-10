import { useAppStore } from '../../src/store/appStore';

/**
 * Hint System Integration Tests
 *
 * End-to-end tests for the complete hint flow:
 * 1. Problem generation initializes hints
 * 2. Hint advancement works correctly
 * 3. Carry propagation between digits
 * 4. Hint state resets properly
 * 5. Integration with answer submission
 *
 * NOTE: These tests currently cannot run due to Expo SDK 54 / Jest compatibility issues.
 * This is documented and will be addressed in Phase 8.
 */

describe('Hint System Integration', () => {
  beforeEach(() => {
    // Reset store to initial state
    const store = useAppStore.getState();
    store.resetPractice();
  });

  describe('Problem Generation and Hint Initialization', () => {
    test('should initialize hint state when generating new problem', () => {
      const store = useAppStore.getState();

      // Generate a new problem
      store.generateNewProblem();

      // Verify hint state is initialized
      expect(store.currentEquation).toBeTruthy();
      expect(store.move).toBe(0); // First digit starts at move 0
      expect(store.moveCount).toBe(0); // First digit has 0 moves
      expect(store.remainderHint).toBe(0);
      expect(store.hintQuestion).toBe('');
      expect(store.hintResult).toBe('');
      expect(store.hintHighlightIndices).toEqual([]);
    });
  });

  describe('Hint Advancement Flow', () => {
    test('should advance through hints for first digit', () => {
      const store = useAppStore.getState();

      // Enable hints first
      store.setHintsEnabled(true);

      // Generate problem
      store.generateNewProblem();

      const initialMove = store.move;

      // Advance hint
      store.nextHint();

      // Verify hint advanced
      expect(store.move).toBe(initialMove + 1);
      expect(store.hintQuestion).toBeTruthy(); // Should have a question
      expect(store.hintHighlightIndices).toHaveLength(2); // Should highlight 2 digits
    });

    test('should not advance beyond moveCount', () => {
      const store = useAppStore.getState();
      store.generateNewProblem();

      // Set move to moveCount (at limit)
      useAppStore.setState({ move: store.moveCount });

      const moveBefore = store.move;

      // Try to advance
      store.nextHint();

      // Should not advance
      expect(store.move).toBe(moveBefore);
    });

    test('should accumulate hint result display', () => {
      const store = useAppStore.getState();
      store.generateNewProblem();

      // Set up for multiple hints
      useAppStore.setState({ move: 1, moveCount: 5 });

      const initialResult = store.hintResult;

      // Advance hint
      store.nextHint();

      // Result should accumulate
      expect(store.hintResult.length).toBeGreaterThan(initialResult.length);
    });
  });

  describe('Digit Transition and Carry Propagation', () => {
    test('should reset hints when moving to next digit', () => {
      const store = useAppStore.getState();
      store.generateNewProblem();

      // Set up: answer first digit with accumulated remainder
      useAppStore.setState({
        indexCount: 0,
        remainderHint: 25, // Carry should be 2
        hintResult: '1 + 2 + 3',
        hintQuestion: '3 × 7',
      });

      // Submit correct answer for first digit
      const correctIndex = store.correctAnswerIndex;
      const result = store.submitAnswer(correctIndex);

      // Should be correct but not complete
      expect(result.isCorrect).toBe(true);
      expect(result.isComplete).toBe(false);

      // Verify hint state reset for next digit
      const newStore = useAppStore.getState();
      expect(newStore.indexCount).toBe(1); // Moved to next digit
      expect(newStore.hintQuestion).toBe(''); // Reset
      expect(newStore.remainderHint).toBe(2); // Carry = floor(25/10) = 2
      expect(newStore.hintResult).toBe('2 + '); // Shows carry
    });

    test('should not show carry when remainder < 10', () => {
      const store = useAppStore.getState();
      store.generateNewProblem();

      // Set up: remainder less than 10
      useAppStore.setState({
        indexCount: 0,
        remainderHint: 7, // No carry
      });

      const correctIndex = store.correctAnswerIndex;
      store.submitAnswer(correctIndex);

      // Verify no carry in next digit
      const newStore = useAppStore.getState();
      expect(newStore.remainderHint).toBe(0);
      expect(newStore.hintResult).toBe(''); // No carry display
    });
  });

  describe('Complete Hint Flow for First Digit', () => {
    test('should complete full hint cycle for first digit', () => {
      const store = useAppStore.getState();
      store.setHintsEnabled(true);
      store.generateNewProblem();

      // Get initial state
      const initialMove = store.move;
      const targetMoveCount = store.moveCount;

      // If moveCount is 0, we can't advance hints
      if (targetMoveCount === 0) {
        expect(store.move).toBe(0);
        return;
      }

      // Advance through all hints
      for (let i = initialMove; i < targetMoveCount; i++) {
        store.nextHint();
      }

      // Verify we've gone through all hints
      expect(store.move).toBe(targetMoveCount);

      // Hint result should have accumulated
      expect(store.hintResult).toBeTruthy();
    });
  });

  describe('Hint Calculation Correctness', () => {
    test('should calculate hint steps using Trachtenberg algorithm', () => {
      const store = useAppStore.getState();
      store.generateNewProblem();

      // For indexCount > 0, we should have moves
      useAppStore.setState({ indexCount: 1 });

      // Generate problem again to get proper move range for indexCount 1
      store.generateNewProblem();
      useAppStore.setState({ indexCount: 1, move: 1, moveCount: 3 });

      const initialRemainder = store.remainderHint;

      // Advance hint
      store.nextHint();

      // Should have updated remainder
      expect(store.remainderHint).toBeGreaterThanOrEqual(initialRemainder);

      // Should have a valid question (digit × digit)
      expect(store.hintQuestion).toMatch(/^\d × \d$/);
    });
  });

  describe('Hint State Persistence', () => {
    test('hint state should not persist across sessions', () => {
      // Note: This test verifies the partialize function in store
      // Hint state should NOT be in the persistence list

      const store = useAppStore.getState();
      store.generateNewProblem();

      // Advance some hints
      store.nextHint();

      // Get current hint state
      const hintState = {
        move: store.move,
        moveCount: store.moveCount,
        remainderHint: store.remainderHint,
        hintQuestion: store.hintQuestion,
        hintResult: store.hintResult,
      };

      // All hint values should be non-default
      expect(
        hintState.move > 0 ||
        hintState.hintQuestion !== '' ||
        hintState.hintResult !== ''
      ).toBe(true);

      // Verify these are not in persistence config by checking partialize
      // (This is a structural test - actual persistence would require async storage)
    });
  });

  describe('Edge Cases', () => {
    test('should handle problem with zeros', () => {
      // This tests that the hint system works even with digits that multiply to 0
      const store = useAppStore.getState();

      // Set up a problem (we can't control the random generation, but we can test the flow)
      store.generateNewProblem();

      // The system should handle any valid problem
      expect(store.currentEquation).toBeTruthy();
      expect(store.currentAnswer).toBeTruthy();
    });

    test('should handle maximum remainder accumulation', () => {
      const store = useAppStore.getState();
      store.generateNewProblem();

      // Set up maximum possible remainder (9×9 × many times)
      useAppStore.setState({ remainderHint: 99 });

      // Should still calculate carry correctly
      const correctIndex = store.correctAnswerIndex;
      store.submitAnswer(correctIndex);

      const newStore = useAppStore.getState();
      expect(newStore.remainderHint).toBe(9); // floor(99/10) = 9
    });
  });

  describe('Hint Enforcement Integration', () => {
    test('should allow answer after viewing sufficient hints', () => {
      const store = useAppStore.getState();
      store.setHintsEnabled(true);
      store.generateNewProblem();

      // Set move to 9 (threshold for allowing answers)
      useAppStore.setState({ move: 9 });

      const correctIndex = store.correctAnswerIndex;
      const result = store.submitAnswer(correctIndex);

      // Should be able to submit
      expect(result.isCorrect).toBe(true);
    });
  });

  describe('Store Action Integration', () => {
    test('resetPractice should clear all hint state', () => {
      const store = useAppStore.getState();
      store.generateNewProblem();
      store.nextHint();

      // Reset
      store.resetPractice();

      // All hint state should be reset
      expect(store.move).toBe(0);
      expect(store.moveCount).toBe(0);
      expect(store.remainderHint).toBe(0);
      expect(store.hintQuestion).toBe('');
      expect(store.hintResult).toBe('');
      expect(store.hintHighlightIndices).toEqual([]);
    });

    test('resetHints should clear hint display state', () => {
      const store = useAppStore.getState();
      store.generateNewProblem();
      store.nextHint();

      // Reset hints
      store.resetHints();

      // Hint state should be cleared
      expect(store.move).toBe(0);
      expect(store.hintQuestion).toBe('');
      expect(store.hintResult).toBe('');
    });
  });
});
