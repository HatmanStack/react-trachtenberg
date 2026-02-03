import { useAppStore } from '../store/appStore';
import { TUTORIAL_STEP_COUNT } from '../data/tutorialContent';
import { logger } from '../utils/logger';

/**
 * Custom hook for managing tutorial navigation
 * Replicates Android's learnPage and setLearnSteep() logic
 */
export const useTutorialNavigation = () => {
  const tutorialPage = useAppStore((state) => state.tutorialPage);
  const setTutorialPage = useAppStore((state) => state.setTutorialPage);

  const goNext = () => {
    logger.debug('goNext called, current page:', tutorialPage);
    if (tutorialPage < TUTORIAL_STEP_COUNT - 1) {
      const newPage = tutorialPage + 1;
      logger.debug('Setting tutorial page to:', newPage);
      setTutorialPage(newPage);
    }
  };

  const goPrevious = () => {
    logger.debug('goPrevious called, current page:', tutorialPage);
    if (tutorialPage > 0) {
      const newPage = tutorialPage - 1;
      logger.debug('Setting tutorial page to:', newPage);
      setTutorialPage(newPage);
    }
  };

  const reset = () => {
    setTutorialPage(0);
  };

  const isFirstPage = tutorialPage === 0;
  const isLastPage = tutorialPage === TUTORIAL_STEP_COUNT - 1;
  const canGoNext = tutorialPage < TUTORIAL_STEP_COUNT - 1;
  const canGoPrevious = tutorialPage > 0;

  return {
    currentPage: tutorialPage,
    goNext,
    goPrevious,
    reset,
    isFirstPage,
    isLastPage,
    canGoNext,
    canGoPrevious,
    totalPages: TUTORIAL_STEP_COUNT,
  };
};
