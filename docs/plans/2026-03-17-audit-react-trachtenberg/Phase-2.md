# Phase 2 — [IMPLEMENTER] Bug Fixes, Architecture, Performance, and Tests

**Goal:** Fix all identified bugs, performance issues, and architectural concerns. Fill test gaps. After this phase, the codebase should be correct, performant, and well-tested.

**Prerequisite:** Phase 1 complete (all dead code removed).

**Estimated tokens:** ~25,000

---

## Task 1: Integrate ErrorBoundary into Expo Router layout

**Why:** Per ADR-3, the `ErrorBoundary` component is correct and valuable but was only used by the now-deleted `App.tsx`. It needs to wrap the Expo Router tree so it actually catches errors.

**Files to modify:**
- `app/_layout.tsx` — Import `ErrorBoundary` from `../src/components/ErrorBoundary` and wrap the `PaperProvider` + `TabLayout` tree

**Implementation Steps:**
1. Import `ErrorBoundary` from `../src/components/ErrorBoundary`
2. In `RootLayout`, wrap the existing JSX with `<ErrorBoundary>...</ErrorBoundary>`
3. The resulting structure should be: `ErrorBoundary > PaperProvider > View > TabLayout`

**Verification:**
```bash
npm test && npm run lint && npx tsc --noEmit
```

**Commit:** `fix(navigation): integrate ErrorBoundary into Expo Router layout`

---

## Task 2: Fix module-scoped timeout lifecycle

**Why:** `src/store/appStore.ts:11` has a module-scoped `let problemCompleteTimeoutId` that holds a `setTimeout` reference outside React's lifecycle. There is no cleanup on navigation away, and in SSR/serverless contexts, this leaks across requests.

**Files to modify:**
- `src/store/appStore.ts` — Move `problemCompleteTimeoutId` inside the store state. Add a `clearPendingTimeout` action. Ensure `resetPractice` clears it.

**Implementation Steps:**
1. Remove the module-scoped `let problemCompleteTimeoutId` (line 11)
2. Add `_timeoutId: ReturnType<typeof setTimeout> | null` to the store state interface and initial value
3. In `submitAnswer`, replace `problemCompleteTimeoutId` references with `get()._timeoutId` and `set({ _timeoutId: ... })`
4. In `resetPractice`, clear the timeout via `get()._timeoutId`
5. Add a `clearPendingTimeout` action that components can call on unmount

**Verification:**
```bash
npm test && npm run lint && npx tsc --noEmit
```

**Commit:** `fix(store): move timeout lifecycle into Zustand store`

---

## Task 3: Replace stale Dimensions.get('window') with useWindowDimensions()

**Why:** `PracticeScreen.tsx:18-19` and `SettingsScreen.tsx:7-8` call `Dimensions.get('window')` at module scope, capturing the width once at import time. This produces stale layout on window resize, orientation change, or SSR. `LearnScreen.tsx` already correctly uses the `useWindowDimensions()` hook.

**Files to modify:**
- `src/screens/PracticeScreen.tsx` — Remove module-scoped `Dimensions.get('window')` and `isLargeScreen`. Add `useWindowDimensions()` inside the component. Derive `isLargeScreen` from the hook's `width`.
- `src/screens/SettingsScreen.tsx` — Same change.

**Implementation Steps (PracticeScreen):**
1. Remove `import { ... Dimensions } from 'react-native'` (keep other RN imports)
2. Add `useWindowDimensions` to the `react-native` import
3. Remove lines 18-19 (`const { width } = Dimensions.get('window')` and `const isLargeScreen = width > 768`)
4. Inside `PracticeScreen()`, add `const { width } = useWindowDimensions()` and `const isLargeScreen = width > 768`

**Implementation Steps (SettingsScreen):**
1. Replace `Dimensions` import with `useWindowDimensions`
2. Remove lines 7-8 (module-scoped width/isLargeScreen)
3. Inside `SettingsScreen()`, add `const { width } = useWindowDimensions()` and `const isLargeScreen = width > 768`

**Verification:**
```bash
npm test && npm run lint && npx tsc --noEmit
```

**Commit:** `fix(practice,settings): replace stale Dimensions.get with useWindowDimensions hook`

---

## Task 4: Remove render-path logger.debug() calls from PracticeScreen

**Why:** `PracticeScreen.tsx:50-52` has three `logger.debug()` calls that execute on every render, outside of any hook. These cause unnecessary GC pressure and the argument expressions are always evaluated even when logging is suppressed.

**Files to modify:**
- `src/screens/PracticeScreen.tsx` — Remove the three `logger.debug()` calls at lines 50-52 (the "Debug: Log hint state on render" block)

**Implementation Steps:**
1. Delete lines 49-52 (the comment and three logger.debug calls)
2. These are purely diagnostic calls that provide no runtime value

**Also fix:** `src/screens/LearnScreen.tsx:26` has a similar `logger.debug('LearnScreen render, ...')` call in the render body. Remove it too.

**Verification:**
```bash
npm test && npm run lint && npx tsc --noEmit
```

**Commit:** `perf(practice): remove render-path logger.debug calls`

---

## Task 5: Document the carry/remainder design (ADR-4)

**Why:** Per ADR-4, the `newRemainder = 0` in `answerValidator.ts:59` is intentional because the store at `appStore.ts:170` computes carry correctly via `Math.floor(state.remainderHint / 10)`. The validator's `newRemainder` output is overwritten. This needs a clear code comment so future developers understand the design.

**Files to modify:**
- `src/utils/answerValidator.ts` — Replace the misleading "placeholder" comment at line 57-58 with a clear explanation of the intentional design

**Implementation Steps:**
1. Replace lines 56-59:
   ```typescript
   // The carry value for the next digit is computed in appStore.ts via
   // Math.floor(state.remainderHint / 10), not here. The store overwrites
   // this value with the hint system's carry, so this field is unused for
   // carry purposes. See ADR-4 in Phase-0.md.
   const newRemainder = 0;
   ```

**Verification:**
```bash
npm test && npm run lint && npx tsc --noEmit
```

**Commit:** `docs(store): document carry/remainder design per ADR-4`

---

## Task 6: Replace hardcoded "21" with TUTORIAL_STEP_COUNT

**Why:** `LearnScreen.tsx:100` has `Step {currentPage + 1} of 21` with the total hardcoded. If tutorial steps are added or removed, this display will be wrong. The `TUTORIAL_STEP_COUNT` constant already exists and is used elsewhere.

**Files to modify:**
- `src/screens/LearnScreen.tsx` — Import `TUTORIAL_STEP_COUNT` (already imported via `useTutorialNavigation` but available from `../data/tutorialContent`). Replace `of 21` with `of ${TUTORIAL_STEP_COUNT}` or use the `totalPages` returned from `useTutorialNavigation`.

**Implementation Steps:**
1. In `LearnScreen.tsx`, the `useTutorialNavigation` hook already returns `totalPages: TUTORIAL_STEP_COUNT`
2. Destructure `totalPages` from the hook call (line 17-24)
3. Replace line 100: `Step {currentPage + 1} of 21` with `Step {currentPage + 1} of {totalPages}`

**Verification:**
```bash
npm test && npm run lint && npx tsc --noEmit
```

**Commit:** `fix(learn): replace hardcoded page count with TUTORIAL_STEP_COUNT`

---

## Task 7: Stabilize answer button callbacks

**Why:** `PracticeScreen.tsx:230-248` creates inline arrow functions `() => handleAnswerPress(N)` for each `AnswerButton`, creating new closures on every render and defeating `React.memo` on the button components.

**Files to modify:**
- `src/screens/PracticeScreen.tsx` — Create stable callback references for each button index

**Implementation Steps:**
1. Create four stable callbacks using `useCallback`:
   ```typescript
   const handlePress0 = useCallback(() => handleAnswerPress(0), [handleAnswerPress]);
   const handlePress1 = useCallback(() => handleAnswerPress(1), [handleAnswerPress]);
   const handlePress2 = useCallback(() => handleAnswerPress(2), [handleAnswerPress]);
   const handlePress3 = useCallback(() => handleAnswerPress(3), [handleAnswerPress]);
   ```
2. Replace `onPress={() => handleAnswerPress(N)}` with `onPress={handlePressN}` for each button

**Verification:**
```bash
npm test && npm run lint && npx tsc --noEmit
```

**Commit:** `perf(practice): stabilize AnswerButton callbacks to preserve React.memo`

---

## Task 8: Replace random retry loop with deterministic shuffle in answerChoices

**Why:** `answerChoices.ts:29-36` uses a random retry loop (up to 100 iterations) to find unique digits. A Fisher-Yates partial shuffle is O(1) and deterministic.

**Files to modify:**
- `src/utils/answerChoices.ts` — Replace the retry-loop approach with a deterministic method

**Implementation Steps:**
1. Replace the approach in `generateAnswerChoices`:
   - Create an array of digits 0-9
   - Remove the correct digit from the pool
   - Shuffle the pool (Fisher-Yates) and take the first 3
   - Place correct digit at `correctIndex` and fill remaining slots
2. Remove the `MAX_ITERATIONS` constant and the fallback logic
3. The result should be functionally identical: 4 unique digits with the correct one at a random position

**Verification:**
```bash
npm test && npm run lint && npx tsc --noEmit
```

**Commit:** `fix(practice): replace random retry loop with deterministic shuffle for answer choices`

---

## Task 9: Add store tests for carry behavior and timeout lifecycle

**Why:** The store's carry calculation at `appStore.ts:170` and the timeout lifecycle are critical paths with no direct test coverage. The carry behavior is particularly important because of ADR-4.

**Files to create:**
- `__tests__/store/appStore.test.ts`

**Tests to write:**
1. **Carry propagation:** Call `generateNewProblem()`, then exercise `submitAnswer()` across multiple digit positions. Verify that `remainderHint` is correctly propagated via `Math.floor(state.remainderHint / 10)`.
2. **Timeout lifecycle:** Call `submitAnswer()` with a completing answer, verify that `generateNewProblem` is called after `PROBLEM_COMPLETE_DELAY_MS`. Use `jest.useFakeTimers()`.
3. **resetPractice clears timeout:** Start a completion timeout, call `resetPractice()`, advance timers, verify no new problem was generated.
4. **generateNewProblem initializes hint state:** Call `generateNewProblem()` and verify `move`, `moveCount`, `hintQuestion`, `hintResult`, `hintHighlightIndices` are initialized.

**Verification:**
```bash
npm test && npm run lint && npx tsc --noEmit
```

**Commit:** `test(store): add tests for carry propagation and timeout lifecycle`

---

## Task 10: Add tests for PracticeScreen and LearnScreen behavior

**Why:** The two main screens have zero test coverage. We need at least basic rendering and interaction tests.

**Files to create:**
- `__tests__/screens/PracticeScreen.test.tsx`
- `__tests__/screens/LearnScreen.test.tsx`

**PracticeScreen tests:**
1. Renders equation display when store has a problem
2. Renders four answer buttons
3. Shows "Correct!" feedback on correct answer
4. Shows "Wrong" feedback on incorrect answer
5. Shows hint display when hints are enabled

**LearnScreen tests:**
1. Renders tutorial step content
2. Back button is disabled on first page
3. Next button advances to next step
4. Shows "Practice" label on last page button

**Note:** These tests will require mocking the Zustand store. Use the approach from Phase 0 Testing Strategy: create the store directly in tests.

**Verification:**
```bash
npm test && npm run lint && npx tsc --noEmit
```

**Commit:** `test(screens): add PracticeScreen and LearnScreen tests`

---

## Task 11: Add failure-path tests for utility functions

**Why:** Existing tests cover happy paths but no error/edge cases. The eval identified this as a gap.

**Files to modify (add tests to existing files):**
- `__tests__/utils/answerValidator.test.ts` — Add tests for: out-of-bounds `selectedIndex`, empty `currentAnswer`, `indexCount` exceeding answer length
- `__tests__/utils/answerChoices.test.ts` — Add tests for: `correctDigit` at boundaries (0, 9), verify all four choices are unique, verify correct digit is at `correctIndex`

**Files to create:**
- `__tests__/utils/problemGenerator.test.ts` — Test `generateProblem()` produces valid range, `formatEquation()` format, `formatEquationWithPadding()` with various indexCount values

**Verification:**
```bash
npm test && npm run lint && npx tsc --noEmit
```

**Commit:** `test(utils): add failure-path and edge-case tests for validators and generators`

---

## Phase 2 Completion Checklist

After all tasks, confirm:
- [ ] `ErrorBoundary` wraps the Expo Router tree in `app/_layout.tsx`
- [ ] No module-scoped mutable state in `appStore.ts`
- [ ] No `Dimensions.get('window')` at module scope in any screen
- [ ] No `logger.debug()` calls in render bodies
- [ ] `answerValidator.ts` has clear ADR-4 documentation comment
- [ ] `LearnScreen.tsx` uses `TUTORIAL_STEP_COUNT` (via `totalPages`)
- [ ] Answer buttons have stable callback references
- [ ] `answerChoices.ts` uses deterministic shuffle
- [ ] Store tests cover carry, timeout, and reset
- [ ] Screen tests exist for PracticeScreen and LearnScreen
- [ ] Utility edge-case tests added
- [ ] `npm test` passes
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes
