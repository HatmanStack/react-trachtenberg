import React from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';
import { segmentText } from '../utils/textHighlighter';

interface HighlightedTextProps {
  text: string;
  highlightIndices?: number[];
  highlightColor: string;
  style?: StyleProp<TextStyle>;
}

/**
 * HighlightedText component renders text with specific characters highlighted
 * Replicates Android's SpannableString behavior using nested Text components
 */
export const HighlightedText: React.FC<HighlightedTextProps> = React.memo(
  ({ text, highlightIndices = [], highlightColor, style }) => {
    const segments = segmentText(text, highlightIndices);

    return (
      <Text style={style}>
        {segments.map((segment, index) => (
          <Text
            key={index}
            style={segment.isHighlighted ? { color: highlightColor } : undefined}
          >
            {segment.text}
          </Text>
        ))}
      </Text>
    );
  }
);

HighlightedText.displayName = 'HighlightedText';
