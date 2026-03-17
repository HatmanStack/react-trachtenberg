---
type: doc-health
scope: All docs, no constraints
language_stack: JS/TS and Python
drift_prevention: Markdown linting (markdownlint) + link checking (lychee)
---

## DOCUMENTATION AUDIT

### SUMMARY
- Docs scanned: 2 files (`README.md`, `manual-validation.md`)
- Code modules scanned: 38 source files across src/, app/, root
- Total findings: 8 drift, 3 gaps, 2 stale, 1 broken link, 2 stale code examples, 0 config drift, 2 structure issues

---

### DRIFT (doc exists, doesn't match code)

1. **`README.md:20`** — "18-step guided tutorial"
   - Doc says: 18 steps
   - Code says: `TUTORIAL_STEP_COUNT = 21` in `src/data/tutorialContent.ts:6`, `tutorialSteps` array has ids 0-20, `LearnScreen.tsx:100` displays "Step X of 21"
   - Tutorial was expanded from 18 to 21 steps but README was not updated.

2. **`README.md:34`** — "Zustand with AsyncStorage persistence"
   - Doc says: State is persisted with AsyncStorage
   - Code says: `useAppStore` in `src/store/appStore.ts` uses plain `create()` with NO persistence middleware. Zero imports or references to `AsyncStorage` or `persist` anywhere in `src/`. The `@react-native-async-storage/async-storage` package is installed but unused.

3. **`README.md:52-54`** — Clone path `cd android-trachtenberg/Migration/expo-project`
   - Doc says: Project lives at `android-trachtenberg/Migration/expo-project`
   - Code says: The repo root is `react-trachtenberg`. The directory structure is stale and reflects an earlier monorepo layout.

4. **`README.md:35`** — "React Navigation"
   - Doc says: Navigation uses React Navigation
   - Code says: The app uses **expo-router** (see `index.ts` which imports `expo-router/entry`, and `app/_layout.tsx` which uses `Tabs` from `expo-router`). The `src/navigation/` directory with `NavigationContainer` and `StackNavigator`/`TabNavigator` is dead code.

5. **`manual-validation.md:312-313`** — `COMPLETE_DIGIT_MOVES` and `UNITS_DIGIT_MOVES` arrays
   - Doc says: `COMPLETE_DIGIT_MOVES = [0, 3, 8, 14, 19, 22, 23]` and `UNITS_DIGIT_MOVES = [0, 1, 3, 4, 6, 8, 9, 11, 13, 16, 18, 21]`
   - Code says: `COMPLETE_DIGIT_MOVES = [0, 3, 8, 14, 20, 26, 32]` in `src/utils/hintCalculator.ts:21`. The `UNITS_DIGIT_MOVES` array no longer exists — replaced by `localMove % 2 === 0` logic at `hintCalculator.ts:111`.

6. **`manual-validation.md:45-72`** — `getMoveRange()` return values
   - Doc says: `getMoveRange(2) -> { startMove: 4, moveCount: 8 }`, etc.
   - Code says: With `MOVES_COUNT = [0, 1, 4, 9, 15, 21, 27, 33]`, `getMoveRange(2)` returns `{ startMove: 4, moveCount: 9 }`. All 7 test cases show outdated values.

7. **`manual-validation.md:87-111`** — `getDigitIndices()` results
   - Doc tests moves 0-23 only (24 moves total)
   - Code supports moves 0-32 (33 moves total, per `MOVES_COUNT[7] = 33`)
   - Moves 24-32 are undocumented.

8. **`src/utils/hintMoveTracker.ts:72` and `src/utils/hintCalculator.ts:39`** — JSDoc `@param move` range
   - Doc says: "Current move number (0-23)"
   - Code says: Moves range from 0-32 (MOVES_COUNT max is 33 exclusive).

---

### GAPS (code exists, no doc)

1. **`package.json:13-14`** — Scripts `test:coverage`, `lint`, `lint:fix` are defined but not listed in README's "Available Scripts" section.

2. **`app/` directory** — The expo-router file-based routing system (`app/_layout.tsx`, `app/index.tsx`, `app/practice.tsx`, `app/settings.tsx`, `app/+html.tsx`, `app/+not-found.tsx`) is completely undocumented. README describes only the old React Navigation approach.

3. **`src/types/index.ts`** — Branded types (`Digit`, `IndexPosition`, `MoveNumber`, `ButtonIndex`), type guards, factory functions, `ValidationOutcome`, and `AnswerChoicesTuple` — none documented despite being a public API surface.

---

### STALE (doc exists, code doesn't)

1. **`manual-validation.md:312`** — References `UNITS_DIGIT_MOVES` array that no longer exists. Replaced by `localMove % 2 === 0` at `src/utils/hintCalculator.ts:111`.

2. **`manual-validation.md:399-410`** — References `shouldShowHint()` function and recommends removing it. The function was already removed from the codebase.

---

### BROKEN LINKS

1. **`README.md:54`** — `cd android-trachtenberg/Migration/expo-project` — This directory path does not exist in the repository. The correct path is the repo root.

---

### STALE CODE EXAMPLES

1. **`manual-validation.md:87-111`** — `getDigitIndices()` test results showing 24 moves with specific index outputs. Current code has a different signature: takes `(move, indexCount)` with two parameters (see `src/utils/hintMoveTracker.ts:76`) instead of the single-parameter version documented. Pattern-based implementation produces different indices.

2. **`manual-validation.md:335-339`** — Result display examples reference move numbers based on 24-move system. Code now uses 33-move system. Move 19 and 22 are no longer complete-digit moves; moves 20, 26, 32 are instead.

---

### CONFIG DRIFT

No environment variables are read by the application code. No `.env` or `.env.example` files exist. **No config drift found.**

---

### STRUCTURE ISSUES

1. **Dead navigation code**: `src/navigation/` directory (4 files) and `App.tsx` constitute a parallel navigation system using React Navigation directly. The actual app runs via expo-router (`app/` directory). These files create confusion about which navigation system is active.

2. **`manual-validation.md` placement**: This is a point-in-time validation report from 2025-11-09 placed at the repo root. The code has since been significantly updated (MOVES_COUNT and COMPLETE_DIGIT_MOVES arrays changed, `shouldShowHint` removed, `UNITS_DIGIT_MOVES` replaced with modular arithmetic). It should either be archived with a "superseded" notice or updated to match current code.

---

### ADDITIONAL OBSERVATIONS

- **README has no project structure section** — Given dual navigation systems, a structure section would prevent confusion.
- **README lists no lint scripts** — `lint`, `lint:fix`, `test:coverage` are in package.json but absent from README.
- **`package.json` name is `expo-project`** but the app is "Trachtenberg Multiplication" in `app.json`. Never updated from Expo template default.
- **`src/utils/hintCalculator.ts:37`** — JSDoc example says `"1234 * 567"` (asterisk) but code uses `" × "` (multiplication sign U+00D7).
