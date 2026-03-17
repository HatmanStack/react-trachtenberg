# Changelog

## [Unreleased]

### Added

- Unmount cleanup on PracticeScreen to clear pending problem-generation timeout
- Input validation guard on `generateAnswerChoices` (correctDigit must be 0-9)
- Hint auto-initialization test for PracticeScreen
- `lint:docs` step in CI workflow (markdownlint)
- `.lintstagedrc.js` for lint-staged v16 compatibility (function form for `tsc --noEmit`)
- Husky pre-commit hooks with lint-staged
- Coverage thresholds enforced in CI (70% branches/functions, 80% lines/statements)
- `.nvmrc` pinning Node.js version
- Project structure section in README
- Markdown linting via markdownlint-cli2
- LearnScreen and PracticeScreen test suites
- Store failure-path and edge-case tests (carry propagation, timeout lifecycle)
- `hintHelpTimeoutRef` to track and cancel hint help setTimeout on unmount
- `hintInitRef` reset when hints are disabled (allows re-initialization on re-enable)
- ErrorBoundary integrated into Expo Router layout

### Changed

- Moved `_timeoutId` from Zustand store state to module-scoped variable (avoids serialization issues and unnecessary re-renders)
- Replaced `generateProblem()` retry loop with direct range generation (`MIN + random * (MAX - MIN)`)
- Replaced magic numbers in `isValidProblem` with imported constants
- Scoped `Animated.timing` mock in PracticeScreen tests to `beforeAll`/`afterAll`
- Made carry propagation tests deterministic with retry loops and explicit `isComplete` assertions
- Renamed vacuous hint enforcement test to reflect actual behavior (enforcement is in UI, not store)
- Pinned `jest` to `^29.7.0` and `@types/jest` to `^29.5.0` to align with jest-expo@54
- Fixed `handleAnswerPress` dependency array (removed stale `answerChoices`/`correctAnswerIndex`)
- Fixed SettingsScreen indentation inconsistency
- Updated SettingsScreen test `afterEach` to reset all fields matching `beforeEach`
- Updated README badge images with alt text (MD045 compliance)
- Fixed nested code fences in Phase-4 plan doc
- Fixed `deployment_target` in health-audit metadata to "Mobile (iOS/Android) + Expo Web"
- Updated Phase-1 plan to reflect completed status
- Archived `manual-validation.md` to `docs/manual-validation-archive.md` with redirect
- Fixed README: tutorial step count (21), navigation framework (Expo Router), clone path, removed false AsyncStorage claim
- Renamed package from `expo-project` to `react-trachtenberg`
- Fixed JSDoc move range from 0-23 to 0-32 in hint utilities

### Removed

- `firstCharRemainder` from store (vestigial, always 0)
- `newRemainder` from `ValidationResult` interface (dead field, always 0)
- `currentRemainder` parameter from `validateAnswer` (unused)
- `react-native-pager-view` and `react-native-tab-view` dependencies (unused)
- Dead navigation system (`src/navigation/`, `App.tsx`, navigation tests)
- Unused branded type system from `src/types/index.ts`
- Duplicate `PracticeProblem` interface from `problemGenerator.ts`
- Dead exports: `findCharIndices`, `getDigitsArray`, `FONT_SIZES`, `MAX_DIGIT_COUNT`
- Unused `LoadingIndicator` component
- Unused dependencies: `postcss-value-parser`, `@react-native-async-storage/async-storage`, `@react-navigation/*`
- Placeholder smoke test (`expect(true).toBe(true)`)
- Dead store actions: `resetPractice`, `resetHints`, `reset`
- `npm audit fix` from Phase-1 plan (violates subtractive-only rule)
- Stale Jest/Expo compatibility comment from SettingsScreen tests
- `bash -c` wrapper from lint-staged config (incompatible with v16)

### Fixed

- PracticeScreen cleanup on unmount (timeout fired after navigation away)
- Carry validator bug (store computed carry correctly but validator returned stale value)
- Render-path `logger.debug()` calls removed from PracticeScreen (performance)
- Fragile `move`/`hintQuestion` removed from useEffect deps
- Deterministic shuffle in `answerChoices` replacing retry loop
- Hardcoded step count replaced with `TUTORIAL_STEP_COUNT` constant
- Equation format mismatch (`*` vs `×`) in hint calculator
