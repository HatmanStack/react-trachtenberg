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
 * MOVES_COUNT pattern: [0, 1, 4, 9, 15, 21, 27, 33]
 * - indexCount 0: 1 move  (startMove=0, moveCount=1)
 * - indexCount 1: 3 moves (startMove=1, moveCount=4)
 * - indexCount 2: 5 moves (startMove=4, moveCount=9)
 * - etc.
 */

describe('Hint System Integration', () => {
  beforeEach(() => {
    // Reset store to initial state (don't use replace=true to keep actions)
    useAppStore.setState({
      hintsEnabled: false,
      hintHelpShown: false,
      tutorialPage: 0,
      currentEquation: '',
      currentAnswer: '',
      answerProgress: '',
      indexCount: 0,
      firstCharRemainder: 0,
      answerChoices: [],
      correctAnswerIndex: 0,
      move: 0,
      moveCount: 0,
      remainderHint: 0,
      hintQuestion: '',
      hintResult: '',
      hintHighlightIndices: [],
    });
  });

  describe('Problem Generation and Hint Initialization', () => {
    test('should initialize hint state when generating new problem', () => {
      const store = useAppStore.getState();

      // Generate a new problem
      store.generateNewProblem();

      // Verify hint state is initialized for first digit (indexCount=0)
      // MOVES_COUNT[0]=0, MOVES_COUNT[1]=1, so startMove=0, moveCount=1
      const state = useAppStore.getState();
      expect(state.currentEquation).toBeTruthy();
      expect(state.move).toBe(0);
      expect(state.moveCount).toBe(1);
      expect(state.remainderHint).toBe(0);
      expect(state.hintQuestion).toBe('');
      expect(state.hintResult).toBe('');
      expect(state.hintHighlightIndices).toEqual([]);
    });
  });

  describe('Hint Advancement Flow', () => {
    test('should advance through hints for first digit', () => {
      const store = useAppStore.getState();
      store.setHintsEnabled(true);
      store.generateNewProblem();

      const initialMove = useAppStore.getState().move;

      // Advance hint
      store.nextHint();

      // Verify hint advanced
      const state = useAppStore.getState();
      expect(state.move).toBe(initialMove + 1);
      expect(state.hintQuestion).toBeTruthy();
      expect(state.hintHighlightIndices).toHaveLength(2);
    });

    test('should not advance beyond moveCount', () => {
      const store = useAppStore.getState();
      store.generateNewProblem();

      // Set move to moveCount (at limit)
      const state = useAppStore.getState();
      useAppStore.setState({ move: state.moveCount });

      const moveBefore = useAppStore.getState().move;

      // Try to advance
      store.nextHint();

      // Should not advance
      expect(useAppStore.getState().move).toBe(moveBefore);
    });

    test('should accumulate hint result display', () => {
      const store = useAppStore.getState();
      store.generateNewProblem();

      // Set up for multiple hints at indexCount=1 (which has 3 moves: startMove=1, moveCount=4)
      useAppStore.setState({ indexCount: 1, move: 1, moveCount: 4, hintResult: '' });

      // Advance hint
      store.nextHint();

      // Result should accumulate
      const state = useAppStore.getState();
      expect(state.hintResult.length).toBeGreaterThan(0);
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
      const correctIndex = useAppStore.getState().correctAnswerIndex;
      const result = store.submitAnswer(correctIndex);

      // Should be correct but not complete
      expect(result.isCorrect).toBe(true);
      expect(result.isComplete).toBe(false);

      // Verify hint state reset for next digit
      const newState = useAppStore.getState();
      expect(newState.indexCount).toBe(1);
      expect(newState.hintQuestion).toBe('');
      expect(newState.remainderHint).toBe(2); // Carry = floor(25/10) = 2
      expect(newState.hintResult).toBe('2 + ');
    });

    test('should not show carry when remainder < 10', () => {
      const store = useAppStore.getState();
      store.generateNewProblem();

      // Set up: remainder less than 10
      useAppStore.setState({
        indexCount: 0,
        remainderHint: 7, // No carry
      });

      const correctIndex = useAppStore.getState().correctAnswerIndex;
      store.submitAnswer(correctIndex);

      // Verify no carry in next digit
      const newState = useAppStore.getState();
      expect(newState.remainderHint).toBe(0);
      expect(newState.hintResult).toBe('');
    });
  });

  describe('Complete Hint Flow for First Digit', () => {
    test('should complete full hint cycle for first digit', () => {
      const store = useAppStore.getState();
      store.setHintsEnabled(true);
      store.generateNewProblem();

      // Get initial state - first digit has 1 move
      const state = useAppStore.getState();
      const initialMove = state.move;
      const targetMoveCount = state.moveCount;

      // First digit should have 1 move
      expect(targetMoveCount).toBe(1);

      // Advance through all hints
      for (let i = initialMove; i < targetMoveCount; i++) {
        store.nextHint();
      }

      // Verify we've gone through all hints
      expect(useAppStore.getState().move).toBe(targetMoveCount);

      // Hint result should have accumulated
      expect(useAppStore.getState().hintResult).toBeTruthy();
    });
  });

  describe('Hint Calculation Correctness', () => {
    test('should calculate hint steps using Trachtenberg algorithm', () => {
      const store = useAppStore.getState();
      store.generateNewProblem();

      // Set up for indexCount 1 with proper move range (startMove=1, moveCount=4)
      useAppStore.setState({ indexCount: 1, move: 1, moveCount: 4, remainderHint: 0 });

      const initialRemainder = useAppStore.getState().remainderHint;

      // Advance hint
      store.nextHint();

      // Should have updated state
      const state = useAppStore.getState();
      expect(state.remainderHint).toBeGreaterThanOrEqual(initialRemainder);

      // Should have a valid question (digit × digit)
      expect(state.hintQuestion).toMatch(/^\d × \d$/);
    });
  });

  describe('Hint State Persistence', () => {
    test('hint state should be non-default after advancing', () => {
      const store = useAppStore.getState();
      store.generateNewProblem();

      // Advance some hints
      store.nextHint();

      // Get current hint state
      const state = useAppStore.getState();

      // At least one hint value should be non-default
      expect(
        state.move > 0 ||
        state.hintQuestion !== '' ||
        state.hintResult !== ''
      ).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    test('should handle problem with zeros', () => {
      const store = useAppStore.getState();
      store.generateNewProblem();

      // The system should handle any valid problem
      const state = useAppStore.getState();
      expect(state.currentEquation).toBeTruthy();
      expect(state.currentAnswer).toBeTruthy();
    });

    test('should handle maximum remainder accumulation', () => {
      const store = useAppStore.getState();
      store.generateNewProblem();

      // Set up maximum possible remainder (9×9 × many times)
      useAppStore.setState({ remainderHint: 99 });

      // Should still calculate carry correctly
      const correctIndex = useAppStore.getState().correctAnswerIndex;
      store.submitAnswer(correctIndex);

      const newState = useAppStore.getState();
      expect(newState.remainderHint).toBe(9); // floor(99/10) = 9
    });
  });

  describe('Hint Enforcement Integration', () => {
    test('should allow answer after viewing sufficient hints', () => {
      const store = useAppStore.getState();
      store.setHintsEnabled(true);
      store.generateNewProblem();

      // Set move to satisfy MIN_HINTS_BEFORE_ANSWER (which is 1)
      useAppStore.setState({ move: 1 });

      const correctIndex = useAppStore.getState().correctAnswerIndex;
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
      const state = useAppStore.getState();
      expect(state.move).toBe(0);
      expect(state.moveCount).toBe(0);
      expect(state.remainderHint).toBe(0);
      expect(state.hintQuestion).toBe('');
      expect(state.hintResult).toBe('');
      expect(state.hintHighlightIndices).toEqual([]);
    });

    test('resetHints should clear hint display state', () => {
      const store = useAppStore.getState();
      store.generateNewProblem();
      store.nextHint();

      // Reset hints
      store.resetHints();

      // Hint state should be cleared
      const state = useAppStore.getState();
      expect(state.move).toBe(0);
      expect(state.hintQuestion).toBe('');
      expect(state.hintResult).toBe('');
    });
  });
});
