import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

interface AnswerButtonProps {
  value: number;
  onPress: () => void;
  disabled?: boolean;
}

/**
 * Answer button component for Practice mode multiple choice
 */
export const AnswerButton: React.FC<AnswerButtonProps> = React.memo(
  ({ value, onPress, disabled = false }) => {
    return (
      <Button
        mode="contained"
        onPress={onPress}
        disabled={disabled}
        style={styles.button}
        labelStyle={styles.label}
        contentStyle={styles.content}
      >
        {value}
      </Button>
    );
  }
);

AnswerButton.displayName = 'AnswerButton';

const styles = StyleSheet.create({
  button: {
    margin: 8,
    flex: 1,
    minHeight: 80,
    maxWidth: 150,
    minWidth: 100,
  },
  content: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
});
