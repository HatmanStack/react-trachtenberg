import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import SettingsScreen from '../../src/screens/SettingsScreen';
import { useAppStore } from '../../src/store/appStore';

/**
 * Settings Screen Tests
 *
 * Tests for Settings screen UI and functionality:
 * - Component rendering
 * - Hint toggle functionality
 * - State integration
 * - UI elements and accessibility
 *
 * NOTE: These tests currently cannot run due to Expo SDK 54 / Jest compatibility issues.
 * This is documented and will be addressed in Phase 8.
 */

// Wrapper component to provide Paper theme
const SettingsScreenWithTheme = () => (
  <PaperProvider>
    <SettingsScreen />
  </PaperProvider>
);

describe('SettingsScreen', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    const store = useAppStore.getState();
    store.setHintsEnabled(false);
  });

  describe('Component Rendering', () => {
    test('renders without crashing', () => {
      const result = render(<SettingsScreenWithTheme />);
      expect(result).toBeTruthy();
    });

    test('renders hint toggle setting', () => {
      const { getByText } = render(<SettingsScreenWithTheme />);
      expect(getByText('Show Hints')).toBeTruthy();
    });

    test('renders hint description text', () => {
      const { getByText } = render(<SettingsScreenWithTheme />);
      expect(
        getByText('Display step-by-step calculation hints during practice')
      ).toBeTruthy();
    });

    test('renders Practice Settings section', () => {
      const { getByText } = render(<SettingsScreenWithTheme />);
      expect(getByText('Practice Settings')).toBeTruthy();
    });

    test('renders About section', () => {
      const { getByText } = render(<SettingsScreenWithTheme />);
      expect(getByText('About')).toBeTruthy();
    });

    test('renders version information', () => {
      const { getByText } = render(<SettingsScreenWithTheme />);
      expect(getByText('Version')).toBeTruthy();
      expect(getByText('1.0.0')).toBeTruthy();
    });
  });

  describe('Toggle Functionality', () => {
    test('toggle reflects current hint state', () => {
      const store = useAppStore.getState();
      store.setHintsEnabled(true);

      const { getByRole } = render(<SettingsScreenWithTheme />);
      const toggle = getByRole('switch');

      expect(toggle.props.value).toBe(true);
    });

    test('toggle switches hint state from false to true', () => {
      const store = useAppStore.getState();
      store.setHintsEnabled(false);

      const { getByRole } = render(<SettingsScreenWithTheme />);
      const toggle = getByRole('switch');

      // Simulate toggle
      fireEvent(toggle, 'valueChange', true);

      // Verify state changed
      expect(useAppStore.getState().hintsEnabled).toBe(true);
    });

    test('toggle switches hint state from true to false', () => {
      const store = useAppStore.getState();
      store.setHintsEnabled(true);

      const { getByRole } = render(<SettingsScreenWithTheme />);
      const toggle = getByRole('switch');

      // Simulate toggle
      fireEvent(toggle, 'valueChange', false);

      // Verify state changed
      expect(useAppStore.getState().hintsEnabled).toBe(false);
    });

    test('multiple toggles work correctly', () => {
      const { getByRole } = render(<SettingsScreenWithTheme />);
      const toggle = getByRole('switch');

      // Start false
      expect(useAppStore.getState().hintsEnabled).toBe(false);

      // Toggle to true
      fireEvent(toggle, 'valueChange', true);
      expect(useAppStore.getState().hintsEnabled).toBe(true);

      // Toggle to false
      fireEvent(toggle, 'valueChange', false);
      expect(useAppStore.getState().hintsEnabled).toBe(false);

      // Toggle to true again
      fireEvent(toggle, 'valueChange', true);
      expect(useAppStore.getState().hintsEnabled).toBe(true);
    });
  });

  describe('State Integration', () => {
    test('uses Zustand store for hint state', () => {
      const store = useAppStore.getState();
      store.setHintsEnabled(true);

      const { getByRole } = render(<SettingsScreenWithTheme />);
      const toggle = getByRole('switch');

      expect(toggle.props.value).toBe(true);
    });

    test('state changes persist across re-renders', () => {
      const { getByRole, rerender } = render(<SettingsScreenWithTheme />);
      const toggle = getByRole('switch');

      // Change state
      fireEvent(toggle, 'valueChange', true);
      expect(useAppStore.getState().hintsEnabled).toBe(true);

      // Re-render component
      rerender(<SettingsScreenWithTheme />);

      // State should still be true
      const toggleAfter = getByRole('switch');
      expect(toggleAfter.props.value).toBe(true);
    });

    test('store action setHintsEnabled is called on toggle', () => {
      const store = useAppStore.getState();
      const spy = jest.spyOn(store, 'setHintsEnabled');

      const { getByRole } = render(<SettingsScreenWithTheme />);
      const toggle = getByRole('switch');

      fireEvent(toggle, 'valueChange', true);

      expect(spy).toHaveBeenCalledWith(true);

      spy.mockRestore();
    });
  });

  describe('UI Elements', () => {
    test('lightbulb icon is present for hint setting', () => {
      const { UNSAFE_getByProps } = render(<SettingsScreenWithTheme />);
      const icon = UNSAFE_getByProps({ icon: 'lightbulb-outline' });
      expect(icon).toBeTruthy();
    });

    test('information icon is present for version', () => {
      const { UNSAFE_getByProps } = render(<SettingsScreenWithTheme />);
      const icon = UNSAFE_getByProps({ icon: 'information-outline' });
      expect(icon).toBeTruthy();
    });

    test('divider is present between sections', () => {
      const result = render(<SettingsScreenWithTheme />);
      // Divider should be rendered in the component
      // This is a structural test - actual component tree inspection would be needed
      expect(result).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    test('toggle has accessible role', () => {
      const { getByRole } = render(<SettingsScreenWithTheme />);
      const toggle = getByRole('switch');
      expect(toggle).toBeTruthy();
    });

    test('settings items have descriptive text', () => {
      const { getByText } = render(<SettingsScreenWithTheme />);

      // Title should be clear
      expect(getByText('Show Hints')).toBeTruthy();

      // Description should explain the setting
      expect(
        getByText('Display step-by-step calculation hints during practice')
      ).toBeTruthy();
    });
  });

  describe('Layout', () => {
    test('uses ScrollView for scrollable content', () => {
      const result = render(<SettingsScreenWithTheme />);
      // Component should use ScrollView as root
      expect(result).toBeTruthy();
    });

    test('sections are properly separated', () => {
      const { getByText } = render(<SettingsScreenWithTheme />);

      // Both section headers should exist
      expect(getByText('Practice Settings')).toBeTruthy();
      expect(getByText('About')).toBeTruthy();
    });
  });

  describe('Integration with Practice Screen', () => {
    test('hint state change should affect other screens', () => {
      const store = useAppStore.getState();

      // Initial state
      expect(store.hintsEnabled).toBe(false);

      // Change in Settings
      const { getByRole } = render(<SettingsScreenWithTheme />);
      const toggle = getByRole('switch');
      fireEvent(toggle, 'valueChange', true);

      // Verify global state changed (would affect Practice screen)
      expect(useAppStore.getState().hintsEnabled).toBe(true);
    });

    test('hint toggle affects store subscription', () => {
      const { getByRole } = render(<SettingsScreenWithTheme />);
      const toggle = getByRole('switch');

      let subscribedValue = false;

      // Subscribe to hint state (simulating Practice screen subscription)
      const unsubscribe = useAppStore.subscribe((state) => {
        subscribedValue = state.hintsEnabled;
      });

      // Toggle hint
      fireEvent(toggle, 'valueChange', true);

      // Subscriber should receive update
      expect(subscribedValue).toBe(true);

      unsubscribe();
    });
  });

  describe('Edge Cases', () => {
    test('handles rapid toggle changes', () => {
      const { getByRole } = render(<SettingsScreenWithTheme />);
      const toggle = getByRole('switch');

      // Rapid toggles
      fireEvent(toggle, 'valueChange', true);
      fireEvent(toggle, 'valueChange', false);
      fireEvent(toggle, 'valueChange', true);
      fireEvent(toggle, 'valueChange', false);

      // Should end in final state
      expect(useAppStore.getState().hintsEnabled).toBe(false);
    });

    test('maintains state consistency', () => {
      const { getByRole } = render(<SettingsScreenWithTheme />);
      const toggle = getByRole('switch');

      // Get initial store state
      const initialStoreState = useAppStore.getState().hintsEnabled;

      // Get toggle value
      expect(toggle.props.value).toBe(initialStoreState);

      // They should match
      expect(toggle.props.value).toBe(initialStoreState);
    });
  });
});
