# Phase 0 — Foundation

All subsequent phases inherit the decisions, conventions, and strategies defined here.

---

## Architecture Decisions

### ADR-1: No Store Slice Refactor in This Plan

**Decision:** We will NOT split `appStore.ts` into domain slices (tutorial, practice, hint, settings) in this remediation round.

**Rationale:** The eval recommends splitting the monolithic store, but the store is 272 lines and the app has only 3 screens. A slice refactor is a feature-scale change that risks regressions in a codebase with thin test coverage. Instead, we will:
- Extract pure business logic OUT of store actions into utility functions (testable without the store)
- Fix the module-scoped timer to use store middleware or cleanup pattern
- Keep the single store file but reduce its action complexity

This can be revisited when test coverage is stronger.

### ADR-2: Keep Branded Types as Dead Code Removal Target

**Decision:** The branded type system in `src/types/index.ts` (lines 22-89) will be removed as dead code in Phase 1.

**Rationale:** The branded types (`Digit`, `IndexPosition`, `MoveNumber`, `ButtonIndex`) with their guards and factory functions are never used anywhere in the codebase. The store and all utilities pass raw `number` values. Keeping unused infrastructure misleads developers. If branded types are desired in the future, they should be adopted incrementally with actual usage.

### ADR-3: Preserve ErrorBoundary Component Logic

**Decision:** The `ErrorBoundary` component code will be relocated from the dead `App.tsx` entry point into the live Expo Router layout.

**Rationale:** The ErrorBoundary implementation is correct and valuable, but it never runs because `App.tsx` is dead code. Rather than deleting it, we will integrate it into `app/_layout.tsx` where it will actually catch errors.

### ADR-4: Fix Carry Bug via Store, Not Validator

**Decision:** The hardcoded `newRemainder = 0` in `answerValidator.ts:59` will remain as-is because the carry is correctly computed in `appStore.ts:170` (`Math.floor(state.remainderHint / 10)`). The validator's remainder output is not consumed for carry purposes.

**Rationale:** The store already computes carry correctly from the hint system's `remainderHint`. The validator's `newRemainder` field is only used to pass back to the store, which immediately overwrites it with the real carry value. Fixing the validator would require duplicating the hint system's carry logic. Instead, we will add a code comment documenting this intentional design and add a test verifying the store's carry behavior.

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Expo | ~54.0 | App framework |
| React Native | 0.81.5 | UI layer |
| expo-router | ~6.0 | File-based routing (authoritative) |
| Zustand | ^5.0 | State management |
| TypeScript | ~5.9 | Type safety (`strict` mode enabled) |
| Jest (jest-expo) | ^30.2 / ^54.0 | Unit and integration testing |
| ESLint | ^9.39 | Linting |
| react-native-paper | ^5.14 | UI component library |

---

## Testing Strategy

### Test Runner
- Jest via `jest-expo` preset, node environment
- Run: `npm test`
- Coverage: `npm run test:coverage`

### Test Location
- All tests live in `__tests__/` mirroring `src/` structure
- Example: `src/utils/answerValidator.ts` -> `__tests__/utils/answerValidator.test.ts`

### Mocking Approach
- Pure utility functions (`src/utils/*`): test directly, no mocking needed
- Store tests: use `zustand`'s `create` directly in test, call actions, assert state
- React Native APIs: mock via `jest.setup.js` (already configured)
- No live network calls, no cloud resources

### Test Naming Convention
```
describe('[ModuleName]', () => {
  describe('[functionName]', () => {
    it('should [expected behavior] when [condition]', () => {});
  });
});
```

### Coverage Thresholds (existing in jest.config.js)
- Branches: 70%
- Functions: 70%
- Lines: 80%
- Statements: 80%

---

## Commit Message Format

All commits use conventional commits:

```
type(scope): brief description

- Detail 1
- Detail 2
```

Types used in this plan:
- `chore`: dead code removal, dependency cleanup, config changes
- `fix`: bug fixes, correctness improvements
- `perf`: performance improvements
- `test`: adding or fixing tests
- `ci`: CI pipeline changes
- `docs`: documentation changes

Scopes: `deps`, `navigation`, `types`, `store`, `practice`, `settings`, `learn`, `hints`, `ci`, `docs`

---

## Shared Patterns

### Verification After Every Task
After each task, run all three checks:
```bash
npm test
npm run lint
npx tsc --noEmit
```
All three must pass before committing.

### File Deletion Protocol
When deleting files, also:
1. Remove any imports referencing the deleted file
2. Remove any test files that exclusively test the deleted code
3. Remove any path aliases in `jest.config.js` or `tsconfig.json` that only served the deleted code
4. Verify `npm test`, `npm run lint`, and `npx tsc --noEmit` still pass
