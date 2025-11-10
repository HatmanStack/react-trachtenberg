import { create } from 'zustand';
import { persistMiddleware } from './middleware/persistMiddleware';
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

export const useAppStore = create<AppState>()(
  persistMiddleware(
    (set, get) => ({
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
      setTutorialPage: (page) => set({ tutorialPage: page }),

      // Practice actions
      generateNewProblem: () => {
        const problem = generateProblem();
        const equation = formatEquation(problem);
        const answer = problem.answer.toString();

        // Get first digit (rightmost) for initial question
        const firstDigit = getDigitAtPosition(problem.answer, 0);
        const { choices, correctIndex } = generateAnswerChoices(firstDigit);

        // Initialize hint state for first digit (indexCount = 0)
        const { startMove, moveCount } = getMoveRange(0);

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
        const result = validateAnswer(
          buttonIndex,
          state.correctAnswerIndex,
          state.currentAnswer,
          state.indexCount,
          state.firstCharRemainder
        );

        if (!result.isCorrect) {
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
        const nextDigit = getDigitAtPosition(
          parseInt(state.currentAnswer, 10),
          result.newIndexCount
        );
        const { choices, correctIndex } = generateAnswerChoices(nextDigit);

        // Calculate carry digit for next position (Android lines 367-375)
        const carryDigit = Math.floor(state.remainderHint / 10);

        // Get hint state for next digit
        const { startMove, moveCount } = getMoveRange(result.newIndexCount);

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

        // Check if we've reached moveCount
        if (state.move >= state.moveCount) {
          return; // No more hints for this digit
        }

        // Calculate hint for current move
        const hintStep = calculateHintStep(
          state.currentEquation,
          state.move,
          state.remainderHint
        );

        // Update state with hint information
        set({
          move: state.move + 1,
          remainderHint: hintStep.newRemainder,
          hintQuestion: hintStep.question,
          hintResult: state.hintResult + hintStep.resultDisplay,
          hintHighlightIndices: hintStep.highlightIndices,
        });
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
    }),
    {
      name: 'trachtenberg-app-storage',
      partialize: (state) => ({
        // Settings
        hintsEnabled: state.hintsEnabled,
        hintHelpShown: state.hintHelpShown,
        // Practice progress (persist current problem)
        currentEquation: state.currentEquation,
        currentAnswer: state.currentAnswer,
        answerProgress: state.answerProgress,
        indexCount: state.indexCount,
        firstCharRemainder: state.firstCharRemainder,
      }),
    }
  )
);
