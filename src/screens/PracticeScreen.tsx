import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { StyleSheet, View, Alert, Animated, Dimensions } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { useAppStore } from '../store/appStore';
import { AnswerButton } from '../components/AnswerButton';
import { HintDisplay } from '../components/HintDisplay';
import { HighlightedText } from '../components/HighlightedText';
import { COLORS, SPACING } from '../theme/constants';
import { formatEquationWithPadding } from '../utils/problemGenerator';
import { logger } from '../utils/logger';
import {
  FEEDBACK_DISPLAY_DURATION_MS,
  FEEDBACK_COMPLETE_DURATION_MS,
  HINT_ANIMATION_DURATION_MS,
  MIN_HINTS_BEFORE_ANSWER,
} from '../constants/algorithm';

const { width } = Dimensions.get('window');
const isLargeScreen = width > 768;

export default function PracticeScreen() {
  const currentEquation = useAppStore((state) => state.currentEquation);
  const answerProgress = useAppStore((state) => state.answerProgress);
  const answerChoices = useAppStore((state) => state.answerChoices);
  const generateNewProblem = useAppStore((state) => state.generateNewProblem);
  const submitAnswer = useAppStore((state) => state.submitAnswer);
  const correctAnswerIndex = useAppStore((state) => state.correctAnswerIndex);
  const indexCount = useAppStore((state) => state.indexCount);

  // Hint state
  const hintsEnabled = useAppStore((state) => state.hintsEnabled);
  const hintHelpShown = useAppStore((state) => state.hintHelpShown);
  const setHintHelpShown = useAppStore((state) => state.setHintHelpShown);
  const hintQuestion = useAppStore((state) => state.hintQuestion);
  const hintResult = useAppStore((state) => state.hintResult);
  const hintHighlightIndices = useAppStore((state) => state.hintHighlightIndices);
  const move = useAppStore((state) => state.move);
  const moveCount = useAppStore((state) => state.moveCount);
  const nextHint = useAppStore((state) => state.nextHint);

  const [feedbackText, setFeedbackText] = useState('');

  // Calculate displayed equation with dynamic padding
  const displayedEquation = useMemo(() => {
    if (!currentEquation) return 'Loading...';
    return formatEquationWithPadding(currentEquation, indexCount, hintsEnabled);
  }, [currentEquation, indexCount, hintsEnabled]);

  // Debug: Log hint state on render
  logger.debug('PracticeScreen render - move:', move, 'moveCount:', moveCount, 'hintsEnabled:', hintsEnabled);
  logger.debug('PracticeScreen render - hintQuestion:', hintQuestion, 'hintResult:', hintResult);
  logger.debug('PracticeScreen render - answerChoices:', answerChoices, 'indexCount:', indexCount, 'answerProgress:', answerProgress);

  // Animated values for feedback and hint display
  const feedbackOpacity = useRef(new Animated.Value(0)).current;
  const hintOpacity = useRef(new Animated.Value(0)).current;

  // Animation functions for feedback and hints - MUST BE BEFORE useEffects that use them
  const showFeedback = useCallback((isComplete: boolean) => {
    // Set feedback opacity to 1 immediately
    feedbackOpacity.setValue(1);

    // Fade out after delay
    const duration = isComplete ? FEEDBACK_COMPLETE_DURATION_MS : FEEDBACK_DISPLAY_DURATION_MS;

    Animated.timing(feedbackOpacity, {
      toValue: 0,
      duration,
      delay: duration,
      useNativeDriver: true,
    }).start();
  }, [feedbackOpacity]);

  const showHints = useCallback(() => {
    logger.debug('showHints called - animating hintOpacity to 1');
    Animated.timing(hintOpacity, {
      toValue: 1,
      duration: HINT_ANIMATION_DURATION_MS,
      useNativeDriver: true,
    }).start(() => {
      logger.debug('showHints animation completed');
    });
  }, [hintOpacity]);

  const hideHints = useCallback(() => {
    hintOpacity.setValue(0);
  }, [hintOpacity]);

  // Generate first problem on mount
  useEffect(() => {
    logger.debug('PracticeScreen mounted, currentEquation:', currentEquation);
    if (!currentEquation) {
      logger.debug('Calling generateNewProblem...');
      generateNewProblem();
      logger.debug('After generateNewProblem call');
    }
  }, [currentEquation, generateNewProblem]);

  // Show hints when problem loads and hints are enabled
  useEffect(() => {
    if (currentEquation && hintsEnabled) {
      logger.debug('useEffect: Showing hints for equation:', currentEquation);
      showHints();
      // Call nextHint to show the first hint step
      if (move === 0 && hintQuestion === '') {
        logger.debug('useEffect: Initializing first hint');
        nextHint();
      }
    }
  }, [currentEquation, hintsEnabled, showHints, move, hintQuestion, nextHint]);

  const handleHintPress = useCallback(() => {
    logger.debug('handleHintPress - move:', move, 'moveCount:', moveCount, 'can advance:', move < moveCount);

    // Advance to next hint if available
    if (move < moveCount) {
      logger.debug('Calling nextHint from handleHintPress');
      nextHint();

      // Show help message after first successful hint advance (not blocking)
      if (!hintHelpShown && move === 0) {
        setTimeout(() => {
          Alert.alert('Hint Help', 'Continue tapping the hint to see all steps');
          setHintHelpShown(true);
        }, 100);
      }
    } else {
      logger.debug('Cannot advance - move >= moveCount');
    }
  }, [hintHelpShown, move, moveCount, setHintHelpShown, nextHint]);

  const handleAnswerPress = useCallback((buttonIndex: number) => {
    logger.debug('handleAnswerPress called - buttonIndex:', buttonIndex, 'hintsEnabled:', hintsEnabled, 'move:', move, 'moveCount:', moveCount);
    logger.debug('handleAnswerPress - current choices:', answerChoices, 'correctIndex:', correctAnswerIndex);

    // Enforce hint viewing when hints enabled
    // Must view at least MIN_HINTS_BEFORE_ANSWER hints before answering
    if (hintsEnabled && move < MIN_HINTS_BEFORE_ANSWER) {
      logger.debug('handleAnswerPress - blocked, need to view at least', MIN_HINTS_BEFORE_ANSWER, 'hint(s). move:', move);
      Alert.alert('View Hints First', 'Tap the hint display at least once to see the calculation steps.');
      return;
    }

    logger.debug('handleAnswerPress - calling submitAnswer');
    const result = submitAnswer(buttonIndex);
    logger.debug('handleAnswerPress - submitAnswer result:', result);

    if (result.isCorrect) {
      setFeedbackText(result.isComplete ? 'Complete!' : 'Correct!');
      showFeedback(result.isComplete);

      if (!result.isComplete) {
        logger.debug('handleAnswerPress - correct but not complete, showing hints for next digit');
        // Show hints for next digit
        showHints();
      } else {
        logger.debug('handleAnswerPress - complete! hiding hints');
        // Hide hints when problem is complete
        hideHints();
      }
    } else {
      logger.debug('handleAnswerPress - wrong answer');
      setFeedbackText('Wrong');
      showFeedback(false);
      // Hide hints on wrong answer
      hideHints();
    }
  }, [hintsEnabled, move, submitAnswer, showFeedback, showHints, hideHints, answerChoices, correctAnswerIndex]);

  return (
    <View style={styles.container}>
      <View style={isLargeScreen ? styles.innerContainer : undefined}>
        {/* Equation Display */}
        <Surface style={styles.equationSurface}>
        {hintsEnabled && hintHighlightIndices.length > 0 ? (
          <HighlightedText
            text={displayedEquation}
            highlightIndices={hintHighlightIndices}
            highlightColor={COLORS.accent}
            style={styles.equation}
          />
        ) : (
          <Text variant="headlineLarge" style={styles.equation}>
            {displayedEquation}
          </Text>
        )}
      </Surface>

      {/* Hint Display */}
      <Animated.View style={{ opacity: hintOpacity }} pointerEvents="box-none">
        <HintDisplay
          question={hintQuestion}
          result={hintResult}
          visible={hintsEnabled}
          onPress={handleHintPress}
        />
      </Animated.View>

      {/* Answer Progress */}
      <Surface style={styles.progressSurface}>
        <Text variant="headlineMedium" style={styles.progress}>
          {answerProgress || '?'}
        </Text>
      </Surface>

      {/* Feedback Text */}
      {feedbackText && (
        <Animated.View style={{ opacity: feedbackOpacity }}>
          <Text
            variant="titleLarge"
            style={[
              styles.feedback,
              feedbackText === 'Wrong' ? styles.feedbackWrong : styles.feedbackCorrect,
            ]}
          >
            {feedbackText}
          </Text>
        </Animated.View>
      )}

        {/* Answer Buttons */}
        <View style={styles.buttonsContainer}>
          <View style={styles.buttonRow}>
            <AnswerButton
              value={answerChoices[0] ?? 0}
              onPress={() => handleAnswerPress(0)}
            />
            <AnswerButton
              value={answerChoices[1] ?? 0}
              onPress={() => handleAnswerPress(1)}
            />
          </View>
          <View style={styles.buttonRow}>
            <AnswerButton
              value={answerChoices[2] ?? 0}
              onPress={() => handleAnswerPress(2)}
            />
            <AnswerButton
              value={answerChoices[3] ?? 0}
              onPress={() => handleAnswerPress(3)}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    alignItems: isLargeScreen ? 'center' : 'stretch',
    justifyContent: 'center',
  },
  innerContainer: {
    maxWidth: 600,
    width: '100%',
  },
  equationSurface: {
    padding: SPACING.xl,
    marginBottom: SPACING.md,
    elevation: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: 100,
  },
  equation: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'monospace', // Ensures consistent spacing with/without padding
    fontSize: 32, // Match Paper's headlineLarge variant size
  },
  progressSurface: {
    padding: SPACING.xl,
    marginBottom: SPACING.md,
    elevation: 4,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
    width: '100%',
  },
  progress: {
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
  },
  feedback: {
    textAlign: 'center',
    marginBottom: SPACING.md,
    fontWeight: 'bold',
  },
  feedbackCorrect: {
    color: '#4caf50',
  },
  feedbackWrong: {
    color: COLORS.accent,
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    marginVertical: SPACING.sm,
    justifyContent: 'center',
    width: '100%',
  },
});
