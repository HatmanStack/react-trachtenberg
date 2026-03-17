# Phase 3 — [FORTIFIER] CI Hardening, Pre-Commit Hooks, and Coverage Enforcement

**Goal:** Add guardrails that prevent regression: enforce coverage thresholds in CI, add pre-commit hooks to catch issues before push, and pin the Node.js version. After this phase, the CI pipeline should catch all quality regressions automatically.

**Prerequisite:** Phase 2 complete (all bugs fixed, tests added).

**Estimated tokens:** ~8,000

---

## Task 1: Enforce coverage thresholds in CI

**Why:** `jest.config.js` defines coverage thresholds (branches: 70%, functions: 70%, lines: 80%, statements: 80%) but CI runs `npm test` without `--coverage`, so the thresholds are never enforced. Tests can silently drop below thresholds.

**Files to modify:**
- `.github/workflows/ci.yml` — Change the test step from `npm test` to `npm run test:coverage`

**Implementation Steps:**
1. In `.github/workflows/ci.yml`, change line 31 from:
   ```yaml
   run: npm test
   ```
   to:
   ```yaml
   run: npm run test:coverage
   ```
2. The `test:coverage` script in `package.json` already runs `jest --coverage`, which enforces the thresholds defined in `jest.config.js`

**Verification:**
```bash
npm run test:coverage
```
Confirm the coverage report is generated and thresholds pass.

**Commit:** `ci: enforce coverage thresholds in CI pipeline`

---

## Task 2: Add pre-commit hooks with Husky and lint-staged

**Why:** There are no pre-commit hooks. Developers can push unlinted, untyped code directly. This was flagged as a maintenance drag in the Day 2 evaluation.

**Dependencies to install:**
- `husky` (devDependency)
- `lint-staged` (devDependency)

**Files to create:**
- `.husky/pre-commit` — Runs lint-staged

**Files to modify:**
- `package.json` — Add `lint-staged` configuration and `prepare` script

**Implementation Steps:**
1. Install dependencies:
   ```bash
   npm install --save-dev husky lint-staged
   ```
2. Initialize Husky:
   ```bash
   npx husky init
   ```
3. Set up the pre-commit hook in `.husky/pre-commit`:
   ```bash
   npx lint-staged
   ```
4. Add `lint-staged` configuration to `package.json`:
   ```json
   "lint-staged": {
     "*.{ts,tsx}": [
       "eslint --fix",
       "bash -c 'npx tsc --noEmit'"
     ]
   }
   ```
5. Verify the `prepare` script was added by Husky init:
   ```json
   "prepare": "husky"
   ```

**Verification:**
1. Stage a `.ts` file and run `npx lint-staged` manually to confirm it works
2. Run `npm test && npm run lint && npx tsc --noEmit`

**Commit:** `ci: add pre-commit hooks with Husky and lint-staged`

---

## Task 3: Pin Node.js version with .nvmrc

**Why:** The README says "Node.js v18.x or higher" but CI uses Node.js 24. This version mismatch can cause "works on my machine" issues. A `.nvmrc` file provides a single source of truth.

**Files to create:**
- `.nvmrc` — Contains `24` (matching CI)

**Files to modify:**
- `.github/workflows/ci.yml` — Use `.nvmrc` for the node version instead of hardcoding:
  ```yaml
  - name: Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version-file: '.nvmrc'
      cache: 'npm'
  ```

**Implementation Steps:**
1. Create `.nvmrc` at project root with content: `24`
2. Update `ci.yml` to reference `.nvmrc` via `node-version-file` instead of hardcoded `'24'`

**Verification:**
```bash
cat .nvmrc  # Should show: 24
npm test && npm run lint && npx tsc --noEmit
```

**Commit:** `ci: pin Node.js version with .nvmrc`

---

## Task 4: Add TypeScript type checking to CI as an explicit step

**Why:** The CI pipeline already runs `npx tsc --noEmit`, which is correct. However, it runs after tests, meaning a type error won't be caught until tests pass. For faster feedback, type checking should run in parallel or early. This task verifies the existing setup is optimal.

**Files to review:**
- `.github/workflows/ci.yml` — The current order is: lint -> test -> tsc. This is correct because lint is fastest, test runs coverage, and tsc catches type-only errors.

**Decision:** The existing CI order (lint -> test:coverage -> tsc) is already optimal. No changes needed. This task is a verification checkpoint.

**Verification:**
- Confirm the three CI steps run in order: lint, test:coverage (from Task 1), tsc
- All three should pass

**Commit:** No commit needed (verification only).

---

## Task 5: Update ESLint lint script scope to include app/ directory

**Why:** The `lint` script in `package.json` is `eslint src/ __tests__/ --ext .ts,.tsx` but does not include the `app/` directory. The Expo Router files (`app/_layout.tsx`, `app/index.tsx`, `app/practice.tsx`, `app/settings.tsx`) are not linted.

**Files to modify:**
- `package.json` — Update `lint` and `lint:fix` scripts to include `app/`

**Implementation Steps:**
1. Update `lint` script from:
   ```
   eslint src/ __tests__/ --ext .ts,.tsx
   ```
   to:
   ```
   eslint src/ app/ __tests__/ --ext .ts,.tsx
   ```
2. Update `lint:fix` similarly to include `app/`
3. Run `npm run lint` and fix any newly discovered lint errors in `app/` files

**Verification:**
```bash
npm run lint && npx tsc --noEmit
```

**Commit:** `ci: include app/ directory in lint scope`

---

## Phase 3 Completion Checklist

After all tasks, confirm:
- [ ] CI runs `npm run test:coverage` (not `npm test`)
- [ ] Coverage thresholds are enforced in CI
- [ ] Pre-commit hooks run lint-staged on staged `.ts`/`.tsx` files
- [ ] `.nvmrc` exists with value `24`
- [ ] CI uses `.nvmrc` for Node version
- [ ] `lint` and `lint:fix` scripts include `app/` directory
- [ ] `npm run test:coverage` passes
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes
