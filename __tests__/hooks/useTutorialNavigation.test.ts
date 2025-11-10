import { renderHook, act } from '@testing-library/react-native';
import { useTutorialNavigation } from '../../src/hooks/useTutorialNavigation';
import { useAppStore } from '../../src/store/appStore';

describe('useTutorialNavigation', () => {
  beforeEach(() => {
    // Reset store to initial state
    act(() => {
      useAppStore.getState().setTutorialPage(0);
    });
  });

  test('initializes at page 0', () => {
    const { result } = renderHook(() => useTutorialNavigation());

    expect(result.current.currentPage).toBe(0);
    expect(result.current.isFirstPage).toBe(true);
    expect(result.current.isLastPage).toBe(false);
  });

  test('goNext increments page', () => {
    const { result } = renderHook(() => useTutorialNavigation());

    act(() => {
      result.current.goNext();
    });

    expect(result.current.currentPage).toBe(1);
    expect(result.current.isFirstPage).toBe(false);
  });

  test('goPrevious decrements page', () => {
    const { result } = renderHook(() => useTutorialNavigation());

    // Move to page 2
    act(() => {
      result.current.goNext();
      result.current.goNext();
    });

    expect(result.current.currentPage).toBe(2);

    // Go back
    act(() => {
      result.current.goPrevious();
    });

    expect(result.current.currentPage).toBe(1);
  });

  test('cannot go previous from first page', () => {
    const { result } = renderHook(() => useTutorialNavigation());

    act(() => {
      result.current.goPrevious();
    });

    expect(result.current.currentPage).toBe(0);
    expect(result.current.canGoPrevious).toBe(false);
  });

  test('cannot go next from last page', () => {
    // Set to last page (17)
    act(() => {
      useAppStore.getState().setTutorialPage(17);
    });

    const { result } = renderHook(() => useTutorialNavigation());

    expect(result.current.isLastPage).toBe(true);
    expect(result.current.canGoNext).toBe(false);

    act(() => {
      result.current.goNext();
    });

    expect(result.current.currentPage).toBe(17);
  });

  test('reset returns to page 0', () => {
    const { result } = renderHook(() => useTutorialNavigation());

    // Move forward
    act(() => {
      result.current.goNext();
      result.current.goNext();
      result.current.goNext();
    });

    expect(result.current.currentPage).toBe(3);

    // Reset
    act(() => {
      result.current.reset();
    });

    expect(result.current.currentPage).toBe(0);
    expect(result.current.isFirstPage).toBe(true);
  });

  test('totalPages is correct', () => {
    const { result } = renderHook(() => useTutorialNavigation());
    expect(result.current.totalPages).toBe(18);
  });
});
