import React, { useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, ScrollView, Animated } from 'react-native';
import { Surface, Text, Button, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useTutorialNavigation } from '../hooks/useTutorialNavigation';
import { tutorialSteps, TUTORIAL_EQUATION } from '../data/tutorialContent';
import { getTutorialHighlightIndices } from '../utils/tutorialHighlighter';
import { HighlightedText } from '../components/HighlightedText';
import { COLORS, SPACING } from '../theme/constants';

export default function LearnScreen() {
  const navigation = useNavigation();
  const {
    currentPage,
    goNext,
    goPrevious,
    isLastPage,
    canGoNext,
    canGoPrevious,
  } = useTutorialNavigation();

  const currentStep = tutorialSteps[currentPage];
  const highlightIndices = getTutorialHighlightIndices(currentStep.answer);

  // Animated value for page transitions
  const contentOpacity = useRef(new Animated.Value(1)).current;

  // Set up navigation header with Settings button
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="cog"
          size={24}
          onPress={() => navigation.navigate('Settings' as never)}
        />
      ),
    });
  }, [navigation]);

  // Animation for page transitions
  const changePage = useCallback((direction: 'next' | 'previous') => {
    // Fade out current content
    Animated.timing(contentOpacity, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      // Change page
      direction === 'next' ? goNext() : goPrevious();

      // Fade in new content
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  }, [contentOpacity, goNext, goPrevious]);

  const handleNext = useCallback(() => {
    if (isLastPage) {
      // Navigate to Practice screen on last page (no animation)
      navigation.navigate('Practice' as never);
    } else {
      changePage('next');
    }
  }, [isLastPage, navigation, changePage]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Animated.View style={{ opacity: contentOpacity }}>
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

          {/* Page Indicator */}
          <Text variant="bodySmall" style={styles.pageIndicator}>
            Step {currentPage + 1} of 18
          </Text>
        </Animated.View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => changePage('previous')}
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
  content: {
    padding: SPACING.md,
  },
  explanationSurface: {
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    elevation: 2,
    borderRadius: 8,
  },
  explanationText: {
    lineHeight: 24,
  },
  equationSurface: {
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    elevation: 2,
    borderRadius: 8,
    alignItems: 'center',
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
  },
  answerText: {
    lineHeight: 22,
  },
  bottomArrowSurface: {
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    elevation: 2,
    borderRadius: 8,
    alignItems: 'center',
  },
  bottomArrow: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  pageIndicator: {
    textAlign: 'center',
    marginTop: SPACING.sm,
    color: COLORS.disabled,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    elevation: 4,
  },
  button: {
    flex: 1,
    marginHorizontal: SPACING.sm,
  },
});
