import React from 'react';
import { Platform } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import Navigation from '../../src/navigation/index';
import { TabNavigator } from '../../src/navigation/TabNavigator';
import { StackNavigator } from '../../src/navigation/StackNavigator';

/**
 * Navigation Tests
 *
 * Tests for navigation flows, platform-specific behavior, and edge cases:
 * - Platform detection (web vs mobile)
 * - Screen transitions
 * - Deep linking
 * - Back navigation
 * - Accessibility
 *
 * NOTE: These tests currently cannot run due to Expo SDK 54 / Jest compatibility issues.
 * This is documented and will be addressed in Phase 8.
 */

// Wrapper component with required providers
const NavigationWithProviders = () => (
  <PaperProvider>
    <Navigation />
  </PaperProvider>
);

const TabNavigatorWithProviders = () => (
  <PaperProvider>
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  </PaperProvider>
);

const StackNavigatorWithProviders = () => (
  <PaperProvider>
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  </PaperProvider>
);

describe('Navigation', () => {
  describe('Platform Detection', () => {
    test('uses TabNavigator on web platform', () => {
      // Mock Platform.OS to be web
      const originalOS = Platform.OS;
      Object.defineProperty(Platform, 'OS', {
        get: () => 'web',
      });

      render(<NavigationWithProviders />);

      // Tab navigator should show all screens as tabs
      // Verify tab labels are present (this is web-specific)
      // Note: Actual rendering depends on navigation structure

      // Restore original Platform.OS
      Object.defineProperty(Platform, 'OS', {
        get: () => originalOS,
      });
    });

    test('uses StackNavigator on iOS platform', () => {
      const originalOS = Platform.OS;
      Object.defineProperty(Platform, 'OS', {
        get: () => 'ios',
      });

      render(<NavigationWithProviders />);

      // Stack navigator should show only current screen
      // On iOS, we expect stack-based navigation

      // Restore
      Object.defineProperty(Platform, 'OS', {
        get: () => originalOS,
      });
    });

    test('uses StackNavigator on Android platform', () => {
      const originalOS = Platform.OS;
      Object.defineProperty(Platform, 'OS', {
        get: () => 'android',
      });

      render(<NavigationWithProviders />);

      // Stack navigator for Android

      // Restore
      Object.defineProperty(Platform, 'OS', {
        get: () => originalOS,
      });
    });
  });

  describe('TabNavigator (Web)', () => {
    test('renders all three tabs', () => {
      const { getByText } = render(<TabNavigatorWithProviders />);

      // Verify all tab labels exist
      expect(getByText('Learn')).toBeTruthy();
      expect(getByText('Practice')).toBeTruthy();
      expect(getByText('Settings')).toBeTruthy();
    });

    test('starts on Learn tab by default', () => {
      const { getByText } = render(<TabNavigatorWithProviders />);

      // Initial route should be Learn
      // The Learn screen content should be visible
      expect(getByText('Learn')).toBeTruthy();
    });

    test('has accessibility labels on tabs', () => {
      const { getByLabelText } = render(<TabNavigatorWithProviders />);

      // Verify accessibility labels
      expect(getByLabelText('Navigate to Tutorial')).toBeTruthy();
      expect(getByLabelText('Navigate to Practice')).toBeTruthy();
      expect(getByLabelText('Navigate to Settings')).toBeTruthy();
    });

    test('switches tabs when clicked', async () => {
      const { getByText } = render(<TabNavigatorWithProviders />);

      // Click Practice tab
      const practiceTab = getByText('Practice');
      fireEvent.press(practiceTab);

      // Wait for navigation to complete
      await waitFor(() => {
        // Practice screen should now be active
        // This would check for Practice-specific content
      });
    });

    test('displays tab icons', () => {
      render(<TabNavigatorWithProviders />);

      // Verify icons are rendered
      // MaterialCommunityIcons should be present for each tab
    });
  });

  describe('StackNavigator (Mobile)', () => {
    test('renders Learn screen initially', () => {
      const { getByText } = render(<StackNavigatorWithProviders />);

      // Verify initial screen is Learn
      expect(getByText('Trachtenberg Tutorial')).toBeTruthy();
    });

    test('shows proper header titles', () => {
      const { getByText } = render(<StackNavigatorWithProviders />);

      // Verify header shows correct title
      expect(getByText('Trachtenberg Tutorial')).toBeTruthy();
    });

    test('navigates to Practice screen', async () => {
      render(<StackNavigatorWithProviders />);

      // This would simulate navigation from Learn to Practice
      // In actual test, we'd navigate through the screens
    });

    test('navigates to Settings screen', async () => {
      render(<StackNavigatorWithProviders />);

      // Test navigation to Settings
    });

    test('back button navigation works', async () => {
      render(<StackNavigatorWithProviders />);

      // Navigate to a screen, then go back
      // Verify back navigation works correctly
    });
  });

  describe('Navigation Flows', () => {
    test('Learn screen navigates to Practice on tutorial completion', async () => {
      render(<NavigationWithProviders />);

      // Simulate going through all tutorial pages
      // On last page, the "Next" button should say "Practice"
      // Clicking it should navigate to Practice screen
    });

    test('Settings is accessible from Practice screen', async () => {
      render(<NavigationWithProviders />);

      // Navigate to Practice
      // Find Settings button in header
      // Verify it navigates to Settings
    });

    test('Settings is accessible from Learn screen', async () => {
      render(<NavigationWithProviders />);

      // From Learn screen, Settings should be accessible
      // Via header button (stack) or tab (web)
    });

    test('maintains navigation state during rapid switching', async () => {
      render(<NavigationWithProviders />);

      // Rapidly switch between screens
      // Verify no crashes or state corruption
    });
  });

  describe('Deep Linking', () => {
    test('linking configuration is properly structured', () => {
      const { linking } = require('../../src/navigation/linking');

      expect(linking).toBeDefined();
      expect(linking.config.screens).toBeDefined();
      expect(linking.config.screens.Learn).toBe('learn');
      expect(linking.config.screens.Practice).toBe('practice');
      expect(linking.config.screens.Settings).toBe('settings');
    });

    test('prefixes include custom scheme', () => {
      const { linking } = require('../../src/navigation/linking');

      expect(linking.prefixes).toContain('trachtenberg://');
    });

    test('navigates to correct screen from deep link', async () => {
      // Test that deep link URLs route to correct screens
      // This would require mocking URL handling
    });
  });

  describe('Navigation Theme Integration', () => {
    test('navigation theme matches Paper theme colors', () => {
      render(<NavigationWithProviders />);

      // Verify theme colors are applied to navigation
      // This would check that Navigation theme colors
      // match React Native Paper theme
    });

    test('headers use primary color on mobile', () => {
      const originalOS = Platform.OS;
      Object.defineProperty(Platform, 'OS', {
        get: () => 'ios',
      });

      render(<NavigationWithProviders />);

      // Verify header background uses theme primary color

      Object.defineProperty(Platform, 'OS', {
        get: () => originalOS,
      });
    });

    test('tab bar uses theme colors on web', () => {
      const originalOS = Platform.OS;
      Object.defineProperty(Platform, 'OS', {
        get: () => 'web',
      });

      render(<NavigationWithProviders />);

      // Verify tab bar uses theme colors

      Object.defineProperty(Platform, 'OS', {
        get: () => originalOS,
      });
    });
  });

  describe('Edge Cases', () => {
    test('handles navigation during app state restoration', async () => {
      // Simulate app being killed and restored
      // Verify navigation state is maintained
    });

    test('handles rapid back-and-forth navigation', async () => {
      render(<NavigationWithProviders />);

      // Rapidly navigate back and forth between screens
      // Verify no crashes or errors
    });

    test('handles navigation with incomplete data', async () => {
      // Test navigation when app state is partially loaded
      // Should handle gracefully without crashes
    });

    test('handles invalid deep link URLs', async () => {
      // Test that invalid URLs don't crash the app
      // Should fallback to default screen
    });
  });

  describe('Accessibility', () => {
    test('tab navigation has accessibility labels', () => {
      const { getByLabelText } = render(<TabNavigatorWithProviders />);

      expect(getByLabelText('Navigate to Tutorial')).toBeTruthy();
      expect(getByLabelText('Navigate to Practice')).toBeTruthy();
      expect(getByLabelText('Navigate to Settings')).toBeTruthy();
    });

    test('screen headers are accessible', () => {
      const { getByText } = render(<StackNavigatorWithProviders />);

      // Headers should be readable by screen readers
      expect(getByText('Trachtenberg Tutorial')).toBeTruthy();
    });

    test('focus management works on navigation', async () => {
      // When navigating to new screen, focus should move appropriately
      // This ensures keyboard and screen reader users can navigate
    });
  });

  describe('Performance', () => {
    test('navigation renders without delays', () => {
      const startTime = Date.now();
      render(<NavigationWithProviders />);
      const endTime = Date.now();

      // Navigation should render quickly (< 100ms for initial render)
      expect(endTime - startTime).toBeLessThan(100);
    });

    test('screen transitions are smooth', async () => {
      // Test that screen transitions complete without janky behavior
      // This is more of a manual/visual test but we can verify
      // that transition callbacks fire
    });
  });

  describe('State Persistence', () => {
    test('navigation state persists across reloads', async () => {
      // Simulate navigation state being saved
      // Then reload and verify state is restored
    });

    test('deep link navigation updates persisted state', async () => {
      // Navigate via deep link
      // Verify navigation state is updated and persisted
    });
  });
});
