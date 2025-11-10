import { tutorialSteps, TUTORIAL_EQUATION, TUTORIAL_STEP_COUNT } from '../../src/data/tutorialContent';

describe('Tutorial Content', () => {
  test('has correct number of steps', () => {
    expect(tutorialSteps.length).toBe(18);
    expect(TUTORIAL_STEP_COUNT).toBe(18);
  });

  test('has correct equation constant', () => {
    expect(TUTORIAL_EQUATION).toBe("123456 × 789");
  });

  test('first step contains introduction text', () => {
    expect(tutorialSteps[0].explanation).toContain('Trachtenberg system');
    expect(tutorialSteps[0].explanation).toContain('Jakow Trachtenberg');
    expect(tutorialSteps[0].answer).toBe('');
    expect(tutorialSteps[0].bottomArrow).toBe('');
  });

  test('step 2 has first calculation', () => {
    expect(tutorialSteps[2].explanation).toBe('Find the Second Digit');
    expect(tutorialSteps[2].answer).toContain('9 x 6 = 54');
    expect(tutorialSteps[2].bottomArrow).toBe('4');
  });

  test('final step has completion message', () => {
    expect(tutorialSteps[17].explanation).toContain('Continue this to find the last Four digits');
    expect(tutorialSteps[17].explanation).toContain('Click Next Practice');
    expect(tutorialSteps[17].bottomArrow).toBe('6784');
  });

  test('all steps have required properties', () => {
    tutorialSteps.forEach((step, index) => {
      expect(step.id).toBe(index);
      expect(typeof step.explanation).toBe('string');
      expect(typeof step.answer).toBe('string');
      expect(typeof step.bottomArrow).toBe('string');
    });
  });
});
