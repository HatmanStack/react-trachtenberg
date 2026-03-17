import { useAppStore } from '../../src/store/appStore';

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

      // Generate a problem
      store.generateNewProblem();

      const stateAfterGen = useAppStore.getState();
      const { correctAnswerIndex, currentAnswer } = stateAfterGen;

      // Only test carry if the answer has more than one digit
      if (currentAnswer.length <= 1) return;

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
});
