# Phase 1 — [HYGIENIST] Dead Code Removal and Dependency Cleanup

Status: Completed

## Phase Goal

Remove all dead code, unused dependencies, and placeholder tests identified across the three audits. This is purely subtractive work — no new features, no logic changes, no behavior modifications. After this phase, the codebase should contain only code that is actually used.

**Success criteria:**
- All identified dead files, dead exports, and unused dependencies are removed
- All remaining tests pass (`npm test`)
- Linting passes (`npm run lint`)
- Type checking passes (`npx tsc --noEmit`)
- No behavioral changes to the running app

**Estimated tokens:** ~12,000

## Prerequisites

- Phase 0 read and understood
- `npm ci` run successfully
- Baseline test run passes: `npm test`

---

## Tasks

### Task 1: Remove Dead Navigation System and App.tsx — Completed

Removed the entire `src/navigation/` directory, `App.tsx`, skipped navigation tests, and the `@navigation` jest path alias. The app uses expo-router (`app/` directory) exclusively.

**Verification Checklist:**
- [x] `src/navigation/` directory no longer exists
- [x] `App.tsx` no longer exists
- [x] `__tests__/navigation/` directory no longer exists
- [x] `jest.config.js` has no `@navigation` alias
- [x] `npm test` passes
- [x] `npm run lint` passes
- [x] `npx tsc --noEmit` passes

---

### Task 2: Remove Unused Branded Types from src/types/index.ts — Completed

Removed the branded type system (`Brand`, `Digit`, `IndexPosition`, `MoveNumber`, `ButtonIndex`, all type guards, factory functions, `ValidationOutcome`, `AnswerChoicesTuple`) from `src/types/index.ts`. The file now contains only `TutorialStep`, `PracticeProblem`, and `AnswerChoice`.

**Verification Checklist:**
- [x] `src/types/index.ts` contains only `TutorialStep`, `PracticeProblem`, and `AnswerChoice`
- [x] No TypeScript compilation errors (`npx tsc --noEmit`)
- [x] `npm test` passes
- [x] `npm run lint` passes

---

### Task 3: Remove Duplicate PracticeProblem Interface — Completed

Removed the duplicate `PracticeProblem` interface from `src/utils/problemGenerator.ts`. It now imports from `../types`.

**Verification Checklist:**
- [x] `src/utils/problemGenerator.ts` imports `PracticeProblem` from `../types`
- [x] No local `PracticeProblem` definition remains in `problemGenerator.ts`
- [x] `npx tsc --noEmit` passes
- [x] `npm test` passes

---

### Task 4: Remove Dead Exports and Unused Functions — Completed

Removed `findCharIndices()` from `textHighlighter.ts`, `getDigitsArray()` from `answerChoices.ts`, `FONT_SIZES` and `MAX_DIGIT_COUNT` from `theme/constants.ts`, and deleted the unused `LoadingIndicator.tsx` component.

**Verification Checklist:**
- [x] `findCharIndices` no longer exists in `textHighlighter.ts`
- [x] `getDigitsArray` no longer exists in `answerChoices.ts`
- [x] `FONT_SIZES` and `MAX_DIGIT_COUNT` no longer exist in `constants.ts`
- [x] `LoadingIndicator.tsx` no longer exists
- [x] `npm test` passes
- [x] `npm run lint` passes
- [x] `npx tsc --noEmit` passes

---

### Task 5: Remove Unused Dependencies — Completed

Removed `postcss-value-parser`, `@react-native-async-storage/async-storage`, and `@react-navigation/*` packages from `package.json`.

> **Note:** Dependency vulnerability remediation (e.g., `npm audit fix`) is intentionally excluded from Phase 1. Vulnerability upgrades are non-deterministic and may introduce behavioral changes. These will be handled in a dedicated **Dependency Hardening** phase with explicit pinned versions and separate validation steps.

**Verification Checklist:**
- [x] `postcss-value-parser` not in `package.json`
- [x] `@react-native-async-storage/async-storage` not in `package.json`
- [x] `@react-navigation/*` packages not in `package.json`
- [x] `npm ci` installs successfully
- [x] `npm test` passes
- [x] `npm run lint` passes
- [x] `npx tsc --noEmit` passes

---

### Task 6: Remove Placeholder and Dead Tests — Completed

Deleted `__tests__/smoke.test.ts` (placeholder `expect(true).toBe(true)`). Kept `persistence.test.ts` as it tests real store behavior, not AsyncStorage.

**Verification Checklist:**
- [x] `__tests__/smoke.test.ts` no longer exists
- [x] Dead persistence tests removed (if applicable) — persistence.test.ts KEPT: tests real store behavior, not AsyncStorage
- [x] `npm test` passes
- [x] Test count decreased by the number of removed test files

---

## Phase Verification

All tasks verified complete:

1. Full verification suite passes: `npm test`, `npm run lint`, `npx tsc --noEmit`
2. Deleted files confirmed absent: `src/navigation/`, `App.tsx`, `src/components/LoadingIndicator.tsx`, `__tests__/navigation/`, `__tests__/smoke.test.ts`
3. `package.json` has no unused dependencies
4. `src/types/index.ts` contains only the three used interfaces

**Known limitations:** The `ErrorBoundary` component in `src/components/ErrorBoundary.tsx` is currently dead (was only used by the deleted `App.tsx`). It is intentionally kept for Phase 2 where it will be integrated into `app/_layout.tsx`.
