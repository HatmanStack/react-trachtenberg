import AsyncStorage from '@react-native-async-storage/async-storage';
import { StateCreator } from 'zustand';

// Type-safe persistence middleware
export const persistMiddleware = <T,>(
  config: StateCreator<T>,
  options: { name: string; partialize?: (state: T) => Partial<T> }
): StateCreator<T> => {
  return (set, get, api) => {
    const { name, partialize = (state) => state } = options;

    // Load persisted state on initialization
    AsyncStorage.getItem(name).then((stored) => {
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          set(parsed as Partial<T>);
        } catch (error) {
          console.error('Failed to parse stored state:', error);
        }
      }
    }).catch((error) => {
      console.error('Failed to load persisted state:', error);
    });

    // Wrap set to persist on every change
    const persistentSet: typeof set = (partial, replace) => {
      set(partial, replace);
      const state = get();
      const toPersist = partialize(state);
      AsyncStorage.setItem(name, JSON.stringify(toPersist)).catch((error) => {
        console.error('Failed to persist state:', error);
      });
    };

    return config(persistentSet, get, api);
  };
};
