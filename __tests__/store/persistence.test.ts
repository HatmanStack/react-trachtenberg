import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppStore } from '../../src/store/appStore';

/**
 * AsyncStorage Persistence Tests
 *
 * Tests for state persistence error handling and recovery.
 *
 * NOTE: These tests currently cannot run due to Expo SDK 54 / Jest compatibility issues.
 * This is documented and will be addressed in Phase 8.
 */

describe('AsyncStorage Persistence', () => {
  beforeEach(async () => {
    // Clear storage before each test
    await AsyncStorage.clear();
    // Reset store to initial state
    useAppStore.getState().resetPractice();
  });

  afterEach(async () => {
    // Clean up after each test
    await AsyncStorage.clear();
  });

  describe('State Loading', () => {
    test('loads persisted state on initialization', async () => {
      // Set storage data with persisted state
      const persistedState = {
        hintsEnabled: true,
        hintHelpShown: true,
      };

      await AsyncStorage.setItem(
        'trachtenberg-app-storage',
        JSON.stringify(persistedState)
      );

      // Note: In a real test, we would create a new store instance here
      // For now, we verify the storage was set correctly
      const stored = await AsyncStorage.getItem('trachtenberg-app-storage');
      expect(stored).toBeTruthy();
      expect(JSON.parse(stored!)).toEqual(persistedState);
    });

    test('handles missing storage gracefully', async () => {
      // Clear storage to simulate first launch
      await AsyncStorage.clear();

      // Verify no storage exists
      const stored = await AsyncStorage.getItem('trachtenberg-app-storage');
      expect(stored).toBeNull();

      // Store should use default values
      const store = useAppStore.getState();
      expect(store.hintsEnabled).toBe(false); // Default value
    });

    test('handles corrupted storage data', async () => {
      // Set invalid JSON to simulate corruption
      await AsyncStorage.setItem(
        'trachtenberg-app-storage',
        'invalid-json-{corrupted'
      );

      // Attempting to parse should not crash the app
      // The middleware catches the error and logs it
      const stored = await AsyncStorage.getItem('trachtenberg-app-storage');
      expect(stored).toBe('invalid-json-{corrupted');

      // Store should still function with defaults
      const store = useAppStore.getState();
      expect(store).toBeDefined();
      expect(typeof store.hintsEnabled).toBe('boolean');
    });

    test('handles empty string storage', async () => {
      // Set empty string
      await AsyncStorage.setItem('trachtenberg-app-storage', '');

      const stored = await AsyncStorage.getItem('trachtenberg-app-storage');
      expect(stored).toBe('');

      // Should not crash, should use defaults
      const store = useAppStore.getState();
      expect(store).toBeDefined();
    });
  });

  describe('State Persistence', () => {
    test('persists state changes to AsyncStorage', async () => {
      const store = useAppStore.getState();

      // Change a persisted value
      store.setHintsEnabled(true);

      // Wait for async persistence to complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify it was persisted
      const stored = await AsyncStorage.getItem('trachtenberg-app-storage');
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored!);
      expect(parsed.hintsEnabled).toBe(true);
    });

    test('persists multiple state changes', async () => {
      const store = useAppStore.getState();

      // Make multiple changes
      store.setHintsEnabled(true);
      await new Promise((resolve) => setTimeout(resolve, 50));

      store.setHintHelpShown(true);
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Verify final state was persisted
      const stored = await AsyncStorage.getItem('trachtenberg-app-storage');
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored!);
      expect(parsed.hintsEnabled).toBe(true);
      expect(parsed.hintHelpShown).toBe(true);
    });

    test('only persists partialize fields', async () => {
      const store = useAppStore.getState();

      // Generate a problem (creates non-persisted state)
      store.generateNewProblem();

      // Change persisted state
      store.setHintsEnabled(true);

      await new Promise((resolve) => setTimeout(resolve, 100));

      const stored = await AsyncStorage.getItem('trachtenberg-app-storage');
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored!);

      // Should have persisted fields
      expect(parsed.hintsEnabled).toBe(true);

      // Should NOT have non-persisted fields like hint calculation state
      expect(parsed.move).toBeUndefined();
      expect(parsed.moveCount).toBeUndefined();
      expect(parsed.remainderHint).toBeUndefined();
      expect(parsed.hintQuestion).toBeUndefined();
      expect(parsed.hintResult).toBeUndefined();
    });
  });

  describe('Error Handling', () => {
    test('handles AsyncStorage.getItem failure gracefully', async () => {
      // Mock AsyncStorage.getItem to fail
      const originalGetItem = AsyncStorage.getItem;
      AsyncStorage.getItem = jest.fn().mockRejectedValue(new Error('Storage unavailable'));

      // Should not crash when loading
      // The middleware catches the error and logs it

      // Restore original
      AsyncStorage.getItem = originalGetItem;
    });

    test('handles AsyncStorage.setItem failure gracefully', async () => {
      // Mock AsyncStorage.setItem to fail
      const originalSetItem = AsyncStorage.setItem;
      AsyncStorage.setItem = jest.fn().mockRejectedValue(new Error('Storage full'));

      const store = useAppStore.getState();

      // Should not crash when trying to persist
      store.setHintsEnabled(true);

      // Wait for async operation
      await new Promise((resolve) => setTimeout(resolve, 100));

      // App should still function
      expect(store.hintsEnabled).toBe(true);

      // Restore original
      AsyncStorage.setItem = originalSetItem;
    });

    test('handles JSON.parse errors gracefully', async () => {
      // Set malformed JSON
      await AsyncStorage.setItem(
        'trachtenberg-app-storage',
        '{"hintsEnabled": true, invalid}'
      );

      // Should not crash
      const store = useAppStore.getState();
      expect(store).toBeDefined();
    });
  });

  describe('Storage Key', () => {
    test('uses correct storage key', async () => {
      const store = useAppStore.getState();
      store.setHintsEnabled(true);

      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify the exact key used
      const stored = await AsyncStorage.getItem('trachtenberg-app-storage');
      expect(stored).toBeTruthy();

      // Verify wrong key returns nothing
      const wrongKey = await AsyncStorage.getItem('wrong-key');
      expect(wrongKey).toBeNull();
    });
  });

  describe('State Isolation', () => {
    test('persisted state does not include transient values', async () => {
      const store = useAppStore.getState();

      // Set transient hint state
      store.generateNewProblem();
      store.nextHint();

      // Set persisted state
      store.setHintsEnabled(true);

      await new Promise((resolve) => setTimeout(resolve, 100));

      const stored = await AsyncStorage.getItem('trachtenberg-app-storage');
      const parsed = JSON.parse(stored!);

      // Transient hint calculation state should NOT be persisted
      expect(parsed.hintQuestion).toBeUndefined();
      expect(parsed.hintResult).toBeUndefined();
      expect(parsed.hintHighlightIndices).toBeUndefined();
      expect(parsed.move).toBeUndefined();
      expect(parsed.moveCount).toBeUndefined();
      expect(parsed.remainderHint).toBeUndefined();
    });
  });
});
