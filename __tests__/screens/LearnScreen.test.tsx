import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { act } from 'react-test-renderer';
import LearnScreen from '../../src/screens/LearnScreen';
import { useAppStore } from '../../src/store/appStore';
import { TUTORIAL_STEP_COUNT } from '../../src/data/tutorialContent';

// Mock expo-router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const LearnScreenWithTheme = () => (
  <PaperProvider>
    <LearnScreen />
  </PaperProvider>
);

describe('[LearnScreen]', () => {
  beforeEach(() => {
    mockPush.mockClear();
    act(() => {
      useAppStore.setState({ tutorialPage: 0 });
    });
  });

  it('should render without crashing', () => {
    const result = render(<LearnScreenWithTheme />);
    expect(result).toBeTruthy();
  });

  it('should display tutorial step explanation content', () => {
    const { getByText } = render(<LearnScreenWithTheme />);
    // First step mentions Trachtenberg system
    expect(getByText(/Trachtenberg system/)).toBeTruthy();
  });

  it('should show step indicator with correct page number and total count', () => {
    const { getByText } = render(<LearnScreenWithTheme />);
    expect(getByText(`Step 1 of ${TUTORIAL_STEP_COUNT}`)).toBeTruthy();
  });

  it('should disable Back button on first page', () => {
    const { getByText } = render(<LearnScreenWithTheme />);
    expect(useAppStore.getState().tutorialPage).toBe(0);
    // Press Back on first page — tutorialPage should remain 0
    fireEvent.press(getByText('Back'));
    expect(useAppStore.getState().tutorialPage).toBe(0);
  });

  it('should advance page when Next is pressed', () => {
    const { getByText } = render(<LearnScreenWithTheme />);
    const nextButton = getByText('Next');
    fireEvent.press(nextButton);
    expect(useAppStore.getState().tutorialPage).toBe(1);
  });

  it('should go back when Back is pressed on a non-first page', () => {
    act(() => {
      useAppStore.setState({ tutorialPage: 3 });
    });
    const { getByText } = render(<LearnScreenWithTheme />);
    expect(getByText(`Step 4 of ${TUTORIAL_STEP_COUNT}`)).toBeTruthy();

    const backButton = getByText('Back');
    fireEvent.press(backButton);
    expect(useAppStore.getState().tutorialPage).toBe(2);
  });

  it('should show Practice button on last page and navigate to practice', () => {
    act(() => {
      useAppStore.setState({ tutorialPage: TUTORIAL_STEP_COUNT - 1 });
    });
    const { getByText } = render(<LearnScreenWithTheme />);
    expect(getByText(`Step ${TUTORIAL_STEP_COUNT} of ${TUTORIAL_STEP_COUNT}`)).toBeTruthy();

    const practiceButton = getByText('Practice');
    fireEvent.press(practiceButton);
    expect(mockPush).toHaveBeenCalledWith('/practice');
  });

  it('should update step indicator when navigating forward', () => {
    const { getByText, rerender } = render(<LearnScreenWithTheme />);
    expect(getByText(`Step 1 of ${TUTORIAL_STEP_COUNT}`)).toBeTruthy();

    fireEvent.press(getByText('Next'));

    rerender(<LearnScreenWithTheme />);
    expect(getByText(`Step 2 of ${TUTORIAL_STEP_COUNT}`)).toBeTruthy();
  });
});
