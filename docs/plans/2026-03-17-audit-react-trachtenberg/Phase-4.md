# Phase 4 — [DOC-ENGINEER] Documentation Fixes

## Phase Goal

Fix all documentation drift, gaps, stale references, and broken links identified in the doc audit. After this phase, every claim in documentation should match the actual codebase. This phase runs last because it documents the final state after all code changes.

**Success criteria:**
- README accurately describes the current codebase (tutorial count, navigation framework, clone path, state management, scripts, project structure)
- `manual-validation.md` has a superseded notice preventing use as current reference
- JSDoc comments in hint utilities reflect the correct move range (0-32)
- `package.json` name matches the project
- All tests pass (`npm test`)
- Linting passes (`npm run lint`)
- Type checking passes (`npx tsc --noEmit`)

**Estimated tokens:** ~10,000

## Prerequisites

- Phase 0 read and understood
- Phases 1-3 complete (all code changes finalized, so docs reflect the final state)
- `npm ci` run successfully
- Baseline test run passes: `npm test`

---

## Tasks

### Task 1: Fix README — Tutorial Step Count, Navigation Framework, Clone Path, and AsyncStorage Claim

**Goal:** Fix the four most critical drift findings in `README.md`: wrong tutorial step count (says 18, actually 21), wrong navigation framework (says React Navigation, actually Expo Router), stale clone path (says `android-trachtenberg/Migration/expo-project`, actually `react-trachtenberg`), and false AsyncStorage persistence claim.

**Files to Modify:**
- `README.md` — Fix lines 20, 34, 35, and 52-54

**Prerequisites:** Phase 1 complete (React Navigation dependencies removed), Phase 2 Task 7 complete (hardcoded step count fixed)

**Implementation Steps:**
1. Open `README.md`
2. Line 20: Change `18-step guided tutorial` to `21-step guided tutorial`
   - Source of truth: `TUTORIAL_STEP_COUNT = 21` in `src/data/tutorialContent.ts:6`
3. Line 34: Change `[Zustand](https://github.com/pmndrs/zustand) with [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) persistence` to `[Zustand](https://github.com/pmndrs/zustand)` (remove the AsyncStorage persistence claim)
   - The store uses plain `create()` with no persistence middleware; `@react-native-async-storage/async-storage` was removed in Phase 1
4. Line 35: Change `[React Navigation](https://reactnavigation.org/)` to `[Expo Router](https://docs.expo.dev/router/introduction/)` (file-based routing)
   - The `src/navigation/` directory was removed in Phase 1; the app uses `app/` directory with Expo Router
5. Lines 52-54: Replace `cd android-trachtenberg/Migration/expo-project` with `cd react-trachtenberg`
   - The old monorepo directory structure no longer exists
6. Run verification checks

**Verification Checklist:**
- [ ] README says "21-step guided tutorial" (not 18)
- [ ] README does not mention AsyncStorage persistence
- [ ] README says Expo Router (not React Navigation)
- [ ] README clone path is `cd react-trachtenberg`
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes

**Testing Instructions:**
```bash
# Verify claims against source of truth
grep -c "TUTORIAL_STEP_COUNT = 21" src/data/tutorialContent.ts  # Should output: 1
grep -c "AsyncStorage" src/store/appStore.ts  # Should output: 0
ls app/_layout.tsx  # Should exist (Expo Router)
npm run lint
```

**Commit Message Template:**
```
docs: fix README tutorial count, navigation, clone path, and AsyncStorage claim

- Change 18-step to 21-step tutorial (matches TUTORIAL_STEP_COUNT)
- Replace React Navigation with Expo Router
- Fix clone path from android-trachtenberg/Migration/expo-project to react-trachtenberg
- Remove false AsyncStorage persistence claim
```

---

### Task 2: Add Missing Scripts and Project Structure Section to README

**Goal:** The doc audit identified that `test:coverage`, `lint`, and `lint:fix` scripts are missing from the Available Scripts section, and there is no project structure section to help new developers navigate the codebase.

**Files to Modify:**
- `README.md` — Add missing scripts to Available Scripts section, add a new Project Structure section

**Prerequisites:** Task 1 complete (README is partially fixed)

**Implementation Steps:**
1. Open `README.md`
2. In the "Available Scripts" section (lines 73-89), add the missing scripts after the existing entries:
   ```bash
   # Run tests with coverage report
   npm run test:coverage

   # Lint the codebase
   npm run lint

   # Lint and auto-fix
   npm run lint:fix
   ```
3. Add a new "Project Structure" section after the Available Scripts section:

   Add a `## Project Structure` heading followed by this directory listing:

   ````text
   app/              # Expo Router file-based routing (screens as routes)
   src/
     screens/        # Screen components (LearnScreen, PracticeScreen, SettingsScreen)
     store/          # Zustand state management (appStore.ts)
     utils/          # Pure utility functions (Trachtenberg algorithm, validation, hints)
     components/     # Reusable UI components (AnswerButton, HintDisplay, etc.)
     data/           # Tutorial content and step definitions
     constants/      # Algorithm and timing constants
     hooks/          # Custom React hooks
     theme/          # Colors, spacing, React Native Paper theme
     types/          # TypeScript interfaces
   __tests__/        # Jest tests mirroring src/ structure
   ````
4. Fix the Node.js version prerequisite: change "Node.js v18.x or higher" (line 45) to "Node.js v24" (matching `.nvmrc` created in Phase 3)
5. Run verification checks

**Verification Checklist:**
- [ ] README lists `test:coverage`, `lint`, and `lint:fix` in Available Scripts
- [ ] README has a Project Structure section documenting directory layout
- [ ] README says Node.js v24 (not v18.x)
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes

**Testing Instructions:**
```bash
# Verify scripts exist in package.json
node -e "const p=require('./package.json'); console.log(Object.keys(p.scripts))"
npm run lint
```

**Commit Message Template:**
```
docs: add missing scripts and project structure section to README

- Add test:coverage, lint, lint:fix to Available Scripts
- Add Project Structure section documenting directory layout
- Fix Node.js version from v18.x to v24 (matching .nvmrc)
```

---

### Task 3: Update or Archive manual-validation.md

**Goal:** `manual-validation.md` is a point-in-time validation report from 2025-11-09 that is now significantly out of date. The doc audit identified 5 drift findings and 2 stale references. Archive it with a superseded notice rather than rewriting, since it is a historical validation record.

**Files to Modify:**
- `manual-validation.md` — Add a prominent superseded notice at the very top of the file

**Prerequisites:** None

**Implementation Steps:**
1. Open `manual-validation.md`
2. Add the following blockquote notice at the very top of the file (before any existing content):
   ```markdown
   > **SUPERSEDED** — This validation report was written on 2025-11-09 against an earlier
   > version of the codebase. The following values have changed since this report:
   > - `COMPLETE_DIGIT_MOVES` array values updated (now `[0, 3, 8, 14, 20, 26, 32]`)
   > - `UNITS_DIGIT_MOVES` array removed, replaced by `localMove % 2 === 0` logic
   > - `getMoveRange()` return values changed due to updated `MOVES_COUNT` array
   > - `getDigitIndices()` now covers moves 0-32 (was 0-23)
   > - `shouldShowHint()` function has been removed
   > - Move range is now 0-32 (was 0-23)
   >
   > Do not use this document as a reference for current behavior.
   > See `src/utils/hintCalculator.ts` and `src/utils/hintMoveTracker.ts` for current logic.
   ```
3. Do not modify any other content in the file (preserve the historical record)
4. Run verification checks

**Verification Checklist:**
- [ ] `manual-validation.md` starts with a SUPERSEDED notice
- [ ] Notice lists all 6 specific changes
- [ ] Notice directs readers to current source files
- [ ] Original content below the notice is preserved unchanged
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes

**Testing Instructions:**
```bash
head -12 manual-validation.md  # Should show the SUPERSEDED notice
npm run lint
```

**Commit Message Template:**
```
docs: add superseded notice to manual-validation.md

- Mark as historical document from 2025-11-09
- List 6 specific values that have changed since the report
- Direct readers to hintCalculator.ts and hintMoveTracker.ts for current logic
```

---

### Task 4: Fix JSDoc Comments in Hint Utilities

**Goal:** Two JSDoc `@param move` comments claim the move range is 0-23 when the actual range is 0-32 (33 total moves, `MOVES_COUNT[7] = 33`). Also fix the equation example that uses an asterisk instead of the multiplication sign used in code.

**Files to Modify:**
- `src/utils/hintMoveTracker.ts` — Line 72: change `@param move` from "Current move number (0-23)" to "Current move number (0-32)"
- `src/utils/hintCalculator.ts` — Line 39: change `@param move` from "Current move number (0-23)" to "Current move number (0-32)"
- `src/utils/hintCalculator.ts` — Line 38: change JSDoc example from `"1234 * 567"` (asterisk) to `"1234 × 567"` (multiplication sign U+00D7, matching actual code usage)

**Prerequisites:** None

**Implementation Steps:**
1. Open `src/utils/hintMoveTracker.ts`
2. Locate the JSDoc comment at line 72 containing `@param move - Current move number (0-23)`
3. Change `(0-23)` to `(0-32)`
4. Open `src/utils/hintCalculator.ts`
5. Locate the JSDoc comment at line 39 containing `@param move - Current move number (0-23)`
6. Change `(0-23)` to `(0-32)`
7. Locate the JSDoc example at line 38 containing `"1234 * 567"`
8. Change to `"1234 × 567"` (using the multiplication sign character that the code actually uses)
9. Search for any other JSDoc comments referencing "0-23" move range and fix them
10. Run verification checks

**Verification Checklist:**
- [ ] `hintMoveTracker.ts` JSDoc says `(0-32)` not `(0-23)`
- [ ] `hintCalculator.ts` JSDoc says `(0-32)` not `(0-23)`
- [ ] `hintCalculator.ts` JSDoc example uses `×` not `*`
- [ ] No other JSDoc comments reference the old 0-23 range
- [ ] `npm test` passes
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes

**Testing Instructions:**
```bash
npx tsc --noEmit
npm run lint
```

**Commit Message Template:**
```
docs(hints): fix JSDoc move range from 0-23 to 0-32 and equation symbol

- Update @param move range in hintMoveTracker.ts and hintCalculator.ts
- Fix equation example from asterisk to multiplication sign (×)
- Matches actual MOVES_COUNT[7] = 33 (range 0-32)
```

---

### Task 5: Update package.json Name from expo-project

**Goal:** The `name` field in `package.json` is `expo-project` (Expo template default). The actual project is `react-trachtenberg`. Update to match.

**Files to Modify:**
- `package.json` — Change `"name": "expo-project"` to `"name": "react-trachtenberg"`

**Prerequisites:** None

**Implementation Steps:**
1. Open `package.json`
2. Change line 2 from `"name": "expo-project"` to `"name": "react-trachtenberg"`
3. Run `npm install` to update `package-lock.json` with the new name (if needed)
4. Run verification checks

**Verification Checklist:**
- [ ] `package.json` name is `react-trachtenberg`
- [ ] `package-lock.json` is consistent (if it references the package name)
- [ ] `npm test` passes
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes

**Testing Instructions:**
```bash
node -e "console.log(require('./package.json').name)"  # Should output: react-trachtenberg
npm test
```

**Commit Message Template:**
```
docs(deps): rename package from expo-project to react-trachtenberg

- Update package.json name field from Expo template default
- Matches actual project name
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
2. Read through the entire `README.md` and verify every claim against the codebase:
   - [ ] Tutorial step count matches `TUTORIAL_STEP_COUNT`
   - [ ] No AsyncStorage persistence claim
   - [ ] Navigation framework is Expo Router
   - [ ] Clone path is `react-trachtenberg`
   - [ ] Node.js version matches `.nvmrc`
   - [ ] All scripts in Available Scripts actually exist in `package.json`
   - [ ] Project structure section matches actual directory layout
3. Verify `manual-validation.md` starts with SUPERSEDED notice
4. Verify JSDoc comments in hint utilities reference correct ranges
5. Verify `package.json` name is `react-trachtenberg`
6. If Phase 3 added `lint:docs`, run: `npm run lint:docs`

---

## Final Plan Verification

After all four phases are complete, the following audit scores should improve:

| Pillar | Before | Target |
|--------|--------|--------|
| Problem-Solution Fit | 8/10 | 9/10 |
| Architecture | 7/10 | 8/10 |
| Code Quality | 7/10 | 9/10 |
| Defensiveness | 6/10 | 9/10 |
| Performance | 7/10 | 9/10 |
| Test Value | 6/10 | 9/10 |
| Reproducibility | 7/10 | 9/10 |
| Onboarding | 5/10 | 9/10 |
