import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';
import { logger } from '../utils/logger';
import { COLORS, SPACING } from '../theme/constants';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error('ErrorBoundary caught error:', error);
    logger.error('Error info:', errorInfo.componentStack);
  }

  handleTryAgain = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Surface style={styles.surface}>
            <Text variant="headlineMedium" style={styles.title}>
              Something went wrong
            </Text>
            <Text variant="bodyMedium" style={styles.message}>
              An unexpected error occurred. Please try again.
            </Text>
            {__DEV__ && this.state.error && (
              <Text variant="bodySmall" style={styles.errorDetail}>
                {this.state.error.message}
              </Text>
            )}
            <Button
              mode="contained"
              onPress={this.handleTryAgain}
              style={styles.button}
            >
              Try Again
            </Button>
          </Surface>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  surface: {
    padding: SPACING.xl,
    borderRadius: 8,
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
  },
  title: {
    marginBottom: SPACING.md,
    textAlign: 'center',
    color: COLORS.accent,
  },
  message: {
    marginBottom: SPACING.lg,
    textAlign: 'center',
    color: COLORS.text,
  },
  errorDetail: {
    marginBottom: SPACING.lg,
    textAlign: 'center',
    color: COLORS.disabled,
    fontFamily: 'monospace',
  },
  button: {
    marginTop: SPACING.md,
  },
});
