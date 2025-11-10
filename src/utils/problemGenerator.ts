/**
 * Problem generation utilities for Practice mode
 * Ported from Android PracticeActivity.operatorEquation()
 */

export interface PracticeProblem {
  firstNumber: number;  // 4-digit number (1000-9999)
  secondNumber: number; // 3-digit number (100-999)
  answer: number;       // firstNumber * secondNumber
}

/**
 * Generates a random multiplication problem
 * First number: 4 digits (1000-9999)
 * Second number: 3 digits (100-999)
 *
 * BUG FIX: The original Android code (PracticeActivity.java lines 179-182) had
 * a logic error in the while loop where it swapped the assignment targets:
 *   - components[1] = mRnd.nextInt(10000); // Should be components[0]
 *   - components[0] = mRnd.nextInt(1000);  // Should be components[1]
 * This would regenerate wrong number ranges on retry. This implementation fixes
 * that bug by correctly regenerating both numbers in their proper ranges.
 */
export function generateProblem(): PracticeProblem {
  let firstNumber = Math.floor(Math.random() * 10000);
  let secondNumber = Math.floor(Math.random() * 1000);

  // Ensure minimum digit counts
  // Android bug fixed: now correctly regenerates both numbers in proper ranges
  while (firstNumber < 1000 || secondNumber < 100) {
    firstNumber = Math.floor(Math.random() * 10000);  // Correct: 4-digit range
    secondNumber = Math.floor(Math.random() * 1000);   // Correct: 3-digit range
  }

  const answer = firstNumber * secondNumber;

  return {
    firstNumber,
    secondNumber,
    answer,
  };
}

/**
 * Formats a problem as an equation string
 * Uses × symbol to match tutorial
 */
export function formatEquation(problem: PracticeProblem): string {
  return `${problem.firstNumber} × ${problem.secondNumber}`;
}

/**
 * Validates a problem meets digit requirements
 */
export function isValidProblem(problem: PracticeProblem): boolean {
  return (
    problem.firstNumber >= 1000 &&
    problem.firstNumber < 10000 &&
    problem.secondNumber >= 100 &&
    problem.secondNumber < 1000 &&
    problem.answer === problem.firstNumber * problem.secondNumber
  );
}
