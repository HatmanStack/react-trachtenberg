# Phase 2 — [IMPLEMENTER] Bug Fixes, Performance, Architecture, and Tests

## Phase Goal

Fix all correctness bugs, performance issues, and architecture concerns identified across the three audits, then close critical test gaps. This phase modifies behavior — every change must be verified against the existing test suite and new tests must be added where coverage is missing.

**Success criteria:**
- All identified bugs and performance issues are fixed
- ErrorBoundary is integrated into the live Expo Router layout
- Module-scoped timeout is moved into the store
- Duplicate PracticeProblem interface is consolidated
- Screen-level and store failure-path tests are added
- Placeholder smoke test and skipped navigation tests are removed (if not already handled in Phase 1)
- All tests pass (`npm test`)
- Linting passes (`npm run lint`)
- Type checking passes (`npx tsc --noEmit`)

**Estimated tokens:** ~25,000

## Prerequisites

- Phase 0 read and understood
- Phase 1 complete (dead code removed, dependencies cleaned)
- `npm ci` run successfully
- Baseline test run passes: `npm test`

---

## Tasks

### Task 1: Document Intentional Carry Design in answerValidator.ts

**Goal:** Per ADR-4 in Phase 0, the hardcoded `newRemainder = 0` in `answerValidator.ts:59` is intentional because the store computes carry correctly at `appStore.ts:170` via `Math.floor(state.remainderHint / 10)`. Replace the misleading "placeholder" comment with a clear design explanation and add a test verifying the store's carry behavior.

**Files to Modify:**
- `src/utils/answerValidator.ts` — Replace lines 56-59 (the "placeholder" comment block) with an accurate comment referencing ADR-4

**Files to Create:**
- `__tests__/store/appStore.test.ts` — Add a test case verifying carry propagation through the store's `submitAnswer` action (create file if it does not already exist)

**Prerequisites:** None

**Implementation Steps:**
1. Open `src/utils/answerValidator.ts` and locate lines 56-59
2. Replace the two comments ("Full calculation will be implemented in Phase 4 with hint system" and "For now, this is a placeholder") with:
   ```typescript
   // The carry value for the next digit is computed by the store via
   // Math.floor(state.remainderHint / 10) in appStore.ts, not here.
   // The store overwrites this field with the hint system's carry value.
   // This is an intentional design choice — see ADR-4 in Phase-0.md.
   ```
3. Open or create `__tests__/store/appStore.test.ts`
4. Add a test that creates a store instance, generates a problem requiring carry propagation, and verifies the carry value is correctly computed after `submitAnswer`
5. Run verification checks

**Verification Checklist:**
- [ ] The "placeholder" comment is replaced with an accurate design explanation referencing ADR-4
- [ ] A test verifies carry propagation in the store
- [ ] `npm test` passes
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes

**Testing Instructions:**
```bash
npm test -- --testPathPattern="store/appStore"
```

**Commit Message Template:**
```
fix(hints): document intentional carry design in answerValidator

- Replace misleading "placeholder" comment with ADR-4 design explanation
- Add test verifying store carry propagation via remainderHint
```

---

### Task 2: Replace Dimensions.get('window') with useWindowDimensions()

**Goal:** Replace stale module-scope `Dimensions.get('window')` calls in PracticeScreen and SettingsScreen with the reactive `useWindowDimensions()` hook. This matches the pattern already used correctly in `LearnScreen.tsx` and `app/_layout.tsx`.

**Files to Modify:**
- `src/screens/PracticeScreen.tsx` — Remove lines 18-19 (module-scope `const { width } = Dimensions.get('window')` and `const isLargeScreen = width > 768`), replace `Dimensions` import with `useWindowDimensions`, compute `isLargeScreen` inside the component body
- `src/screens/SettingsScreen.tsx` — Remove lines 7-8 (same pattern), replace `Dimensions` import with `useWindowDimensions`, compute `isLargeScreen` inside the component body

**Prerequisites:** None

**Implementation Steps:**
1. Open `src/screens/PracticeScreen.tsx`
2. Remove `Dimensions` from the `react-native` import (keep other imports: `StyleSheet`, `View`, `ScrollView`, `Alert`, `Animated`)
3. Add `useWindowDimensions` to the `react-native` import
4. Remove lines 18-19 (module-scope width and isLargeScreen)
5. Inside the `PracticeScreen` component body (after existing hook calls), add:
   ```typescript
   const { width } = useWindowDimensions();
   const isLargeScreen = width > 768;
   ```
6. Open `src/screens/SettingsScreen.tsx`
7. Replace `Dimensions` with `useWindowDimensions` in the `react-native` import
8. Remove lines 7-8 (module-scope width and isLargeScreen)
9. Inside the `SettingsScreen` component body, add the same two lines
10. Run verification checks

**Verification Checklist:**
- [ ] No `Dimensions.get('window')` calls remain in PracticeScreen or SettingsScreen
- [ ] Both screens use `useWindowDimensions()` inside the component body
- [ ] `isLargeScreen` is computed reactively on every render
- [ ] `npm test` passes
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes

**Testing Instructions:**
```bash
npx tsc --noEmit
npm test
```

**Commit Message Template:**
```
perf(practice,settings): replace stale Dimensions.get with useWindowDimensions

- PracticeScreen and SettingsScreen now use useWindowDimensions() hook
- Layout responds to window resize and orientation changes
- Matches pattern already used in LearnScreen and _layout.tsx
```

---

### Task 3: Remove Render-Path logger.debug() Calls from PracticeScreen

**Goal:** Remove the three `logger.debug()` calls at `PracticeScreen.tsx:50-52` that execute on every render outside of any hook. These create GC pressure because argument expressions are always evaluated even when logging is suppressed.

**Files to Modify:**
- `src/screens/PracticeScreen.tsx` — Remove lines 49-52 (the "Debug: Log hint state on render" comment and three `logger.debug(...)` calls)

**Prerequisites:** None

**Implementation Steps:**
1. Open `src/screens/PracticeScreen.tsx`
2. Remove line 49 (comment: `// Debug: Log hint state on render`)
3. Remove lines 50-52 (the three `logger.debug('PracticeScreen render - ...')` calls)
4. Also check `src/screens/LearnScreen.tsx` for any similar render-path logger calls (e.g., line 26) and remove them if found
5. Verify that logger calls inside `useEffect`, `useCallback`, and event handlers are preserved (those are acceptable)
6. Run verification checks

**Verification Checklist:**
- [ ] No `logger.debug()` calls remain in the render body of PracticeScreen (outside hooks/callbacks)
- [ ] Logger calls inside `useEffect`, `useCallback`, and event handlers are preserved
- [ ] `npm test` passes
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes

**Testing Instructions:**
```bash
npm test
```

**Commit Message Template:**
```
perf(practice): remove render-path logger.debug() calls

- Remove 3 logger.debug() calls that executed on every render
- Reduces GC pressure and unnecessary argument evaluation
- Logger calls inside hooks and callbacks are preserved
```

---

### Task 4: Fix useEffect Dependency Array in PracticeScreen

**Goal:** The `useEffect` at `PracticeScreen.tsx:100-110` includes `move` and `hintQuestion` in its dependency array. These values change on every hint step, causing the effect to re-trigger on each step even though it only needs to run when a new equation loads. Refactor to separate hint initialization from hint state reactions.

**Files to Modify:**
- `src/screens/PracticeScreen.tsx` — Refactor the `useEffect` at lines 100-110 to use a ref for tracking initialization state, removing `move` and `hintQuestion` from the dependency array

**Prerequisites:** None

**Implementation Steps:**
1. Open `src/screens/PracticeScreen.tsx` and examine the `useEffect` at lines 100-110
2. The effect's purpose is: when a new equation loads with hints enabled, show hints and call `nextHint()` once to initialize the first hint step
3. The guard `if (move === 0 && hintQuestion === '')` prevents repeated calls, but including `move` and `hintQuestion` in the dependency array causes the effect to re-run on every hint step
4. Add a `useRef<string | null>(null)` to track whether initialization has been done for the current equation
5. In the effect body, check `if (hintInitRef.current === currentEquation) return;` to skip if already initialized for this equation
6. Set `hintInitRef.current = currentEquation;` after calling `showHints()` and `nextHint()`
7. Remove `move` and `hintQuestion` from the dependency array
8. The final dependency array should be: `[currentEquation, hintsEnabled, showHints, nextHint]`
9. Run verification checks

**Verification Checklist:**
- [ ] `useEffect` dependency array no longer includes `move` or `hintQuestion`
- [ ] First hint still initializes correctly when a new problem loads
- [ ] Hint stepping still works correctly via the hint button
- [ ] No ESLint exhaustive-deps warnings (the ref replaces the state-based guard)
- [ ] `npm test` passes
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes

**Testing Instructions:**
```bash
npm test
# Manual: start app, enable hints, verify first hint appears on new problem
# Manual: press hint button repeatedly, verify hints advance correctly
```

**Commit Message Template:**
```
fix(practice): remove fragile move/hintQuestion from useEffect deps

- Use ref to track hint initialization instead of state guards
- Prevents redundant effect re-executions on every hint step
- Dependency array now: [currentEquation, hintsEnabled, showHints, nextHint]
```

---

### Task 5: Fix Inline Arrow Functions Defeating React.memo on AnswerButton

**Goal:** The four `AnswerButton` components in PracticeScreen (lines 230-248) use inline `() => handleAnswerPress(N)` closures, creating new function references on every render and defeating `React.memo` on the AnswerButton component.

**Files to Modify:**
- `src/screens/PracticeScreen.tsx` — Replace inline arrow functions with stable `useCallback`-wrapped handlers

**Prerequisites:** None

**Implementation Steps:**
1. Open `src/screens/PracticeScreen.tsx` and locate lines 230-248
2. Verify that `handleAnswerPress` is already wrapped in `useCallback` (it should be)
3. Create four stable callback references before the JSX return:
   ```typescript
   const handlePress0 = useCallback(() => handleAnswerPress(0), [handleAnswerPress]);
   const handlePress1 = useCallback(() => handleAnswerPress(1), [handleAnswerPress]);
   const handlePress2 = useCallback(() => handleAnswerPress(2), [handleAnswerPress]);
   const handlePress3 = useCallback(() => handleAnswerPress(3), [handleAnswerPress]);
   ```
4. Replace each `onPress={() => handleAnswerPress(N)}` with `onPress={handlePressN}`
5. Run verification checks

**Verification Checklist:**
- [ ] No inline arrow functions in `AnswerButton` `onPress` props
- [ ] All four callbacks are stable references via `useCallback`
- [ ] `React.memo` on `AnswerButton` component is now effective
- [ ] `npm test` passes
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes

**Testing Instructions:**
```bash
npm test
# Manual: practice mode still responds correctly to button presses
```

**Commit Message Template:**
```
perf(practice): stabilize AnswerButton onPress callbacks

- Replace inline arrow functions with useCallback-wrapped handlers
- React.memo on AnswerButton now prevents unnecessary re-renders
```

---

### Task 6: Replace Random Retry Loop in answerChoices.ts with Deterministic Shuffle

**Goal:** Replace the random retry loop (up to 100 iterations with fallback) in `generateAnswerChoices` with a deterministic Fisher-Yates approach: create a pool of digits 0-9 excluding the correct digit, shuffle, and take the first 3.

**Files to Modify:**
- `src/utils/answerChoices.ts` — Rewrite the fill loop (lines 26-49) to use a deterministic selection from a shuffled pool of available digits

**Prerequisites:** None

**Implementation Steps:**
1. Open `src/utils/answerChoices.ts`
2. Replace the retry-based fill loop (lines 22-49) with:
   - Create an array of digits 0-9 excluding `correctDigit`: `const pool = Array.from({length: 10}, (_, i) => i).filter(d => d !== correctDigit);`
   - Perform a Fisher-Yates shuffle on the pool (or a partial shuffle selecting 3 elements)
   - Take the first 3 elements from the shuffled pool
   - Place them in the remaining 3 positions of the `choices` array
3. Remove the `MAX_ITERATIONS` constant if it is no longer used anywhere else (search the codebase first)
4. Remove the `logger` import if no longer needed
5. Run verification checks

**Verification Checklist:**
- [ ] No retry loop exists in `generateAnswerChoices`
- [ ] Algorithm is deterministic — no unbounded loops, no fallback path
- [ ] All 4 returned choices are guaranteed unique
- [ ] Correct digit is at `correctIndex`
- [ ] `npm test` passes
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes

**Testing Instructions:**
```bash
npm test -- --testPathPattern="answerChoices"
```

**Commit Message Template:**
```
fix(practice): replace retry loop with deterministic shuffle in answerChoices

- Use Fisher-Yates selection instead of random retry (up to 100 iterations)
- Guarantees unique choices in O(1) without fallback paths
```

---

### Task 7: Replace Hardcoded "21" in LearnScreen with TUTORIAL_STEP_COUNT

**Goal:** The step indicator at `LearnScreen.tsx:100` says `Step {currentPage + 1} of 21` with a hardcoded literal. Replace with the `TUTORIAL_STEP_COUNT` constant or the `totalPages` value from `useTutorialNavigation`.

**Files to Modify:**
- `src/screens/LearnScreen.tsx` — Replace the hardcoded `21` in the step indicator text

**Prerequisites:** None

**Implementation Steps:**
1. Open `src/screens/LearnScreen.tsx`
2. Check if `useTutorialNavigation` hook (line 5) returns a `totalPages` property — if so, destructure it from the hook call at lines 17-24
3. If `totalPages` is available: replace `of 21` at line 100 with `of {totalPages}`
4. If `totalPages` is not available from the hook: add `TUTORIAL_STEP_COUNT` to the existing import from `../data/tutorialContent` (line 6) and replace `of 21` with `of {TUTORIAL_STEP_COUNT}`
5. Run verification checks

**Verification Checklist:**
- [ ] No hardcoded `21` in the step indicator
- [ ] Step count is derived from a constant or hook return value
- [ ] `npm test` passes
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes

**Testing Instructions:**
```bash
npm test
# Manual: open Learn tab, verify step indicator shows correct count
```

**Commit Message Template:**
```
fix(learn): replace hardcoded step count with TUTORIAL_STEP_COUNT

- Step indicator now uses constant instead of hardcoded "21"
- Prevents display drift if tutorial steps are added or removed
```

---

### Task 8: Consolidate Duplicate PracticeProblem Interface

**Goal:** The `PracticeProblem` interface is defined identically in both `src/types/index.ts` and `src/utils/problemGenerator.ts`. Remove the duplicate from `problemGenerator.ts` and import from the canonical location.

**Files to Modify:**
- `src/utils/problemGenerator.ts` — Remove local `PracticeProblem` interface definition (lines 13-17), add import from `../types`

**Prerequisites:** Phase 1 Task 2 complete (branded types removed, so `src/types/index.ts` is the clean canonical source)

**Implementation Steps:**
1. Open `src/utils/problemGenerator.ts` and locate the local `PracticeProblem` interface (lines 13-17)
2. Open `src/types/index.ts` and verify the canonical `PracticeProblem` has the same fields: `firstNumber: number`, `secondNumber: number`, `answer: number`
3. Remove the local interface definition from `problemGenerator.ts`
4. Add `import { PracticeProblem } from '../types';` at the top of the file
5. Verify all usages of `PracticeProblem` in the file still compile
6. Run verification checks

**Verification Checklist:**
- [ ] No local `PracticeProblem` definition remains in `problemGenerator.ts`
- [ ] `PracticeProblem` is imported from `../types`
- [ ] Interface fields match exactly
- [ ] `npx tsc --noEmit` passes
- [ ] `npm test` passes
- [ ] `npm run lint` passes

**Testing Instructions:**
```bash
npx tsc --noEmit
npm test
```

**Commit Message Template:**
```
chore(types): deduplicate PracticeProblem interface

- Remove duplicate PracticeProblem from problemGenerator.ts
- Import from src/types/index.ts (single source of truth)
```

---

### Task 9: Move Module-Scoped Timeout into Store

**Goal:** The module-scoped `let problemCompleteTimeoutId` at `appStore.ts:10-11` holds a `setTimeout` reference outside React's lifecycle with no cleanup on unmount or navigation. Move the timeout management inside the store.

**Files to Modify:**
- `src/store/appStore.ts` — Remove module-scoped `let problemCompleteTimeoutId` (lines 10-11), add timeout ID to store state, add a `cleanup` action

**Prerequisites:** None

**Implementation Steps:**
1. Open `src/store/appStore.ts`
2. Add `_timeoutId: ReturnType<typeof setTimeout> | null` to the `AppState` interface (initialized as `null`)
3. Remove the module-scoped `let problemCompleteTimeoutId: ReturnType<typeof setTimeout> | null = null;` declaration (lines 10-11)
4. In the `submitAnswer` action, replace the `clearTimeout(problemCompleteTimeoutId)` with `clearTimeout(get()._timeoutId)`
5. Replace the `problemCompleteTimeoutId = setTimeout(...)` with `set({ _timeoutId: setTimeout(...) })`
6. Add a `cleanup` action:
   ```typescript
   cleanup: () => {
     const id = get()._timeoutId;
     if (id) clearTimeout(id);
     set({ _timeoutId: null });
   },
   ```
7. If `resetPractice` exists, ensure it also calls `get().cleanup()` or clears the timeout directly
8. Run verification checks

**Verification Checklist:**
- [ ] No module-scoped `let problemCompleteTimeoutId` exists in `appStore.ts`
- [ ] Timeout ID is managed within the store state
- [ ] A `cleanup` action exists that clears the timeout and resets the ID
- [ ] `npm test` passes
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes

**Testing Instructions:**
```bash
npm test -- --testPathPattern="store"
# Manual: complete a practice problem, navigate away before timeout fires, verify no console errors
```

**Commit Message Template:**
```
fix(store): move module-scoped timeout into store state

- problemCompleteTimeoutId now lives in store instead of module scope
- Add cleanup action for timeout lifecycle management
- Prevents stale timer references across navigation and SSR
```

---

### Task 10: Add ErrorBoundary to Expo Router Layout

**Goal:** Per ADR-3 in Phase 0, the `ErrorBoundary` component in `src/components/ErrorBoundary.tsx` was only used by the now-deleted `App.tsx`. Integrate it into the live `app/_layout.tsx` so it actually catches React errors.

**Files to Modify:**
- `app/_layout.tsx` — Import `ErrorBoundary` from `../src/components/ErrorBoundary` and wrap the app tree

**Prerequisites:** Phase 1 Task 1 complete (`App.tsx` deleted, but `ErrorBoundary` component preserved)

**Implementation Steps:**
1. Open `app/_layout.tsx`
2. Add import: `import { ErrorBoundary } from '../src/components/ErrorBoundary';`
3. In the `RootLayout` component, wrap the existing JSX with `<ErrorBoundary>`:
   ```tsx
   export default function RootLayout() {
     return (
       <ErrorBoundary>
         <PaperProvider theme={paperTheme}>
           <View style={styles.outer}>
             <TabLayout />
           </View>
         </PaperProvider>
       </ErrorBoundary>
     );
   }
   ```
4. The ErrorBoundary must be the outermost wrapper so it catches errors from any child component
5. Run verification checks

**Verification Checklist:**
- [ ] `ErrorBoundary` wraps the entire app tree in `_layout.tsx`
- [ ] Import path `../src/components/ErrorBoundary` resolves correctly
- [ ] `npm test` passes
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes
- [ ] App still loads via `npx expo start --web` (manual spot check)

**Testing Instructions:**
```bash
npx tsc --noEmit
npm test
```

**Commit Message Template:**
```
fix(navigation): integrate ErrorBoundary into Expo Router layout

- Wrap app tree in ErrorBoundary in app/_layout.tsx
- ErrorBoundary now actually catches React errors in production
- Previously only used by dead App.tsx (per ADR-3)
```

---

### Task 11: Add Tests for LearnScreen and PracticeScreen

**Goal:** Close the screen-level test gap identified in the Day 2 evaluation. Add rendering and interaction tests for both main screens.

**Files to Create:**
- `__tests__/screens/LearnScreen.test.tsx`
- `__tests__/screens/PracticeScreen.test.tsx`

**Prerequisites:** Tasks 1-10 complete (screens are in their final state)

**Implementation Steps:**
1. Create `__tests__/screens/LearnScreen.test.tsx` with tests for:
   - Renders without crashing
   - Displays tutorial step content
   - Navigation buttons advance and retreat pages
   - Step indicator shows correct page number and total count (uses constant, not hardcoded)
   - Back button is disabled on first page
   - Final page shows "Practice" or equivalent navigation action
2. Create `__tests__/screens/PracticeScreen.test.tsx` with tests for:
   - Renders without crashing
   - Displays an equation when the store has a problem
   - Renders four answer buttons
   - Correct answer selection advances progress (shows feedback)
   - Incorrect answer selection shows error feedback
   - Hint display appears when hints are enabled
3. Mock dependencies as needed:
   - Mock `expo-router` for navigation hooks (`useRouter`)
   - Mock or provide real store state via Zustand
   - Mock `Animated` API if needed for feedback animations
4. Follow the test naming convention from Phase 0:
   ```
   describe('[ScreenName]', () => {
     it('should [expected behavior] when [condition]', () => {});
   });
   ```
5. Run verification checks

**Verification Checklist:**
- [ ] `__tests__/screens/LearnScreen.test.tsx` exists with at least 4 meaningful tests
- [ ] `__tests__/screens/PracticeScreen.test.tsx` exists with at least 5 meaningful tests
- [ ] All new tests pass
- [ ] `npm test` passes (all tests, including existing)
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes

**Testing Instructions:**
```bash
npm test -- --testPathPattern="screens/"
```

**Commit Message Template:**
```
test(screens): add LearnScreen and PracticeScreen tests

- LearnScreen: rendering, navigation, step indicator, boundary behavior
- PracticeScreen: rendering, equation display, answer interaction, hints
- Closes screen-level test gap from Day 2 evaluation
```

---

### Task 12: Remove/Fix Placeholder Smoke Test and Skipped Navigation Tests

**Goal:** Ensure the placeholder `smoke.test.ts` (`expect(true).toBe(true)`) and the skipped `navigation.test.tsx` (`describe.skip`) are removed. Phase 1 Tasks 1 and 6 should have handled this — verify and clean up any remainder.

**Files to Delete (if they still exist):**
- `__tests__/smoke.test.ts`
- `__tests__/navigation/navigation.test.tsx`

**Prerequisites:** Phase 1 should have handled this; this task is a verification checkpoint

**Implementation Steps:**
1. Check if `__tests__/smoke.test.ts` still exists — if so, delete it
2. Check if `__tests__/navigation/navigation.test.tsx` still exists — if so, delete it
3. If both are already gone from Phase 1, skip this task and mark complete
4. Run verification checks

**Verification Checklist:**
- [ ] `__tests__/smoke.test.ts` does not exist
- [ ] `__tests__/navigation/navigation.test.tsx` does not exist
- [ ] `npm test` passes

**Testing Instructions:**
```bash
npm test
```

**Commit Message Template:**
```
chore(test): remove placeholder smoke test and skipped navigation tests

- Delete smoke.test.ts (expect(true).toBe(true))
- Delete navigation.test.tsx (entire suite was describe.skip)
```

---

### Task 13: Add Failure-Path Tests for Store

**Goal:** The Day 2 evaluation identified zero `jest.mock` or `jest.fn` usage and no failure-path tests anywhere. Add tests for error conditions and edge cases in the store.

**Files to Modify:**
- `__tests__/store/appStore.test.ts` — Add failure-path test cases (file should exist from Task 1; create if not)

**Prerequisites:** Task 1 complete (store test file exists), Task 9 complete (timeout is in store)

**Implementation Steps:**
1. Open `__tests__/store/appStore.test.ts`
2. Add tests for the following failure paths and edge cases:
   - `submitAnswer` with incorrect answer index does not advance `indexCount`
   - `submitAnswer` when no problem is loaded is a no-op (does not throw)
   - `generateNewProblem` produces a valid equation with non-empty `answerChoices`
   - `nextHint` when hints are disabled does not advance `move`
   - `nextHint` when `move >= moveCount` does not advance past the end
   - `cleanup` action clears the timeout ID to `null`
   - Carry propagation across multiple digit positions (from Task 1)
   - Timeout lifecycle: `submitAnswer` with completing answer triggers `generateNewProblem` after `PROBLEM_COMPLETE_DELAY_MS` (use `jest.useFakeTimers()`)
3. Use Zustand's `create` directly in tests — no mocking of the store itself
4. Use `jest.useFakeTimers()` for timeout-related tests
5. Follow the test naming convention from Phase 0
6. Run verification checks

**Verification Checklist:**
- [ ] At least 7 failure-path or edge-case tests exist for the store
- [ ] Tests use real store instances (not mocked)
- [ ] Timeout tests use `jest.useFakeTimers()`
- [ ] All tests pass
- [ ] `npm test` passes
- [ ] `npm run lint` passes

**Testing Instructions:**
```bash
npm test -- --testPathPattern="store/appStore"
```

**Commit Message Template:**
```
test(store): add failure-path and edge-case tests

- Test incorrect answer, no-problem state, disabled hints
- Test hint bounds, timeout cleanup, carry propagation
- Addresses zero failure-path coverage from Day 2 evaluation
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
2. Verify the following conditions:
   - No `Dimensions.get('window')` at module scope in PracticeScreen or SettingsScreen
   - No render-path `logger.debug()` in PracticeScreen
   - No module-scoped `let problemCompleteTimeoutId` in appStore.ts
   - `ErrorBoundary` wraps the app tree in `_layout.tsx`
   - No inline arrow functions in AnswerButton `onPress` props
   - No retry loop in `answerChoices.ts`
   - No hardcoded `21` in LearnScreen step indicator
   - No duplicate `PracticeProblem` interface in `problemGenerator.ts`
   - `answerValidator.ts` has ADR-4 design comment (not "placeholder")
   - Screen tests exist for LearnScreen and PracticeScreen
   - Store failure-path tests exist
3. Run coverage check:
   ```bash
   npm run test:coverage
   ```
   Verify coverage meets or exceeds the thresholds defined in `jest.config.js` (branches: 70%, functions: 70%, lines: 80%, statements: 80%).

**Known limitations:** The store slice refactor (splitting `appStore.ts` into domain slices) is deferred per ADR-1 in Phase 0. The store remains a single file but with cleaner action logic, documented design decisions, and comprehensive tests.
