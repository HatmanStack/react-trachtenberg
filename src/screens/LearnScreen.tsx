import React, { useCallback } from 'react';
import { StyleSheet, View, ScrollView, useWindowDimensions } from 'react-native';
import { Surface, Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTutorialNavigation } from '../hooks/useTutorialNavigation';
import { tutorialSteps, TUTORIAL_EQUATION } from '../data/tutorialContent';
import { getTutorialHighlightIndices } from '../utils/tutorialHighlighter';
import { HighlightedText } from '../components/HighlightedText';
import { COLORS, SPACING } from '../theme/constants';
import { logger } from '../utils/logger';

export default function LearnScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;

  const {
    currentPage,
    goNext,
    goPrevious,
    isLastPage,
    canGoNext,
    canGoPrevious,
  } = useTutorialNavigation();

  logger.debug('LearnScreen render, currentPage:', currentPage);

  const currentStep = tutorialSteps[currentPage];
  if (!currentStep) {
    return null;
  }
  const highlightIndices = getTutorialHighlightIndices(currentStep.answer);

  const handleNext = useCallback(() => {
    logger.debug(`handleNext called, isLastPage: ${isLastPage}, currentPage: ${currentPage}`);
    if (isLastPage) {
      // Navigate to Practice screen on last page (no animation)
      router.push('/practice');
    } else {
      goNext();
    }
  }, [isLastPage, router, goNext, currentPage]);

  const handlePrevious = useCallback(() => {
    logger.debug(`handlePrevious called, currentPage: ${currentPage}`);
    goPrevious();
  }, [goPrevious, currentPage]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          isLargeScreen && styles.scrollContentLarge,
        ]}
      >
        <View style={isLargeScreen ? styles.innerContainer : undefined}>
          {/* Explanation Section */}
          <Surface style={styles.explanationSurface}>
            <Text variant="bodyLarge" style={styles.explanationText}>
              {currentStep.explanation}
            </Text>
          </Surface>

          {/* Equation Display with Highlighting */}
          <Surface style={styles.equationSurface}>
            <HighlightedText
              text={TUTORIAL_EQUATION}
              highlightIndices={highlightIndices}
              highlightColor={COLORS.accent}
              style={styles.equation}
            />
          </Surface>

          {/* Answer/Calculation Steps */}
          {currentStep.answer !== "" && (
            <Surface style={styles.answerSurface}>
              <Text variant="bodyMedium" style={styles.answerText}>
                {currentStep.answer}
              </Text>
            </Surface>
          )}

          {/* Bottom Arrow (Answer Progress) */}
          {currentStep.bottomArrow !== "" && (
            <Surface style={styles.bottomArrowSurface}>
              <Text variant="headlineLarge" style={styles.bottomArrow}>
                {currentStep.bottomArrow}
              </Text>
            </Surface>
          )}

        </View>
      </ScrollView>

      {/* Footer with Page Indicator and Navigation Buttons */}
      <View style={styles.footer}>
        <Text variant="bodySmall" style={styles.pageIndicator}>
          Step {currentPage + 1} of 21
        </Text>
        <View style={[
          styles.buttonContainer,
          isLargeScreen && styles.buttonContainerLarge,
        ]}>
          <Button
            mode="contained"
            onPress={handlePrevious}
            disabled={!canGoPrevious}
            style={styles.button}
          >
            Back
          </Button>
          <Button
            mode="contained"
            onPress={handleNext}
            disabled={!canGoNext && !isLastPage}
            style={styles.button}
          >
            {isLastPage ? 'Practice' : 'Next'}
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    flexGrow: 1,
  },
  scrollContentLarge: {
    alignItems: 'center',
  },
  innerContainer: {
    maxWidth: 600,
    width: '100%',
  },
  explanationSurface: {
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    elevation: 2,
    borderRadius: 8,
    width: '100%',
    justifyContent: 'center',
    minHeight: 100,
  },
  explanationText: {
    lineHeight: 24,
    textAlign: 'center',
  },
  equationSurface: {
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    elevation: 2,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  equation: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  answerSurface: {
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    elevation: 2,
    borderRadius: 8,
    width: '100%',
    justifyContent: 'center',
    minHeight: 80,
  },
  answerText: {
    lineHeight: 22,
    textAlign: 'center',
  },
  bottomArrowSurface: {
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    elevation: 2,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  bottomArrow: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  footer: {
    backgroundColor: COLORS.surface,
    paddingTop: SPACING.sm,
  },
  pageIndicator: {
    textAlign: 'center',
    color: COLORS.disabled,
    paddingVertical: SPACING.sm,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.md,
    paddingTop: 0,
  },
  buttonContainerLarge: {
    justifyContent: 'center',
  },
  button: {
    marginHorizontal: SPACING.lg,
  },
});
