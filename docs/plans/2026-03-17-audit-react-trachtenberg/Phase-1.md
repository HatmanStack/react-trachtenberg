# Phase 1 — [HYGIENIST] Dead Code Removal and Dependency Cleanup

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

### Task 1: Remove Dead Navigation System and App.tsx

**Goal:** Remove the entire `src/navigation/` directory and `App.tsx`, which are dead code from a superseded React Navigation setup. The app uses expo-router (`app/` directory) exclusively.

**Files to Delete:**
- `src/navigation/StackNavigator.tsx`
- `src/navigation/TabNavigator.tsx`
- `src/navigation/index.tsx`
- `src/navigation/linking.ts`
- `App.tsx`

**Files to Modify:**
- `__tests__/navigation/navigation.test.tsx` — Delete this file (tests a dead navigation system; entire suite is `describe.skip`)
- `jest.config.js` — Remove the `@navigation` path alias (line 15: `'^@navigation/(.*)$': '<rootDir>/src/navigation/$1'`)

**Prerequisites:** None

**Implementation Steps:**
1. Delete the 5 source files listed above
2. Delete `__tests__/navigation/navigation.test.tsx`
3. Remove the `@navigation` path alias from `jest.config.js` `moduleNameMapper`
4. Search the entire codebase for any remaining imports from `src/navigation/` or `App.tsx` — there should be none, but verify
5. Run verification checks

**Verification Checklist:**
- [ ] `src/navigation/` directory no longer exists
- [ ] `App.tsx` no longer exists
- [ ] `__tests__/navigation/` directory no longer exists
- [ ] `jest.config.js` has no `@navigation` alias
- [ ] `npm test` passes
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes
- [ ] App still loads via `npx expo start --web` (manual spot check)

**Commit Message Template:**
```
chore(navigation): remove dead React Navigation system and App.tsx

- Delete src/navigation/ (4 files), App.tsx, and skipped navigation tests
- Remove @navigation jest path alias
- App uses expo-router exclusively (app/ directory)
```

---

### Task 2: Remove Unused Branded Types from src/types/index.ts

**Goal:** Remove the branded type system (lines 22-89) that is defined but never imported or used anywhere. Keep `TutorialStep`, `PracticeProblem`, and `AnswerChoice` which are used.

**Files to Modify:**
- `src/types/index.ts` — Remove lines 21-89 (the `Brand` type, `Digit`, `IndexPosition`, `MoveNumber`, `ButtonIndex`, all type guards, all factory functions, `ValidationOutcome`, `AnswerChoicesTuple`)

**Prerequisites:** None

**Implementation Steps:**
1. Open `src/types/index.ts`
2. Verify that none of the branded types are imported anywhere by searching for: `Digit`, `IndexPosition`, `MoveNumber`, `ButtonIndex`, `isDigit`, `isIndexPosition`, `isMoveNumber`, `isButtonIndex`, `asDigit`, `asIndexPosition`, `asMoveNumber`, `asButtonIndex`, `ValidationOutcome`, `AnswerChoicesTuple`, `Brand`
3. Remove everything from the `// Branded types for type safety` comment (line 21) through end of file (line 89)
4. The file should retain only `TutorialStep`, `PracticeProblem`, and `AnswerChoice` interfaces
5. Run verification checks

**Verification Checklist:**
- [ ] `src/types/index.ts` contains only `TutorialStep`, `PracticeProblem`, and `AnswerChoice`
- [ ] No TypeScript compilation errors (`npx tsc --noEmit`)
- [ ] `npm test` passes
- [ ] `npm run lint` passes

**Commit Message Template:**
```
chore(types): remove unused branded type system

- Remove Digit, IndexPosition, MoveNumber, ButtonIndex branded types
- Remove associated type guards, factory functions, ValidationOutcome, AnswerChoicesTuple
- None of these types were imported anywhere in the codebase
```

---

### Task 3: Remove Duplicate PracticeProblem Interface

**Goal:** The `PracticeProblem` interface is defined identically in both `src/types/index.ts` and `src/utils/problemGenerator.ts`. Remove the duplicate from `problemGenerator.ts` and import from the canonical location.

**Files to Modify:**
- `src/utils/problemGenerator.ts` — Remove local `PracticeProblem` interface definition, add import from `../types`

**Prerequisites:** Task 2 complete (so `src/types/index.ts` is the clean canonical source)

**Implementation Steps:**
1. Open `src/utils/problemGenerator.ts` and locate the local `PracticeProblem` interface (lines 13-17)
2. Remove the local interface definition
3. Add `import { PracticeProblem } from '../types';` at the top of the file
4. Verify the interface fields match exactly (`firstNumber`, `secondNumber`, `answer` — all `number`)
5. Run verification checks

**Verification Checklist:**
- [ ] `src/utils/problemGenerator.ts` imports `PracticeProblem` from `../types`
- [ ] No local `PracticeProblem` definition remains in `problemGenerator.ts`
- [ ] `npx tsc --noEmit` passes
- [ ] `npm test` passes

**Commit Message Template:**
```
chore(types): deduplicate PracticeProblem interface

- Remove duplicate PracticeProblem from problemGenerator.ts
- Import from src/types/index.ts (single source of truth)
```

---

### Task 4: Remove Dead Exports and Unused Functions

**Goal:** Remove exported functions and constants that are never imported anywhere.

**Files to Modify:**
- `src/utils/textHighlighter.ts` — Remove `findCharIndices()` function (exported but never imported)
- `src/utils/answerChoices.ts` — Remove `getDigitsArray()` function (exported but never imported)
- `src/theme/constants.ts` — Remove `FONT_SIZES` and `MAX_DIGIT_COUNT` exports (never imported; `MAX_DIGIT_COUNT` duplicates `MAX_ANSWER_DIGITS` from `src/constants/algorithm.ts`)
- `src/components/LoadingIndicator.tsx` — Delete entire file (component never used)

**Prerequisites:** None

**Implementation Steps:**
1. For each function/constant listed, search the codebase to confirm it is not imported anywhere (search for the identifier name in all `.ts` and `.tsx` files, excluding the file where it is defined)
2. Remove `findCharIndices` from `src/utils/textHighlighter.ts`
3. Remove `getDigitsArray` from `src/utils/answerChoices.ts`
4. Remove `FONT_SIZES` and `MAX_DIGIT_COUNT` from `src/theme/constants.ts`
5. Delete `src/components/LoadingIndicator.tsx`
6. Check if any test files exclusively test the removed functions — if so, remove those tests too
7. Run verification checks

**Verification Checklist:**
- [ ] `findCharIndices` no longer exists in `textHighlighter.ts`
- [ ] `getDigitsArray` no longer exists in `answerChoices.ts`
- [ ] `FONT_SIZES` and `MAX_DIGIT_COUNT` no longer exist in `constants.ts`
- [ ] `LoadingIndicator.tsx` no longer exists
- [ ] `npm test` passes
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes

**Commit Message Template:**
```
chore: remove dead exports and unused components

- Remove findCharIndices() from textHighlighter.ts
- Remove getDigitsArray() from answerChoices.ts
- Remove FONT_SIZES and MAX_DIGIT_COUNT from theme/constants.ts
- Delete unused LoadingIndicator component
```

---

### Task 5: Remove Unused Dependencies

**Goal:** Remove npm packages that are installed but never used in the codebase.

**Files to Modify:**
- `package.json` — Remove `postcss-value-parser` from dependencies, remove `@react-native-async-storage/async-storage` from dependencies, remove `@react-navigation/material-top-tabs`, `@react-navigation/native`, `@react-navigation/stack` from dependencies (dead navigation system removed in Task 1)

**Prerequisites:** Task 1 complete (navigation code removed)

**Implementation Steps:**
1. Search the codebase for imports of each package to confirm they are unused:
   - `postcss-value-parser`: should have zero imports
   - `@react-native-async-storage/async-storage`: should have zero imports (README claims persistence but it is not implemented)
   - `@react-navigation/material-top-tabs`: should have zero imports after Task 1
   - `@react-navigation/native`: should have zero imports after Task 1
   - `@react-navigation/stack`: should have zero imports after Task 1
2. Remove all five packages from `package.json` dependencies
3. Run `npm install` to update `package-lock.json`
4. Also remove `@react-native-async-storage` from the `transformIgnorePatterns` in `jest.config.js` (line 6) — it is no longer needed
5. Run `npm audit fix` to address the 18 known vulnerabilities while we are modifying dependencies
6. Run verification checks

**Verification Checklist:**
- [ ] `postcss-value-parser` not in `package.json`
- [ ] `@react-native-async-storage/async-storage` not in `package.json`
- [ ] `@react-navigation/*` packages not in `package.json`
- [ ] `npm ci` installs successfully
- [ ] `npm test` passes
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes

**Commit Message Template:**
```
chore(deps): remove unused dependencies

- Remove postcss-value-parser (never imported)
- Remove @react-native-async-storage/async-storage (never used despite README claim)
- Remove @react-navigation/* packages (dead navigation system removed)
- Run npm audit fix for known vulnerabilities
```

---

### Task 6: Remove Placeholder and Dead Tests

**Goal:** Remove tests that provide no value: the placeholder smoke test and the dead persistence test.

**Files to Delete:**
- `__tests__/smoke.test.ts` — Contains only `expect(true).toBe(true)`

**Files to Modify:**
- `__tests__/store/persistence.test.ts` — Read this file first. If it tests AsyncStorage persistence that no longer exists (we removed the dependency in Task 5), delete it. If it tests actual store behavior, keep it.

**Prerequisites:** Task 5 complete

**Implementation Steps:**
1. Delete `__tests__/smoke.test.ts`
2. Read `__tests__/store/persistence.test.ts` and determine if it tests functionality that still exists
3. If the persistence test references `@react-native-async-storage/async-storage` or tests persistence behavior that does not exist, delete it
4. Run verification checks

**Verification Checklist:**
- [ ] `__tests__/smoke.test.ts` no longer exists
- [ ] Dead persistence tests removed (if applicable)
- [ ] `npm test` passes
- [ ] Test count decreased by the number of removed test files

**Commit Message Template:**
```
chore(test): remove placeholder and dead tests

- Remove smoke.test.ts (expect(true).toBe(true))
- Remove persistence.test.ts (tests non-existent AsyncStorage integration)
```

---

## Phase Verification

After all tasks are complete:

1. Run the full verification suite:
   ```bash
   npm test
   npm run lint
   npx tsc --noEmit
   ```
2. Verify the following directories/files no longer exist:
   - `src/navigation/`
   - `App.tsx`
   - `src/components/LoadingIndicator.tsx`
   - `__tests__/navigation/`
   - `__tests__/smoke.test.ts`
3. Verify `package.json` has no unused dependencies
4. Verify `src/types/index.ts` contains only the three used interfaces

**Known limitations:** The `ErrorBoundary` component in `src/components/ErrorBoundary.tsx` is currently dead (was only used by the deleted `App.tsx`). It is intentionally kept for Phase 2 where it will be integrated into `app/_layout.tsx`.
