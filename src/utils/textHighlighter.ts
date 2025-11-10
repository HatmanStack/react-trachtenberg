/**
 * Text highlighting utilities for emphasizing specific characters
 * Replicates Android's SpannableString functionality
 */

export interface TextSegment {
  text: string;
  isHighlighted: boolean;
}

/**
 * Splits text into segments with highlight information
 * @param text - The full text to process
 * @param highlightIndices - Array of character indices to highlight (0-based)
 * @returns Array of segments with text and isHighlighted flag
 */
export function segmentText(
  text: string,
  highlightIndices: number[]
): TextSegment[] {
  if (highlightIndices.length === 0) {
    return [{ text, isHighlighted: false }];
  }

  const segments: TextSegment[] = [];
  const highlightSet = new Set(highlightIndices);
  let currentSegment = '';
  let currentlyHighlighted = false;

  for (let i = 0; i < text.length; i++) {
    const shouldHighlight = highlightSet.has(i);

    if (shouldHighlight !== currentlyHighlighted && currentSegment.length > 0) {
      // Start a new segment
      segments.push({
        text: currentSegment,
        isHighlighted: currentlyHighlighted,
      });
      currentSegment = '';
    }

    currentSegment += text[i];
    currentlyHighlighted = shouldHighlight;
  }

  // Push the last segment
  if (currentSegment.length > 0) {
    segments.push({
      text: currentSegment,
      isHighlighted: currentlyHighlighted,
    });
  }

  return segments;
}

/**
 * Finds character indices in a string
 * @param text - The text to search
 * @param targets - Characters to find
 * @returns Array of indices where targets appear
 */
export function findCharIndices(text: string, targets: string[]): number[] {
  const indices: number[] = [];
  const targetSet = new Set(targets);

  for (let i = 0; i < text.length; i++) {
    if (targetSet.has(text[i])) {
      indices.push(i);
    }
  }

  return indices;
}
