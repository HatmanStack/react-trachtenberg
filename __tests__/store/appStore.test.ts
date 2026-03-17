import { useAppStore } from '../../src/store/appStore';
import { PROBLEM_COMPLETE_DELAY_MS } from '../../src/constants/algorithm';

/**
 * AppStore Tests
 *
 * Tests for store actions, carry propagation, and timeout lifecycle.
 * Note: persistence.test.ts covers basic state changes, isolation, and defaults.
 * This file focuses on carry propagation, failure paths, and edge cases.
 */

const resetStore = () => {
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
    _timeoutId: null,
  });
};

describe('[AppStore]', () => {
  beforeEach(() => {
    resetStore();
  });

  describe('carry propagation', () => {
    it('should compute carry digit from remainderHint when advancing to next digit', () => {
      const store = useAppStore.getState();

      // Generate problems until we get a multi-digit answer (required for carry test)
      let attempts = 0;
      do {
        store.generateNewProblem();
        attempts++;
      } while (useAppStore.getState().currentAnswer.length <= 1 && attempts < 20);
      expect(useAppStore.getState().currentAnswer.length).toBeGreaterThan(1);

      const stateAfterGen = useAppStore.getState();
      const { correctAnswerIndex } = stateAfterGen;

      // Advance hint to accumulate a remainderHint
      // The hint system calculates remainderHint during nextHint()
      store.nextHint();

      const stateAfterHint = useAppStore.getState();
      const remainderHintBefore = stateAfterHint.remainderHint;

      // Submit the correct answer for the first digit
      const result = store.submitAnswer(correctAnswerIndex);
      expect(result.isCorrect).toBe(true);

      // After submitting, if there was a remainder, the carry should be Math.floor(remainderHintBefore / 10)
      const stateAfterSubmit = useAppStore.getState();
      const expectedCarry = Math.floor(remainderHintBefore / 10);
      expect(stateAfterSubmit.remainderHint).toBe(expectedCarry);
    });

    it('should set remainderHint to 0 when carry digit is 0', () => {
      const store = useAppStore.getState();
      store.generateNewProblem();

      // Set remainderHint to a value < 10 so carry = 0
      useAppStore.setState({ remainderHint: 5 });

      const { correctAnswerIndex, currentAnswer } = useAppStore.getState();

      if (currentAnswer.length <= 1) return;

      const result = store.submitAnswer(correctAnswerIndex);
      expect(result.isCorrect).toBe(true);

      if (!result.isComplete) {
        const stateAfterSubmit = useAppStore.getState();
        // Math.floor(5 / 10) === 0
        expect(stateAfterSubmit.remainderHint).toBe(0);
      }
    });

    it('should propagate non-zero carry when remainderHint >= 10', () => {
      const store = useAppStore.getState();
      store.generateNewProblem();

      // Set remainderHint to 25 so carry = 2
      useAppStore.setState({ remainderHint: 25 });

      const { correctAnswerIndex, currentAnswer } = useAppStore.getState();

      if (currentAnswer.length <= 1) return;

      const result = store.submitAnswer(correctAnswerIndex);
      expect(result.isCorrect).toBe(true);

      if (!result.isComplete) {
        const stateAfterSubmit = useAppStore.getState();
        expect(stateAfterSubmit.remainderHint).toBe(2);
        expect(stateAfterSubmit.hintResult).toBe('2 + ');
      }
    });
  });

  describe('failure paths and edge cases', () => {
    it('should not advance indexCount when submitAnswer receives incorrect answer', () => {
      const store = useAppStore.getState();
      store.generateNewProblem();

      const { correctAnswerIndex, indexCount } = useAppStore.getState();
      // Pick an incorrect index
      const wrongIndex = (correctAnswerIndex + 1) % 4;

      const result = store.submitAnswer(wrongIndex);
      expect(result.isCorrect).toBe(false);
      expect(result.isComplete).toBe(false);

      const stateAfter = useAppStore.getState();
      expect(stateAfter.indexCount).toBe(indexCount);
    });

    it('should not throw when submitAnswer is called with no problem loaded', () => {
      // Store is in initial state with empty equation
      const store = useAppStore.getState();
      expect(store.currentEquation).toBe('');

      // Should not throw, and result should be defined
      let result: ReturnType<typeof store.submitAnswer> | undefined;
      expect(() => { result = store.submitAnswer(0); }).not.toThrow();
      expect(result).toBeDefined();
    });

    it('should generate a valid problem with non-empty answerChoices', () => {
      const store = useAppStore.getState();
      store.generateNewProblem();

      const state = useAppStore.getState();
      expect(state.currentEquation).not.toBe('');
      expect(state.currentEquation).toContain('\u00d7');
      expect(state.currentAnswer).not.toBe('');
      expect(state.answerChoices.length).toBe(4);
      // All choices should be digits 0-9
      for (const choice of state.answerChoices) {
        expect(choice).toBeGreaterThanOrEqual(0);
        expect(choice).toBeLessThanOrEqual(9);
      }
    });

    it('should not advance move when hints are disabled and nextHint is called', () => {
      const store = useAppStore.getState();
      store.generateNewProblem();

      // Hints not enabled, but moveCount is set from getMoveRange
      const stateBefore = useAppStore.getState();

      // If move >= moveCount, nextHint should not advance
      useAppStore.setState({ move: stateBefore.moveCount });
      store.nextHint();

      const stateAfter = useAppStore.getState();
      expect(stateAfter.move).toBe(stateBefore.moveCount);
    });

    it('should not advance move past moveCount', () => {
      const store = useAppStore.getState();
      store.generateNewProblem();

      const { moveCount } = useAppStore.getState();

      // Set move to moveCount (already at end)
      useAppStore.setState({ move: moveCount });

      store.nextHint();
      expect(useAppStore.getState().move).toBe(moveCount);

      // Call again to ensure it stays
      store.nextHint();
      expect(useAppStore.getState().move).toBe(moveCount);
    });

    it('should clear timeout ID to null via cleanup action', () => {
      const store = useAppStore.getState();

      // Simulate a timeout being set
      const fakeTimeout = setTimeout(() => {}, 10000);
      useAppStore.setState({ _timeoutId: fakeTimeout });
      expect(useAppStore.getState()._timeoutId).not.toBeNull();

      store.cleanup();
      expect(useAppStore.getState()._timeoutId).toBeNull();

      clearTimeout(fakeTimeout); // clean up
    });
  });

  describe('timeout lifecycle', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.clearAllTimers();
      useAppStore.getState().cleanup();
      jest.useRealTimers();
    });

    it('should trigger generateNewProblem after PROBLEM_COMPLETE_DELAY_MS when answer completes', () => {
      const store = useAppStore.getState();
      store.generateNewProblem();

      const { currentAnswer } = useAppStore.getState();

      // Submit correct answers for all digits to complete the problem
      let state = useAppStore.getState();
      for (let i = 0; i < currentAnswer.length; i++) {
        state = useAppStore.getState();
        const result = state.submitAnswer(state.correctAnswerIndex);
        if (result.isComplete) break;
      }

      // After completing, a timeout should be set
      expect(useAppStore.getState()._timeoutId).not.toBeNull();

      // Advance timers
      jest.advanceTimersByTime(PROBLEM_COMPLETE_DELAY_MS);

      // After timeout, a new problem should be generated
      const stateAfter = useAppStore.getState();
      expect(stateAfter._timeoutId).toBeNull();
      // New equation should exist (may or may not be different due to randomness)
      expect(stateAfter.currentEquation).toContain('\u00d7');
    });

    it('should clear previous timeout when a new completion occurs', () => {
      const store = useAppStore.getState();

      // Set a fake timeout
      const fakeTimeout = setTimeout(() => {}, 99999);
      useAppStore.setState({ _timeoutId: fakeTimeout });

      store.generateNewProblem();

      // Complete all digits
      const { currentAnswer } = useAppStore.getState();
      for (let i = 0; i < currentAnswer.length; i++) {
        const state = useAppStore.getState();
        const result = state.submitAnswer(state.correctAnswerIndex);
        if (result.isComplete) break;
      }

      // The old timeout should have been cleared and replaced
      const newTimeoutId = useAppStore.getState()._timeoutId;
      expect(newTimeoutId).not.toBeNull();
      expect(newTimeoutId).not.toBe(fakeTimeout);

      clearTimeout(fakeTimeout);
    });
  });
});
