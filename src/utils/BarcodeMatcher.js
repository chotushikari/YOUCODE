// src/utils/BarcodeMatcher.js

// Normalizes bar positions and heights to percentages
export function normalizeBars(bars) {
  if (bars.length === 0) return [];

  const minX = Math.min(...bars.map(bar => bar.position));
  const maxX = Math.max(...bars.map(bar => bar.position));
  const minHeight = Math.min(...bars.map(bar => bar.height));
  const maxHeight = Math.max(...bars.map(bar => bar.height));

  return bars.map(bar => ({
    // Position as percentage (0 - 100)
    position: ((bar.position - minX) / (maxX - minX)) * 100,
    // Height as percentage (0 - 100)
    height: ((bar.height - minHeight) / (maxHeight - minHeight)) * 100
  }));
}

// Compares two bar sequences with smart tolerance
export function compareBarSequences(barsA, barsB) {
  if (barsA.length !== barsB.length) return false;

  const positionTolerance = 6; // percent
  const heightTolerance = 10; // percent

  for (let i = 0; i < barsA.length; i++) {
    const posDiff = Math.abs(barsA[i].position - barsB[i].position);
    const heightDiff = Math.abs(barsA[i].height - barsB[i].height);

    if (posDiff > positionTolerance || heightDiff > heightTolerance) {
      return false;
    }
  }

  return true;
}
