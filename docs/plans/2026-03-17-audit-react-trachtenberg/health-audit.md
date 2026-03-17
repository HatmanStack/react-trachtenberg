---
type: repo-health
goal: General health check — scan all 4 vectors equally
deployment_target: Serverless (Lambda, Cloud Functions)
scope: Full repo, no constraints
existing_tooling: Full setup — linters, CI pipeline, pre-commit hooks, type checking
---

## CODEBASE HEALTH AUDIT

### EXECUTIVE SUMMARY
- **Overall health:** FAIR
- **Biggest structural risk:** The Zustand store (`appStore.ts`) is a monolithic god object containing all application state, business logic, side-effects, and timers in a single 272-line closure — making it difficult to test in isolation and creating tight coupling across every feature.
- **Biggest operational risk:** Module-scoped `setTimeout` in the store creates a timer leak with no cleanup on unmount, and `Dimensions.get('window')` is evaluated once at module load time, producing stale layout values that will never update on orientation change or window resize.
- **Total findings: 3 critical, 6 high, 8 medium, 6 low**

---

### TECH DEBT LEDGER

#### CRITICAL

1. **[Structural Design Debt]** `src/store/appStore.ts:1-272`
   - **The Debt:** Single Zustand store acts as a god object — it holds all settings state, tutorial state, practice state, hint system state, and all business logic (problem generation orchestration, answer validation orchestration, hint step orchestration) in one monolithic `create()` call. 15 state fields and 8 actions in a single closure. Business logic (carry digit calculation at line 170, answer progression at lines 119-194, hint stepping at lines 221-260) is fused into store actions rather than delegated to pure utility functions.
   - **The Risk:** Untestable without mocking the entire store; cannot refactor hint logic without risk to practice logic; all components re-render on any state change if selectors are not perfectly scoped; violates single-responsibility principle at the architectural level.

2. **[Operational Debt]** `src/store/appStore.ts:10-11,148-154`
   - **The Debt:** Module-scoped `let problemCompleteTimeoutId` holds a `setTimeout` reference outside React's lifecycle. The timeout is created at line 151 and calls `get().generateNewProblem()` after `PROBLEM_COMPLETE_DELAY_MS` (2000ms). There is no cleanup when the component unmounts or the user navigates away. The `clearTimeout` at line 149 only clears if a new completion fires, not on teardown.
   - **The Risk:** On serverless/SSR, module-scoped mutable state persists across requests causing state leaks between users. On client, navigating away mid-timeout triggers state updates on an unmounted component. In a Lambda cold-start scenario, stale module state from a previous invocation could leak.

3. **[Operational Debt]** `src/screens/PracticeScreen.tsx:18-19` and `src/screens/SettingsScreen.tsx:7-8`
   - **The Debt:** `Dimensions.get('window')` is called at module scope (outside component), capturing the window width once at import time. The derived `isLargeScreen` boolean is computed once and never updated.
   - **The Risk:** On web (serverless SSR target), the server has no window — this will return 0 or a default, producing incorrect layout for every server-rendered page. On client, resizing the browser window or rotating a mobile device will never trigger a re-layout. `LearnScreen.tsx` correctly uses `useWindowDimensions()` hook, making the inconsistency more dangerous.

#### HIGH

4. **[Structural Design Debt]** `src/types/index.ts:22-89`
   - **The Debt:** Extensive branded type system (`Digit`, `IndexPosition`, `MoveNumber`, `ButtonIndex`) with type guards, factory functions, `ValidationOutcome`, `AnswerChoice`, and `AnswerChoicesTuple` are all exported but never imported or used anywhere in the codebase except `TutorialStep`. The entire branded type infrastructure is dead code.
   - **The Risk:** Misleads developers into thinking runtime validation exists when it does not. Increases cognitive load and bundle size for no benefit. The store passes raw `number` values everywhere, bypassing all these guards.

5. **[Structural Design Debt]** `src/utils/problemGenerator.ts:13-17` and `src/types/index.ts:10-14`
   - **The Debt:** `PracticeProblem` interface is defined identically in two locations. `problemGenerator.ts` defines and uses its own copy; `types/index.ts` defines another copy that nothing imports.
   - **The Risk:** If one definition is updated and the other is not, type mismatches will silently occur. Violates DRY principle.

6. **[Architectural Debt]** `src/navigation/` (entire directory: `TabNavigator.tsx`, `StackNavigator.tsx`, `index.tsx`, `linking.ts`)
   - **The Debt:** The `src/navigation/` directory contains a complete React Navigation setup while the `app/` directory contains Expo Router file-based routing. The Expo Router system is what actually runs. The `src/navigation/` system is dead code (~140 lines across 4 files).
   - **The Risk:** Two competing navigation systems create confusion about which is authoritative. `App.tsx` and the `ErrorBoundary` wrapper are bypassed entirely.

7. **[Operational Debt]** `src/screens/PracticeScreen.tsx:49-52`
   - **The Debt:** Three `logger.debug()` calls execute on every render of `PracticeScreen`, outside of any `useEffect` or `useCallback`. These log the full `answerChoices` array, `hintQuestion`, `hintResult`, and multiple state values on every single render cycle.
   - **The Risk:** On low-powered mobile devices, this creates measurable GC pressure. The logger check (`__DEV__`) still executes the argument expressions before the guard can suppress them.

8. **[Code Hygiene Debt]** `src/utils/answerValidator.ts:57-59`
   - **The Debt:** Remainder/carry calculation is stubbed with hardcoded `const newRemainder = 0` and a comment saying "placeholder." The carry is actually calculated in `appStore.ts:170`, so the validator returns incorrect remainder values.
   - **The Risk:** Any future consumer relying on the validator's `newRemainder` output will get incorrect carry values. The store works around this by computing its own carry.

9. **[Architectural Debt]** `App.tsx:1-16`
   - **The Debt:** `App.tsx` wraps the app in `ErrorBoundary` and `PaperProvider` with `Navigation` using the `src/navigation/` system. However, the actual entry point is `app/_layout.tsx` (Expo Router). `App.tsx` is dead code.
   - **The Risk:** The `ErrorBoundary` component never catches errors in production because it is never mounted. Crashes in the Expo Router tree are unhandled at the React level.

#### MEDIUM

10. **[Code Hygiene Debt]** `src/theme/constants.ts:21-28`
    - **The Debt:** `FONT_SIZES` and `MAX_DIGIT_COUNT` are exported but never imported anywhere. `MAX_DIGIT_COUNT = 7` duplicates `MAX_ANSWER_DIGITS = 7` from `src/constants/algorithm.ts:20`.
    - **The Risk:** Dead exports plus duplicate constants risk divergence.

11. **[Code Hygiene Debt]** `src/utils/textHighlighter.ts:66-78` and `src/utils/answerChoices.ts:79-91`
    - **The Debt:** `findCharIndices()` and `getDigitsArray()` are exported but never used anywhere.
    - **The Risk:** Dead code.

12. **[Code Hygiene Debt]** `src/store/appStore.ts:46,50` and `src/hooks/useTutorialNavigation.ts:31-33,44`
    - **The Debt:** `resetPractice()`, `resetHints()`, and `reset()` (tutorial) are defined but never called.
    - **The Risk:** Dead code paths that are untested.

13. **[Structural Design Debt]** `src/utils/problemGenerator.ts:31-40`
    - **The Debt:** Problem generation uses a retry loop that regenerates both numbers entirely instead of generating within the correct range from the start.
    - **The Risk:** Wastes CPU cycles (~10% retry rate). Minor performance concern but indicates a logic gap.

14. **[Operational Debt]** `src/screens/PracticeScreen.tsx:100-110`
    - **The Debt:** `useEffect` dependency array includes `move` and `hintQuestion` which change on every hint step, causing potential re-trigger cascades. Guard condition prevents infinite loops but the pattern is fragile.
    - **The Risk:** Redundant effect re-executions; if the guard is ever relaxed, this becomes an infinite loop.

15. **[Code Hygiene Debt]** `package.json:27`
    - **The Debt:** `postcss-value-parser` is listed as a direct production dependency but is never imported anywhere.
    - **The Risk:** Unnecessary dependency increases bundle size and attack surface.

16. **[Operational Debt]** `src/screens/LearnScreen.tsx:100`
    - **The Debt:** `Step {currentPage + 1} of 21` has the total page count hardcoded instead of using `TUTORIAL_STEP_COUNT`.
    - **The Risk:** Display will be wrong if tutorial steps are added or removed.

17. **[Structural Design Debt]** `src/screens/PracticeScreen.tsx:230-248`
    - **The Debt:** Four `AnswerButton` components use inline arrow functions `() => handleAnswerPress(N)`, creating new closures on every render, defeating `React.memo`.
    - **The Risk:** All 4 buttons re-render on every state change regardless of whether their `value` changed.

#### LOW

18. **[Code Hygiene Debt]** `src/components/LoadingIndicator.tsx:1-39`
    - **The Debt:** `LoadingIndicator` component is defined but never used.
    - **The Risk:** Dead component.

19. **[Code Hygiene Debt]** `src/utils/hintCalculator.ts:21`
    - **The Debt:** `COMPLETE_DIGIT_MOVES` typed as `readonly number[]` via `as const` but then requires cast at line 122 to use `.includes()`.
    - **The Risk:** Minor type ergonomics issue.

20. **[Code Hygiene Debt]** `src/components/HighlightedText.tsx:22`
    - **The Debt:** Uses array `index` as React key, acceptable for static segments but flagged by linting.
    - **The Risk:** Minimal practical risk.

21. **[Code Hygiene Debt]** `src/screens/PracticeScreen.tsx:309` and `src/components/AnswerButton.tsx:36-37`
    - **The Debt:** Hardcoded color values and magic numbers bypass centralized `COLORS` and `SPACING` constants.
    - **The Risk:** Theme changes won't propagate.

22. **[Code Hygiene Debt]** `src/utils/tutorialHighlighter.ts:48-56`
    - **The Debt:** Uses `indexOf` to find digit positions — always returns first occurrence, which may not be intended digit position when digits repeat.
    - **The Risk:** Latently incorrect for repeated digits (not currently triggered).

23. **[Operational Debt]** `src/utils/answerChoices.ts:29-36`
    - **The Debt:** Random retry loop (up to 100 iterations) to find unique digits when a Fisher-Yates shuffle would be O(1) and deterministic.
    - **The Risk:** Inefficient algorithm for a deterministic problem.

---

### QUICK WINS

1. `src/screens/PracticeScreen.tsx:18-19` and `src/screens/SettingsScreen.tsx:7-8` — Replace `Dimensions.get('window')` with `useWindowDimensions()` hook (already used correctly in `LearnScreen.tsx`). Estimated effort: < 15 minutes.
2. `package.json:27` — Remove `postcss-value-parser` from direct dependencies. Estimated effort: < 5 minutes.
3. `src/screens/LearnScreen.tsx:100` — Replace hardcoded `21` with `TUTORIAL_STEP_COUNT`. Estimated effort: < 5 minutes.
4. Dead code cleanup: `LoadingIndicator.tsx`, `isValidProblem()`, `findCharIndices()`, `getDigitsArray()`, `resetHints()`, `FONT_SIZES`, `MAX_DIGIT_COUNT`. Estimated effort: < 30 minutes.

---

### AUTOMATED SCAN RESULTS

**Dead code (knip):** Failed to run due to eslint config load error. Manual analysis identified significant dead code: entire `src/types/index.ts` branded type system (lines 22-89), `src/navigation/` directory (4 files), `App.tsx`, `ErrorBoundary` component, `LoadingIndicator` component, `findCharIndices()`, `getDigitsArray()`, `isValidProblem()`, `resetPractice()`, `resetHints()`, `FONT_SIZES`, `MAX_DIGIT_COUNT`.

**Vulnerability scan (npm audit):** 18 vulnerabilities — 6 low, 3 moderate, 8 high, 1 critical. Critical: `undici` (<=6.23.0) — unbounded decompression chain, WebSocket overflow, request smuggling. High: `webpack` — SSRF via buildHttp. All fixable via `npm audit fix`.

**Secrets scan:** No secrets, API keys, tokens, or `process.env` references found in source code. `.gitignore` correctly excludes `.env*.local` files.

**Git hygiene:** Clean history with descriptive commit messages. No committed build artifacts. `.gitignore` is comprehensive.
