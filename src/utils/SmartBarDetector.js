// src/utils/SmartScannerUtils.js

export const detectBarsFromFrame = (canvas) => {
  const cv = window.cv;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const src = cv.matFromImageData(imageData);
  const gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  const blurred = new cv.Mat();
  cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);

  // Vertical projection
  const columnSums = [];
  for (let x = 0; x < blurred.cols; x++) {
    let sum = 0;
    for (let y = 0; y < blurred.rows; y++) {
      sum += blurred.ucharPtr(y, x)[0];
    }
    columnSums.push(sum);
  }

  const minSum = Math.min(...columnSums);
  const maxSum = Math.max(...columnSums);
  const threshold = minSum + (maxSum - minSum) * 0.4;

  const barCenters = [];
  let inBar = false;
  let barStart = 0;

  for (let x = 0; x < columnSums.length; x++) {
    if (columnSums[x] < threshold && !inBar) {
      inBar = true;
      barStart = x;
    } else if ((columnSums[x] >= threshold || x === columnSums.length - 1) && inBar) {
      inBar = false;
      const barCenter = (barStart + x - 1) / 2;
      barCenters.push(barCenter);
    }
  }

  if (barCenters.length < 10) {
    throw new Error('Not enough bars detected. Try a clearer image.');
  }

  // Select 24 bars (center-most if more)
  const sortedBars = barCenters.sort((a, b) => a - b);
  let selectedBars = sortedBars;
  if (sortedBars.length > 24) {
    const start = Math.floor((sortedBars.length - 24) / 2);
    selectedBars = sortedBars.slice(start, start + 24);
  }

  const totalWidth = canvas.width;
  const totalHeight = canvas.height;

  const barSignature = selectedBars.map(centerX => {
    let topY = 0;
    let bottomY = gray.rows - 1;

    for (let y = 0; y < gray.rows; y++) {
      if (gray.ucharPtr(y, Math.floor(centerX))[0] < 128) {
        topY = y;
        break;
      }
    }

    for (let y = gray.rows - 1; y >= 0; y--) {
      if (gray.ucharPtr(y, Math.floor(centerX))[0] < 128) {
        bottomY = y;
        break;
      }
    }

    const barHeight = bottomY - topY;

    return {
      position: (centerX / totalWidth) * 100,
      height: (barHeight / totalHeight) * 100
    };
  });

  src.delete();
  gray.delete();
  blurred.delete();

  return barSignature;
};
