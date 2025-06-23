// src/utils/BarcodeEngine.js

export const extractVideoId = (url) => {
  const regex = /(?:v=|\/)([0-9A-Za-z_-]{11}).*/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export async function generateBars(videoId, barCount = 24) {
  const encoder = new TextEncoder();
  const data = encoder.encode(videoId);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const bars = [];

  for (let i = 0; i < barCount; i++) {
    const value = hashArray[i];
    const height = Math.max((value / 255) * 50 + 15, 10); // 10px min height, max ~65px
    bars.push({ height });
  }

  return bars;
}

export function getCenterOutBars(bars) {
  const centerIndex = Math.floor(bars.length / 2);
  const leftBars = bars.slice(0, centerIndex).reverse();
  const rightBars = bars.slice(centerIndex);
  return [...leftBars, ...rightBars];
}

