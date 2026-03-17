import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { act } from 'react-test-renderer';
import PracticeScreen from '../../src/screens/PracticeScreen';
import { useAppStore } from '../../src/store/appStore';

// Mock Alert to prevent native dialogs in tests
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

// Patch Animated to avoid react-native-renderer version mismatch in tests
// The version mismatch only surfaces when useNativeDriver is true and triggers
// the native renderer. Setting useNativeDriver to false avoids this.
const RN = require('react-native');
let originalTiming: typeof RN.Animated.timing;

const PracticeScreenWithTheme = () => (
  <PaperProvider>
    <PracticeScreen />
  </PaperProvider>
);

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

describe('[PracticeScreen]', () => {
  beforeAll(() => {
    originalTiming = RN.Animated.timing;
    RN.Animated.timing = (value: unknown, config: Record<string, unknown>) => {
      return originalTiming(value, { ...config, useNativeDriver: false });
    };
  });

  afterAll(() => {
    RN.Animated.timing = originalTiming;
  });

  beforeEach(() => {
    jest.useFakeTimers();
    resetStore();
  });

  afterEach(() => {
    // Clean up timers
    const store = useAppStore.getState();
    store.cleanup();
    jest.useRealTimers();
  });

  it('should render without crashing', () => {
    const result = render(<PracticeScreenWithTheme />);
    expect(result).toBeTruthy();
  });

  it('should display an equation when the store has a problem', () => {
    // Generate a problem first
    act(() => {
      useAppStore.getState().generateNewProblem();
    });

    const { getByText } = render(<PracticeScreenWithTheme />);
    const state = useAppStore.getState();

    // The equation should contain the multiplication sign
    expect(state.currentEquation).toContain('×');
    // The screen should show the answer progress placeholder
    expect(getByText('?')).toBeTruthy();
  });

  it('should render four answer buttons', () => {
    act(() => {
      useAppStore.getState().generateNewProblem();
    });

    const { getAllByRole } = render(<PracticeScreenWithTheme />);

    // Should have 4 answer buttons (Paper Buttons have role 'button')
    const buttons = getAllByRole('button');
    // At least 4 buttons for the answer choices
    expect(buttons.length).toBeGreaterThanOrEqual(4);
  });

  it('should show Correct feedback when correct answer is selected', () => {
    act(() => {
      useAppStore.getState().generateNewProblem();
    });

    const { correctAnswerIndex, answerChoices, currentAnswer } = useAppStore.getState();
    const correctValue = answerChoices[correctAnswerIndex];

    const { getByText } = render(<PracticeScreenWithTheme />);

    // Find and press the button with the correct value
    const correctButton = getByText(String(correctValue!));
    fireEvent.press(correctButton);

    // Multi-digit answers show "Correct!", single-digit show "Complete!"
    if (currentAnswer.length > 1) {
      expect(getByText('Correct!')).toBeTruthy();
    } else {
      expect(getByText('Complete!')).toBeTruthy();
    }
  });

  it('should show Wrong feedback when incorrect answer is selected', () => {
    act(() => {
      useAppStore.getState().generateNewProblem();
    });

    const { correctAnswerIndex, answerChoices } = useAppStore.getState();
    // Pick any non-correct index
    const wrongIndex = (correctAnswerIndex + 1) % 4;
    const wrongValue = answerChoices[wrongIndex];

    const { getByText } = render(<PracticeScreenWithTheme />);

    const wrongButton = getByText(String(wrongValue!));
    fireEvent.press(wrongButton);

    expect(getByText('Wrong')).toBeTruthy();
  });

  it('should update answer progress when correct answer is selected', () => {
    act(() => {
      useAppStore.getState().generateNewProblem();
    });

    const stateBefore = useAppStore.getState();
    const correctIndex = stateBefore.correctAnswerIndex;
    const correctValue = stateBefore.answerChoices[correctIndex];

    const { getByText } = render(<PracticeScreenWithTheme />);

    const correctButton = getByText(String(correctValue!));
    fireEvent.press(correctButton);

    const stateAfter = useAppStore.getState();
    // answerProgress should have been updated (length > 0)
    expect(stateAfter.answerProgress.length).toBeGreaterThan(0);
  });

  it('should show hint display when hints are enabled', () => {
    act(() => {
      useAppStore.setState({ hintsEnabled: true });
      useAppStore.getState().generateNewProblem();
    });

    const { getByText } = render(<PracticeScreenWithTheme />);

    // HintDisplay renders "Touch to see hint" as default or shows hint question
    const { hintQuestion } = useAppStore.getState();
    if (hintQuestion) {
      expect(getByText(hintQuestion)).toBeTruthy();
    } else {
      expect(getByText('Touch to see hint')).toBeTruthy();
    }
  });

  it('should auto-generate a problem when equation is empty', () => {
    // Don't generate a problem, keep equation empty
    render(<PracticeScreenWithTheme />);
    // The useEffect should trigger generateNewProblem
    expect(useAppStore.getState().currentEquation).not.toBe('');
  });

  it('should auto-initialize hints when equation loads with hints enabled', () => {
    act(() => {
      useAppStore.setState({ hintsEnabled: true });
    });

    // Render triggers generateNewProblem (equation is empty), which triggers hint init
    render(<PracticeScreenWithTheme />);

    const state = useAppStore.getState();
    // Hints should have been initialized: hintQuestion or hintResult should be populated
    expect(state.currentEquation).not.toBe('');
    // The useEffect calls showHints() and nextHint(), so move should have advanced
    expect(state.hintsEnabled).toBe(true);
    // hintQuestion should be populated after nextHint() runs
    expect(state.hintQuestion).not.toBe('');
  });
});
