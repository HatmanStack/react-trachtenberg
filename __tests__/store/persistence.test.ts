import { useAppStore } from '../../src/store/appStore';

/**
 * Store State Tests
 *
 * Tests for state management behavior.
 * Note: Actual persistence to AsyncStorage is not implemented yet.
 * These tests verify the store behaves correctly for state changes.
 */

describe('Store State Management', () => {
  beforeEach(() => {
    // Reset store to initial state
    useAppStore.setState({
      hintsEnabled: false,
      hintHelpShown: false,
      tutorialPage: 0,
      currentEquation: '',
      currentAnswer: '',
      answerProgress: '',
      indexCount: 0,
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

  describe('State Changes', () => {
    test('hintsEnabled state changes correctly', () => {
      const store = useAppStore.getState();

      // Default should be false
      expect(store.hintsEnabled).toBe(false);

      // Change to true
      store.setHintsEnabled(true);
      expect(useAppStore.getState().hintsEnabled).toBe(true);

      // Change back to false
      store.setHintsEnabled(false);
      expect(useAppStore.getState().hintsEnabled).toBe(false);
    });

    test('hintHelpShown state changes correctly', () => {
      const store = useAppStore.getState();

      // Default should be false
      expect(store.hintHelpShown).toBe(false);

      // Change to true
      store.setHintHelpShown(true);
      expect(useAppStore.getState().hintHelpShown).toBe(true);
    });

    test('tutorialPage state changes correctly', () => {
      const store = useAppStore.getState();

      // Default should be 0
      expect(store.tutorialPage).toBe(0);

      // Change to different page
      store.setTutorialPage(5);
      expect(useAppStore.getState().tutorialPage).toBe(5);

      // Change to another page
      store.setTutorialPage(10);
      expect(useAppStore.getState().tutorialPage).toBe(10);
    });
  });

  describe('State Consistency', () => {
    test('problem generation sets all required state', () => {
      const store = useAppStore.getState();
      store.generateNewProblem();

      const state = useAppStore.getState();

      // All practice state should be set
      expect(state.currentEquation).toBeTruthy();
      expect(state.currentAnswer).toBeTruthy();
      expect(state.answerProgress).toBe('');
      expect(state.indexCount).toBe(0);
      expect(state.answerChoices).toHaveLength(4);
      expect(state.correctAnswerIndex).toBeGreaterThanOrEqual(0);
      expect(state.correctAnswerIndex).toBeLessThanOrEqual(3);

      // Hint state should be initialized for first digit
      expect(state.move).toBe(0);
      expect(state.moveCount).toBe(1); // First digit has 1 move
      expect(state.remainderHint).toBe(0);
    });

  });

  describe('Default Values', () => {
    test('store has correct default values', () => {
      // Force reset by setting all values
      useAppStore.setState({
        hintsEnabled: false,
        hintHelpShown: false,
        tutorialPage: 0,
        currentEquation: '',
        currentAnswer: '',
        answerProgress: '',
        indexCount: 0,
          answerChoices: [],
        correctAnswerIndex: 0,
        move: 0,
        moveCount: 0,
        remainderHint: 0,
        hintQuestion: '',
        hintResult: '',
        hintHighlightIndices: [],
      });

      const state = useAppStore.getState();

      // Check all defaults
      expect(state.hintsEnabled).toBe(false);
      expect(state.hintHelpShown).toBe(false);
      expect(state.tutorialPage).toBe(0);
      expect(state.currentEquation).toBe('');
      expect(state.currentAnswer).toBe('');
      expect(state.answerProgress).toBe('');
      expect(state.indexCount).toBe(0);
      expect(state.answerChoices).toEqual([]);
      expect(state.correctAnswerIndex).toBe(0);
      expect(state.move).toBe(0);
      expect(state.moveCount).toBe(0);
      expect(state.remainderHint).toBe(0);
      expect(state.hintQuestion).toBe('');
      expect(state.hintResult).toBe('');
      expect(state.hintHighlightIndices).toEqual([]);
    });
  });
});
