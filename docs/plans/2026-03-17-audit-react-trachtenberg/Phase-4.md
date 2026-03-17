# Phase 4 — [DOC-ENGINEER] Documentation Fixes

**Goal:** Fix all documentation drift, gaps, stale references, and broken links identified in the doc audit. After this phase, every claim in documentation should match the actual codebase.

**Prerequisite:** Phases 1-3 complete (code changes finalized, so docs reflect final state).

**Estimated tokens:** ~10,000

---

## Task 1: Rewrite README.md

**Why:** The README has 8 drift findings, 3 gaps, and 1 broken link. Rather than patching individual lines, a targeted rewrite ensures consistency. The structure is sound but the content is stale.

**Files to modify:**
- `README.md`

**Changes required:**

### 1a. Fix tutorial step count (drift #1)
- Change `18-step guided tutorial` to `21-step guided tutorial`
- Source of truth: `TUTORIAL_STEP_COUNT = 21` in `src/data/tutorialContent.ts:6`

### 1b. Fix state management description (drift #2)
- Remove "with AsyncStorage persistence" from the Zustand description
- The store uses plain `create()` with no persistence middleware
- Change line 34 from: `Zustand with AsyncStorage persistence`
- To: `Zustand` (state management, no persistence)

### 1c. Fix clone path (drift #3, broken link #1)
- Replace `cd android-trachtenberg/Migration/expo-project` with `cd react-trachtenberg`
- The old monorepo directory structure no longer exists

### 1d. Fix navigation reference (drift #4)
- Replace `React Navigation` with `Expo Router` in the Tech Stack section
- The app uses file-based routing via `expo-router` (`app/` directory)
- After Phase 1, all React Navigation dependencies have been removed

### 1e. Add missing scripts to Available Scripts (gap #1)
- Add `test:coverage`, `lint`, and `lint:fix` to the Available Scripts section:
  ```bash
  # Run tests with coverage
  npm run test:coverage

  # Lint the codebase
  npm run lint

  # Lint and auto-fix
  npm run lint:fix
  ```

### 1f. Add project structure section (gap #2)
- Add a section documenting the directory structure, especially:
  - `app/` — Expo Router file-based routing (screens as routes)
  - `src/screens/` — Screen components (imported by `app/` routes)
  - `src/store/` — Zustand state management
  - `src/utils/` — Pure utility functions (Trachtenberg algorithm, validation, hints)
  - `src/components/` — Reusable UI components
  - `src/data/` — Tutorial content data
  - `src/constants/` — Algorithm and timing constants
  - `src/theme/` — Colors, spacing, Paper theme
  - `__tests__/` — Jest tests mirroring `src/` structure

### 1g. Fix Node.js version prerequisite
- Change "Node.js v18.x or higher" to "Node.js v24" (matching `.nvmrc` created in Phase 3)

### 1h. Fix package.json name mention
- Note: The `package.json` `name` field says `expo-project`. This is a cosmetic issue. If fixing, change to `react-trachtenberg`. This is optional.

**Verification:**
- Read through the entire README and verify every claim against the codebase
- No broken links remain
- `npm run lint && npx tsc --noEmit`

**Commit:** `docs: rewrite README to match current codebase`

---

## Task 2: Update manual-validation.md or archive it

**Why:** `manual-validation.md` is a point-in-time validation report from 2025-11-09 that is now significantly out of date. The doc audit identified 5 drift findings and 2 stale references in this file alone.

**Decision:** Archive the file with a superseded notice rather than rewriting it, since it is a historical validation record.

**Files to modify:**
- `manual-validation.md` — Add a prominent notice at the top

**Implementation Steps:**
1. Add the following notice at the very top of the file:
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

**Verification:**
```bash
npm run lint && npx tsc --noEmit
```

**Commit:** `docs: add superseded notice to manual-validation.md`

---

## Task 3: Fix JSDoc parameter ranges in hint utilities

**Why:** Two JSDoc comments claim the move range is 0-23 when the actual range is 0-32 (33 total moves, `MOVES_COUNT[7] = 33`).

**Files to modify:**
- `src/utils/hintMoveTracker.ts:72` — Change `@param move` description from "Current move number (0-23)" to "Current move number (0-32)"
- `src/utils/hintCalculator.ts:39` — Change `@param move` description from "Current move number (0-23)" to "Current move number (0-32)"

**Also fix (if present):**
- `src/utils/hintCalculator.ts:37` — JSDoc example says `"1234 * 567"` (asterisk) but code uses `" x "` (multiplication sign). Update the example to use `"1234 × 567"`.

**Verification:**
```bash
npm run lint && npx tsc --noEmit
```

**Commit:** `docs(hints): fix JSDoc move range from 0-23 to 0-32`

---

## Task 4: Fix package.json name field

**Why:** The `name` field in `package.json` is `expo-project` (Expo template default). The actual project is `react-trachtenberg`.

**Files to modify:**
- `package.json` — Change `"name": "expo-project"` to `"name": "react-trachtenberg"`

**Verification:**
```bash
npm test && npm run lint && npx tsc --noEmit
```

**Commit:** `docs(deps): rename package from expo-project to react-trachtenberg`

---

## Phase 4 Completion Checklist

After all tasks, confirm:
- [ ] README says "21-step guided tutorial"
- [ ] README does not mention AsyncStorage persistence
- [ ] README clone path is `cd react-trachtenberg`
- [ ] README says Expo Router (not React Navigation)
- [ ] README lists `test:coverage`, `lint`, `lint:fix` scripts
- [ ] README has project structure section
- [ ] README says Node.js v24
- [ ] `manual-validation.md` has superseded notice
- [ ] JSDoc in `hintMoveTracker.ts` and `hintCalculator.ts` says 0-32 (not 0-23)
- [ ] `package.json` name is `react-trachtenberg`
- [ ] `npm test` passes
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes

---

## Final Plan Verification

After all four phases, the following audit scores should improve:

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
