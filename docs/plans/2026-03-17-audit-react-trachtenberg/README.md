# Audit Remediation Plan: react-trachtenberg

## Overview

This plan remediates findings from three concurrent audits of the `react-trachtenberg` codebase: a repository health audit (23 tech debt findings), a 12-pillar evaluation (scores ranging 4/10 to 8/10), and a documentation drift audit (8 drift, 3 gaps, 2 stale, 2 stale code examples). The app is a cross-platform Expo/React Native educational tool that teaches the Trachtenberg multiplication system through an interactive tutorial and practice mode with a step-by-step hint system.

The codebase is in FAIR health. The most significant issues are: a monolithic Zustand store acting as a god object (272 lines, 15 state fields, 8 actions), module-scoped mutable timer state with no lifecycle cleanup, stale `Dimensions.get('window')` reads at module scope, an entire dead navigation system (~140 lines across 4 files plus `App.tsx`), a broken carry/remainder calculation hardcoded to zero, placeholder and skipped tests, and pervasive documentation drift (README claims AsyncStorage persistence that does not exist, wrong tutorial step count, stale clone path).

Remediation follows a strict sequence: subtractive cleanup first, then corrective code fixes, then additive guardrails, and finally documentation. Each phase is tagged with the implementer role responsible.

## Prerequisites

- Node.js v24 (as used in CI)
- npm (with committed `package-lock.json`)
- Run `npm ci` to install dependencies
- Run `npm test` to verify baseline (Jest)
- Run `npm run lint` to verify linting (ESLint)
- Run `npx tsc --noEmit` to verify type checking

## Phase Summary

| Phase | Tag | Goal | Est. Tokens |
|-------|-----|------|-------------|
| 0 | -- | Foundation: ADRs, conventions, testing strategy | ~3,000 |
| 1 | [HYGIENIST] | Dead code removal, unused dependency cleanup, dead test cleanup | ~12,000 |
| 2 | [IMPLEMENTER] | Bug fixes, performance fixes, architecture improvements, test gaps | ~25,000 |
| 3 | [FORTIFIER] | CI hardening, pre-commit hooks, coverage enforcement | ~8,000 |
| 4 | [DOC-ENGINEER] | README rewrite, manual-validation.md update, JSDoc fixes | ~10,000 |

## Navigation

- [Phase-0.md](./Phase-0.md) — Foundation (ADRs, conventions, testing strategy)
- [Phase-1.md](./Phase-1.md) — [HYGIENIST] Dead code and dependency cleanup
- [Phase-2.md](./Phase-2.md) — [IMPLEMENTER] Bug fixes, architecture, performance, tests
- [Phase-3.md](./Phase-3.md) — [FORTIFIER] CI, hooks, guardrails
- [Phase-4.md](./Phase-4.md) — [DOC-ENGINEER] Documentation fixes
- [feedback.md](./feedback.md) — Review feedback tracking
