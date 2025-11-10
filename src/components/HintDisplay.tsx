import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { COLORS, SPACING } from '../theme/constants';

/**
 * HintDisplay Component
 *
 * Displays the current hint question and accumulated result.
 * Users can tap to advance to the next hint step.
 *
 * Based on Android's hint_question and hint_result TextViews
 * (PracticeActivity.java lines 83, 82)
 */

interface HintDisplayProps {
  question: string;      // Current multiplication question (e.g., "3 × 7")
  result: string;        // Accumulated result display (e.g., "1 + 2 + ")
  visible: boolean;      // Whether hints are enabled
  onPress: () => void;   // Handler for advancing hint
}

export const HintDisplay: React.FC<HintDisplayProps> = React.memo(
  ({ question, result, visible, onPress }) => {
    if (!visible) return null;

    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Surface style={styles.container} elevation={1}>
          <Text variant="titleMedium" style={styles.question}>
            {question || 'Touch to see hint'}
          </Text>
          {result && (
            <Text variant="bodyLarge" style={styles.result}>
              {result}
            </Text>
          )}
        </Surface>
      </TouchableOpacity>
    );
  }
);

HintDisplay.displayName = 'HintDisplay';

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
    margin: SPACING.sm,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  question: {
    color: COLORS.primary,
    marginBottom: SPACING.xs,
    fontWeight: '600',
  },
  result: {
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
});
