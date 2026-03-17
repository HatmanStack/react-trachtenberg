# Phase 3 — [FORTIFIER] CI Hardening, Pre-Commit Hooks, and Coverage Enforcement

## Phase Goal

Add guardrails that prevent regression: enforce coverage thresholds in CI, add pre-commit hooks to catch issues before push, pin the Node.js version, and add documentation linting. After this phase, the CI pipeline should catch all quality regressions automatically and developers cannot push unlinted code.

**Success criteria:**
- CI enforces coverage thresholds via `npm run test:coverage`
- Pre-commit hooks run lint and type-check on staged files
- Node.js version is pinned via `.nvmrc` and consumed by CI
- Markdown linting and link checking are available
- All tests pass (`npm test`)
- Linting passes (`npm run lint`)
- Type checking passes (`npx tsc --noEmit`)

**Estimated tokens:** ~8,000

## Prerequisites

- Phase 0 read and understood
- Phase 2 complete (all bugs fixed, tests added)
- `npm ci` run successfully
- Baseline test run passes: `npm test`

---

## Tasks

### Task 1: Add Husky + lint-staged Pre-Commit Hooks

**Goal:** There are no pre-commit hooks. Developers can push unlinted, untyped code directly. This was flagged as a maintenance drag in the Day 2 evaluation. Add Husky and lint-staged to run ESLint and TypeScript type-checking on staged files before every commit.

**Files to Create:**
- `.husky/pre-commit` — Hook script that runs `npx lint-staged`

**Files to Modify:**
- `package.json` — Add `husky` and `lint-staged` as devDependencies, add `prepare` script, add `lint-staged` configuration

**Prerequisites:** None

**Implementation Steps:**
1. Install Husky and lint-staged as devDependencies:
   ```bash
   npm install --save-dev husky lint-staged
   ```
2. Initialize Husky:
   ```bash
   npx husky init
   ```
3. Verify that `npx husky init` created `.husky/pre-commit` — if not, create it manually
4. Set the contents of `.husky/pre-commit` to:
   ```bash
   npx lint-staged
   ```
5. Verify that `npx husky init` added a `prepare` script to `package.json` — if not, add it:
   ```json
   "prepare": "husky"
   ```
6. Add `lint-staged` configuration to `package.json`:
   ```json
   "lint-staged": {
     "*.{ts,tsx}": [
       "eslint --fix",
       "bash -c 'npx tsc --noEmit'"
     ]
   }
   ```
7. Run verification checks

**Verification Checklist:**
- [ ] `.husky/pre-commit` exists and contains `npx lint-staged`
- [ ] `package.json` has `"prepare": "husky"` script
- [ ] `package.json` has `lint-staged` configuration
- [ ] `husky` and `lint-staged` are in `devDependencies`
- [ ] Stage a `.ts` file and run `npx lint-staged` manually to confirm it works
- [ ] `npm test` passes
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes

**Testing Instructions:**
```bash
# Verify lint-staged works on a staged file
git add src/utils/logger.ts
npx lint-staged
# Should run eslint and tsc on the staged file
```

**Commit Message Template:**
```
ci: add pre-commit hooks with Husky and lint-staged

- Install husky and lint-staged as devDependencies
- Pre-commit hook runs eslint --fix and tsc --noEmit on staged .ts/.tsx files
- Prevents pushing unlinted or type-broken code
```

---

### Task 2: Enable Coverage Enforcement in CI

**Goal:** `jest.config.js` defines coverage thresholds (branches: 70%, functions: 70%, lines: 80%, statements: 80%) but CI runs `npm test` without `--coverage`, so the thresholds are never enforced. Change CI to use `npm run test:coverage`.

**Files to Modify:**
- `.github/workflows/ci.yml` — Change the "Run tests" step from `npm test` to `npm run test:coverage`

**Prerequisites:** None

**Implementation Steps:**
1. Open `.github/workflows/ci.yml`
2. Locate the "Run tests" step (line 31): `run: npm test`
3. Change it to: `run: npm run test:coverage`
4. The `test:coverage` script in `package.json` already runs `jest --coverage`, which enforces the thresholds defined in `jest.config.js`
5. Verify locally that coverage thresholds pass:
   ```bash
   npm run test:coverage
   ```
6. Run verification checks

**Verification Checklist:**
- [ ] `.github/workflows/ci.yml` test step runs `npm run test:coverage`
- [ ] `npm run test:coverage` passes locally with coverage report generated
- [ ] Coverage thresholds (branches: 70%, functions: 70%, lines: 80%, statements: 80%) are met
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes

**Testing Instructions:**
```bash
npm run test:coverage
```

**Commit Message Template:**
```
ci: enforce coverage thresholds in CI pipeline

- Change CI test step from 'npm test' to 'npm run test:coverage'
- jest.config.js thresholds (70% branches, 80% lines) are now enforced on every push/PR
```

---

### Task 3: Pin Node Version via .nvmrc

**Goal:** The README says "Node.js v18.x or higher" but CI uses Node.js 24. This version mismatch can cause "works on my machine" issues. Create a `.nvmrc` file as the single source of truth and update CI to consume it.

**Files to Create:**
- `.nvmrc` — Contains `24` (matching CI)

**Files to Modify:**
- `.github/workflows/ci.yml` — Replace hardcoded `node-version: '24'` with `node-version-file: '.nvmrc'`

**Prerequisites:** None

**Implementation Steps:**
1. Create `.nvmrc` at the project root with content: `24`
2. Open `.github/workflows/ci.yml`
3. In the "Setup Node.js" step, replace:
   ```yaml
   with:
     node-version: '24'
     cache: 'npm'
   ```
   with:
   ```yaml
   with:
     node-version-file: '.nvmrc'
     cache: 'npm'
   ```
4. Run verification checks

**Verification Checklist:**
- [ ] `.nvmrc` exists at project root with content `24`
- [ ] `.github/workflows/ci.yml` uses `node-version-file: '.nvmrc'` instead of hardcoded version
- [ ] No hardcoded Node version remains in CI config
- [ ] `npm test` passes
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes

**Testing Instructions:**
```bash
cat .nvmrc  # Should output: 24
npm test
```

**Commit Message Template:**
```
ci: pin Node.js version via .nvmrc

- Create .nvmrc with version 24 (matching CI)
- Update ci.yml to use node-version-file instead of hardcoded version
- Single source of truth for Node.js version
```

---

### Task 4: Add Markdownlint + Lychee for Documentation Linting

**Goal:** The doc audit recommended markdownlint and lychee as drift prevention tools. Add them as devDependencies with configuration so documentation quality can be checked locally and optionally in CI.

**Files to Create:**
- `.markdownlint.json` — Markdownlint configuration file

**Files to Modify:**
- `package.json` — Add `markdownlint-cli2` as a devDependency, add `lint:docs` script

**Prerequisites:** None

**Implementation Steps:**
1. Install markdownlint:
   ```bash
   npm install --save-dev markdownlint-cli2
   ```
2. Create `.markdownlint.json` at project root with sensible defaults:
   ```json
   {
     "default": true,
     "MD013": false,
     "MD033": false,
     "MD041": false
   }
   ```
   - `MD013` (line length): disabled because README has badges and long URLs
   - `MD033` (inline HTML): disabled because README uses HTML for centering
   - `MD041` (first line heading): disabled because some docs start with frontmatter
3. Add a `lint:docs` script to `package.json`:
   ```json
   "lint:docs": "markdownlint-cli2 '**/*.md' '#node_modules'"
   ```
4. Run `npm run lint:docs` and fix any errors in `README.md` or other markdown files
5. Note on lychee: lychee is a Rust-based link checker best installed via system package manager or CI action (`lycheeverse/lychee-action`). Document its usage in a comment in `ci.yml` but do not add it as an npm dependency. Optionally add a CI step:
   ```yaml
   - name: Check links
     uses: lycheeverse/lychee-action@v2
     with:
       args: --no-progress '**/*.md'
   ```
6. Run verification checks

**Verification Checklist:**
- [ ] `markdownlint-cli2` is in `devDependencies`
- [ ] `.markdownlint.json` exists with configuration
- [ ] `npm run lint:docs` script exists and runs without errors
- [ ] Lychee usage is documented (CI step or comment)
- [ ] `npm test` passes
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes

**Testing Instructions:**
```bash
npm run lint:docs
```

**Commit Message Template:**
```
ci: add markdownlint for documentation linting

- Install markdownlint-cli2 and configure .markdownlint.json
- Add lint:docs script to package.json
- Document lychee link checker for optional CI integration
```

---

## Phase Verification

After all tasks are complete:

1. Run the full verification suite:
   ```bash
   npm run test:coverage
   npm run lint
   npx tsc --noEmit
   npm run lint:docs
   ```
2. Verify the following conditions:
   - CI runs `npm run test:coverage` (not `npm test`)
   - Coverage thresholds are enforced and passing
   - Pre-commit hooks run lint-staged on staged `.ts`/`.tsx` files
   - `.nvmrc` exists with value `24`
   - CI uses `.nvmrc` via `node-version-file`
   - Markdownlint configuration exists and `lint:docs` passes
3. Verify CI pipeline order is: lint -> test:coverage -> tsc

**Note on CI step order:** The existing order (lint -> test -> tsc) is already optimal. Lint is fastest and catches formatting issues early, test:coverage enforces both correctness and coverage, and tsc catches type-only errors last. No reordering is needed.
