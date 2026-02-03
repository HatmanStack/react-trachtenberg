import { tutorialSteps, TUTORIAL_EQUATION, TUTORIAL_STEP_COUNT } from '../../src/data/tutorialContent';

describe('Tutorial Content', () => {
  test('has correct number of steps', () => {
    expect(tutorialSteps.length).toBe(21);
    expect(TUTORIAL_STEP_COUNT).toBe(21);
  });

  test('has correct equation constant', () => {
    expect(TUTORIAL_EQUATION).toBe("123456 × 789");
  });

  test('first step contains introduction text', () => {
    const step0 = tutorialSteps[0];
    expect(step0).toBeDefined();
    expect(step0?.explanation).toContain('Trachtenberg system');
    expect(step0?.explanation).toContain('Jakow Trachtenberg');
    expect(step0?.answer).toBe('');
    expect(step0?.bottomArrow).toBe('');
  });

  test('step 2 has first calculation', () => {
    const step2 = tutorialSteps[2];
    expect(step2).toBeDefined();
    expect(step2?.explanation).toBe('Find the First Digit');
    expect(step2?.answer).toContain('9 x 6 = 54');
    expect(step2?.bottomArrow).toBe('4');
  });

  test('final step has completion message', () => {
    const step20 = tutorialSteps[20];
    expect(step20).toBeDefined();
    expect(step20?.explanation).toContain('Why Padding Matters');
    expect(step20?.answer).toContain('Click Next to Practice');
    expect(step20?.bottomArrow).toBe('6784');
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
