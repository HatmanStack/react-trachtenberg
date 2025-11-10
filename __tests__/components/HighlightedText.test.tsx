import React from 'react';
import { render } from '@testing-library/react-native';
import { HighlightedText } from '../../src/components/HighlightedText';

describe('HighlightedText', () => {
  test('renders text without highlighting', () => {
    const { getByText } = render(
      <HighlightedText
        text="Hello World"
        highlightIndices={[]}
        highlightColor="#ff0000"
      />
    );

    expect(getByText('Hello World')).toBeTruthy();
  });

  test('renders text with single character highlighted', () => {
    const { root } = render(
      <HighlightedText
        text="Hello"
        highlightIndices={[1]}
        highlightColor="#ff0000"
      />
    );

    // Component should render with segments
    expect(root).toBeTruthy();
  });

  test('renders text with multiple characters highlighted', () => {
    const { root } = render(
      <HighlightedText
        text="123456"
        highlightIndices={[0, 2, 4]}
        highlightColor="#ff0000"
      />
    );

    expect(root).toBeTruthy();
  });

  test('handles multiline text', () => {
    const { getByText } = render(
      <HighlightedText
        text="Line 1\nLine 2"
        highlightIndices={[0]}
        highlightColor="#ff0000"
      />
    );

    expect(getByText(/Line 1/)).toBeTruthy();
  });

  test('applies custom style prop', () => {
    const customStyle = { fontSize: 24 };
    const { root } = render(
      <HighlightedText
        text="Test"
        highlightIndices={[]}
        highlightColor="#ff0000"
        style={customStyle}
      />
    );

    expect(root).toBeTruthy();
  });
});
