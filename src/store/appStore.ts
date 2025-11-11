import { create } from 'zustand';
import { generateProblem, formatEquation } from '../utils/problemGenerator';
import { generateAnswerChoices, getDigitAtPosition } from '../utils/answerChoices';
import { validateAnswer } from '../utils/answerValidator';
import { getMoveRange } from '../utils/hintMoveTracker';
import { calculateHintStep } from '../utils/hintCalculator';

interface AppState {
  // Settings
  hintsEnabled: boolean;
  hintHelpShown: boolean;

  // Tutorial state
  tutorialPage: number;

  // Practice state
  currentEquation: string;           // e.g., "1234 × 567"
  currentAnswer: string;             // Complete correct answer
  answerProgress: string;            // Partial answer built so far
  indexCount: number;                // Current digit position (0-based from right)
  firstCharRemainder: number;        // Carry from previous digit calculation
  answerChoices: number[];           // Four button values [0-9]
  correctAnswerIndex: number;        // Which button (0-3) is correct

  // Hint system state
  move: number;                    // Current hint step (0-24)
  moveCount: number;               // Total steps for current digit
  remainderHint: number;           // Accumulated hint value
  hintQuestion: string;            // Current hint question (e.g., "3 × 6")
  hintResult: string;              // Current hint result display
  hintHighlightIndices: number[];  // Indices to highlight in equation

  // Actions
  setHintsEnabled: (enabled: boolean) => void;
  setHintHelpShown: (shown: boolean) => void;
  setTutorialPage: (page: number) => void;

  // Practice actions
  generateNewProblem: () => void;
  submitAnswer: (buttonIndex: number) => { isCorrect: boolean; isComplete: boolean };
  resetPractice: () => void;

  // Hint actions
  nextHint: () => void;            // Advance to next hint step
  resetHints: () => void;          // Reset hint state for new digit
}

export const useAppStore = create<AppState>()((set, get) => ({
      // Initial state
      hintsEnabled: false,
      hintHelpShown: false,
      tutorialPage: 0,

      // Practice state initial values
      currentEquation: '',
      currentAnswer: '',
      answerProgress: '',
      indexCount: 0,
      firstCharRemainder: 0,
      answerChoices: [],
      correctAnswerIndex: 0,

      // Hint system state (Phase 4)
      move: 0,
      moveCount: 0,
      remainderHint: 0,
      hintQuestion: '',
      hintResult: '',
      hintHighlightIndices: [],

      // Actions
      setHintsEnabled: (enabled) => set({ hintsEnabled: enabled }),
      setHintHelpShown: (shown) => set({ hintHelpShown: shown }),
      setTutorialPage: (page) => {
        console.log('setTutorialPage called with:', page);
        set({ tutorialPage: page });
      },

      // Practice actions
      generateNewProblem: () => {
        console.log('generateNewProblem called in store');
        const problem = generateProblem();
        console.log('Generated problem:', problem);
        const equation = formatEquation(problem);
        const answer = problem.answer.toString();

        // Get first digit (rightmost) for initial question
        const firstDigit = getDigitAtPosition(problem.answer, 0);
        const { choices, correctIndex } = generateAnswerChoices(firstDigit);

        // Initialize hint state for first digit (indexCount = 0)
        const { startMove, moveCount } = getMoveRange(0);

        console.log('Setting state with equation:', equation);
        console.log('Initial hint state - startMove:', startMove, 'moveCount:', moveCount);
        set({
          currentEquation: equation,
          currentAnswer: answer,
          answerProgress: '',
          indexCount: 0,
          firstCharRemainder: 0,
          answerChoices: choices,
          correctAnswerIndex: correctIndex,
          // Hint state initialized for first digit
          move: startMove,
          moveCount: moveCount,
          remainderHint: 0,
          hintQuestion: '',
          hintResult: '',
          hintHighlightIndices: [],
        });
      },

      submitAnswer: (buttonIndex: number) => {
        const state = get();
        console.log('submitAnswer called - buttonIndex:', buttonIndex, 'correctIndex:', state.correctAnswerIndex);
        console.log('submitAnswer - current state: indexCount:', state.indexCount, 'answerProgress:', state.answerProgress);

        const result = validateAnswer(
          buttonIndex,
          state.correctAnswerIndex,
          state.currentAnswer,
          state.indexCount,
          state.firstCharRemainder
        );

        console.log('submitAnswer - validateAnswer result:', result);

        if (!result.isCorrect) {
          console.log('submitAnswer - wrong answer, returning');
          return { isCorrect: false, isComplete: false };
        }

        // If complete, generate new problem after delay
        if (result.isComplete) {
          set({
            indexCount: result.newIndexCount,
            answerProgress: result.newAnswerProgress,
            firstCharRemainder: result.newRemainder,
          });

          setTimeout(() => {
            get().generateNewProblem();
          }, 2000);
          return { isCorrect: true, isComplete: true };
        }

        // Generate new choices for next digit
        console.log('submitAnswer - generating new choices for next digit at indexCount:', result.newIndexCount);
        const nextDigit = getDigitAtPosition(
          parseInt(state.currentAnswer, 10),
          result.newIndexCount
        );
        console.log('submitAnswer - nextDigit:', nextDigit);

        const { choices, correctIndex } = generateAnswerChoices(nextDigit);
        console.log('submitAnswer - new choices:', choices, 'correctIndex:', correctIndex);

        // Calculate carry digit for next position (Android lines 367-375)
        const carryDigit = Math.floor(state.remainderHint / 10);
        console.log('submitAnswer - carry digit:', carryDigit);

        // Get hint state for next digit
        const { startMove, moveCount } = getMoveRange(result.newIndexCount);
        console.log('submitAnswer - new hint range: startMove:', startMove, 'moveCount:', moveCount);

        // Update state for next digit
        set({
          indexCount: result.newIndexCount,
          answerProgress: result.newAnswerProgress,
          firstCharRemainder: result.newRemainder,
          answerChoices: choices,
          correctAnswerIndex: correctIndex,
          // Reset hints for next digit with carry
          move: startMove,
          moveCount: moveCount,
          remainderHint: carryDigit,
          hintQuestion: '',
          hintResult: carryDigit > 0 ? `${carryDigit} + ` : '',
          hintHighlightIndices: [],
        });

        console.log('submitAnswer - state updated with new choices');
        return { isCorrect: true, isComplete: false };
      },

      resetPractice: () => {
        set({
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
      },

      // Hint actions
      nextHint: () => {
        const state = get();

        console.log('nextHint called - move:', state.move, 'moveCount:', state.moveCount, 'indexCount:', state.indexCount);

        // Check if we've reached moveCount
        if (state.move >= state.moveCount) {
          console.log('nextHint: reached moveCount, returning');
          return; // No more hints for this digit
        }

        // Calculate hint for current move
        const hintStep = calculateHintStep(
          state.currentEquation,
          state.move,
          state.remainderHint,
          state.indexCount
        );

        console.log('nextHint: calculated hintStep', JSON.stringify(hintStep, null, 2));

        const newHintResult = state.hintResult + hintStep.resultDisplay;
        console.log('nextHint: updating hintQuestion to:', hintStep.question);
        console.log('nextHint: updating hintResult to:', newHintResult);

        // Update state with hint information
        set({
          move: state.move + 1,
          remainderHint: hintStep.newRemainder,
          hintQuestion: hintStep.question,
          hintResult: newHintResult,
          hintHighlightIndices: hintStep.highlightIndices,
        });

        console.log('nextHint: updated state, new move:', state.move + 1);

        // Log the updated state to verify
        const newState = get();
        console.log('nextHint: verified new state - question:', newState.hintQuestion, 'result:', newState.hintResult);
      },

      resetHints: () => {
        set({
          move: 0,
          moveCount: 0,
          remainderHint: 0,
          hintQuestion: '',
          hintResult: '',
          hintHighlightIndices: [],
        });
      },
    }));
