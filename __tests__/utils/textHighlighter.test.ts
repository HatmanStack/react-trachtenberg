import { segmentText, findCharIndices } from '../../src/utils/textHighlighter';

describe('textHighlighter utilities', () => {
  describe('segmentText', () => {
    test('returns single segment when no highlights', () => {
      const result = segmentText('hello world', []);
      expect(result).toEqual([
        { text: 'hello world', isHighlighted: false }
      ]);
    });

    test('highlights single character', () => {
      const result = segmentText('hello', [1]);
      expect(result).toEqual([
        { text: 'h', isHighlighted: false },
        { text: 'e', isHighlighted: true },
        { text: 'llo', isHighlighted: false }
      ]);
    });

    test('highlights multiple consecutive characters', () => {
      const result = segmentText('hello', [1, 2, 3]);
      expect(result).toEqual([
        { text: 'h', isHighlighted: false },
        { text: 'ell', isHighlighted: true },
        { text: 'o', isHighlighted: false }
      ]);
    });

    test('highlights multiple non-consecutive characters', () => {
      const result = segmentText('hello', [1, 3]);
      expect(result).toEqual([
        { text: 'h', isHighlighted: false },
        { text: 'e', isHighlighted: true },
        { text: 'l', isHighlighted: false },
        { text: 'l', isHighlighted: true },
        { text: 'o', isHighlighted: false }
      ]);
    });

    test('handles highlight at start', () => {
      const result = segmentText('hello', [0]);
      expect(result).toEqual([
        { text: 'h', isHighlighted: true },
        { text: 'ello', isHighlighted: false }
      ]);
    });

    test('handles highlight at end', () => {
      const result = segmentText('hello', [4]);
      expect(result).toEqual([
        { text: 'hell', isHighlighted: false },
        { text: 'o', isHighlighted: true }
      ]);
    });

    test('handles multiline text', () => {
      const result = segmentText('hello\nworld', [0, 6]);
      expect(result).toEqual([
        { text: 'h', isHighlighted: true },
        { text: 'ello\n', isHighlighted: false },
        { text: 'w', isHighlighted: true },
        { text: 'orld', isHighlighted: false }
      ]);
    });

    test('ignores out-of-bounds indices', () => {
      const result = segmentText('hello', [1, 100]);
      expect(result).toEqual([
        { text: 'h', isHighlighted: false },
        { text: 'e', isHighlighted: true },
        { text: 'llo', isHighlighted: false }
      ]);
    });
  });

  describe('findCharIndices', () => {
    test('finds single character', () => {
      const result = findCharIndices('hello world', ['o']);
      expect(result).toEqual([4, 7]);
    });

    test('finds multiple different characters', () => {
      const result = findCharIndices('hello world', ['l', 'o']);
      expect(result).toEqual([2, 3, 4, 7, 9]);
    });

    test('returns empty array when no matches', () => {
      const result = findCharIndices('hello', ['x', 'y']);
      expect(result).toEqual([]);
    });

    test('handles empty target array', () => {
      const result = findCharIndices('hello', []);
      expect(result).toEqual([]);
    });

    test('works with numbers in strings', () => {
      const result = findCharIndices('123456 × 789', ['3', '9']);
      expect(result).toEqual([2, 11]);
    });
  });
});
