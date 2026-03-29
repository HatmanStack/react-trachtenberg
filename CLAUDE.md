# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Native/Expo app teaching the Trachtenberg method of rapid mental multiplication. Cross-platform (iOS, Android, Web) from a single TypeScript codebase.

## Commands

```bash
npm start              # Start Expo dev server
npm run web            # Run web version
npm test               # Run all tests
npm run test:watch     # Run tests in watch mode
npm run lint           # ESLint check
npm run lint:fix       # ESLint auto-fix
npx tsc --noEmit       # TypeScript type check
```

Run a single test file:
```bash
npx jest __tests__/utils/problemGenerator.test.ts
```

## Architecture

### State Management
All app state is centralized in `src/store/appStore.ts` using Zustand. This single store manages:
- Tutorial page position
- Practice mode state (current equation, answer progress, digit position)
- Hint system state (move tracking, current hint display)
- User settings (hints enabled)

### Navigation
Platform-specific navigation in `src/navigation/`:
- Web: `TabNavigator` with top tabs
- Mobile: `StackNavigator` with screen transitions
- Selection in `index.tsx` based on `Platform.OS`

### Core Algorithm: Trachtenberg Multiplication
The hint system in Practice mode implements the Trachtenberg algorithm for 4-digit × 3-digit multiplication:

**Key files (read together to understand the algorithm):**
- `src/utils/hintMoveTracker.ts` - Defines move patterns and digit indices for each answer position
- `src/utils/hintCalculator.ts` - Calculates individual hint steps (which digits to multiply, units vs tens)
- `src/store/appStore.ts` - Orchestrates hint progression via `nextHint()` action

**Move system:**
- Each answer digit (right to left, positions 0-6) has a specific number of "moves"
- Each move multiplies two specific digits and extracts either units or tens digit
- Pattern in `hintMoveTracker.ts`: position 0 has 1 move, position 1 has 3 moves, etc.
- `MOVES_COUNT` array defines boundaries: `[0, 1, 4, 9, 15, 21, 27, 33]`

### Practice Mode Flow
1. `generateProblem()` creates 4-digit × 3-digit multiplication
2. User builds answer digit-by-digit (right to left)
3. Four answer buttons show choices, one correct
4. Hints walk through Trachtenberg calculation when enabled
5. Carry digit propagates between positions via `remainderHint`

### Tutorial Content
Static 21-step tutorial in `src/data/tutorialContent.ts` using hardcoded example `123456 × 789`. Steps walk through the first four digits of the calculation with progressive bottom arrows showing accumulated answer.

## Testing

Tests in `__tests__/` mirror `src/` structure. Jest with jest-expo preset.

Coverage thresholds: 70% branches/functions, 80% lines/statements.

Key test files:
- `__tests__/utils/problemGenerator.test.ts` - Problem generation
- `__tests__/integration/hintSystem.test.ts` - Hint algorithm integration

## CI

GitHub Actions runs on push/PR to main: lint → test → TypeScript check
