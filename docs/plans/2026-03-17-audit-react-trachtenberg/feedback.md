# Feedback — 2026-03-17-audit-react-trachtenberg

## Active Feedback

<!-- No active feedback items -->

## Resolved Feedback

### FB-001 [PLAN_REVIEW] — Phase 2 Task 11 says "Create" problemGenerator.test.ts but file already exists
- **Phase/Task:** Phase-2, Task 11
- **Severity:** BLOCKING
- **Description:** Task 11 lists `__tests__/utils/problemGenerator.test.ts` under "Files to create" but this file already exists with 135 lines of tests covering `generateProblem()`, `formatEquation()`, and `isValidProblem()`. The plan should say "Files to modify" and note that the implementer should ADD edge-case tests to the existing file rather than creating a new one.
- **Status:** RESOLVED
- **Resolution:** Moved `problemGenerator.test.ts` from "Files to create" to "Files to modify" in Phase-2.md Task 11. Added explicit note about existing coverage (~135 lines covering `generateProblem()`, `formatEquation()`, `isValidProblem()`) and instructed implementer to add only missing tests (`formatEquationWithPadding()`, boundary conditions) after reviewing existing file.

### FB-002 [PLAN_REVIEW] — Phase 1 Task 6 commit message assumes persistence.test.ts deletion but file tests real store behavior
- **Phase/Task:** Phase-1, Task 6
- **Severity:** NON-BLOCKING
- **Description:** The commit message template presumes deletion of `persistence.test.ts` but the file tests real store behavior, not AsyncStorage. The task body correctly has conditional logic but the commit message contradicts it.
- **Status:** RESOLVED
- **Resolution:** Revised the commit message template in Phase-1.md Task 6 from "Remove persistence.test.ts (tests non-existent AsyncStorage integration)" to a conditional message: "Evaluate persistence.test.ts: keep if it tests real store behavior, remove only if it tests non-existent AsyncStorage integration."

### FB-003 [PLAN_REVIEW] — Phase 2 Task 9 creates appStore.test.ts but persistence.test.ts already covers overlapping ground
- **Phase/Task:** Phase-2, Task 9
- **Severity:** NON-BLOCKING
- **Description:** Task 9 creates `appStore.test.ts` with tests that overlap with `persistence.test.ts` (if kept): `generateNewProblem` initialization and `resetPractice` clearing state. Implementer needs guidance to avoid duplication.
- **Status:** RESOLVED
- **Resolution:** Added an "Important — check for overlap" section at the top of Task 9's test list in Phase-2.md. Instructs implementer to read `persistence.test.ts` first, skip or consolidate overlapping assertions for `generateNewProblem` initialization and `resetPractice`, and focus `appStore.test.ts` on the unique coverage (carry propagation, timeout lifecycle). Individual test items also annotated with conditional skip guidance.
