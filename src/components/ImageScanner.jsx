// // ✅ src/components/ImageScanner.jsx
// export default function ImageScanner({ onScanSuccess, cvReady }) {
//   // your scanner logic here


//     const detectBars = (imageData, canvas) => {
//     const cv = window.cv;

//     const src = cv.matFromImageData(imageData);
//     const gray = new cv.Mat();
//     cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

//     // Apply Gaussian Blur to smooth noise
//     const blurred = new cv.Mat();
//     cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);

//     // Vertical projection: Sum pixel intensities along the Y axis
//     const columnSums = [];
//     for (let x = 0; x < blurred.cols; x++) {
//         let sum = 0;
//         for (let y = 0; y < blurred.rows; y++) {
//         sum += blurred.ucharPtr(y, x)[0]; // Grayscale intensity
//         }
//         columnSums.push(sum);
//     }

//     // Dynamic Threshold Calculation
//     const minSum = Math.min(...columnSums);
//     const maxSum = Math.max(...columnSums);
//     const threshold = minSum + (maxSum - minSum) * 0.4; // Controls sensitivity

//     const barCenters = [];
//     let inBar = false;
//     let barStart = 0;

//     // Smart Bar Detection
//     for (let x = 0; x < columnSums.length; x++) {
//         if (columnSums[x] < threshold && !inBar) {
//         inBar = true;
//         barStart = x;
//         } else if ((columnSums[x] >= threshold || x === columnSums.length - 1) && inBar) {
//         inBar = false;
//         const barCenter = (barStart + x - 1) / 2;
//         barCenters.push(barCenter);
//         }
//     }

//     if (barCenters.length < 10) {
//         throw new Error('Not enough bars detected. Try a clearer image.');
//     }

//     // Sort and filter to select top 24 (closest to center if over-detected)
//     const totalWidth = canvas.width;
//     const totalHeight = canvas.height;

//     // Centering and ordering
//     const sortedBars = barCenters.sort((a, b) => a - b);

//     // If more than 24, pick center-most bars
//     let selectedBars = sortedBars;
//     if (sortedBars.length > 24) {
//         const start = Math.floor((sortedBars.length - 24) / 2);
//         selectedBars = sortedBars.slice(start, start + 24);
//     }

//     const barSignature = selectedBars.map(centerX => {
//         let topY = 0;
//         let bottomY = gray.rows - 1;

//         for (let y = 0; y < gray.rows; y++) {
//         if (gray.ucharPtr(y, Math.floor(centerX))[0] < 128) {
//             topY = y;
//             break;
//         }
//         }

//         for (let y = gray.rows - 1; y >= 0; y--) {
//         if (gray.ucharPtr(y, Math.floor(centerX))[0] < 128) {
//             bottomY = y;
//             break;
//         }
//         }

//         const barHeight = bottomY - topY;

//         return {
//         position: (centerX / totalWidth) * 100,
//         height: (barHeight / totalHeight) * 100
//         };
//     });

//     // Cleanup
//     src.delete();
//     gray.delete();
//     blurred.delete();

//     return barSignature;
//     };
// }

// ✅ src/components/ImageScanner.jsx
// ✅ src/components/ImageScanner.jsx
// src/components/ImageScanner.jsx
// src/components/ImageScanner.jsx
// src/components/ImageScanner.jsx
import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

export default function ImageScanner({ onScanSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/png') && !file.type.startsWith('image/jpeg')) {
      alert('Please upload a PNG or JPG file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      scanImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const scanImage = async (imageData) => {
    setLoading(true);
    try {
      const result = await Tesseract.recognize(imageData, 'eng', {
        logger: m => console.log(m)
      });
      const detectedText = result.data.text.trim();
      console.log('Detected Text:', detectedText);

      if (detectedText.length > 0) {
        const videoId = detectedText.replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 11); // Basic cleaning
        window.location.href = `https://www.youtube.com/watch?v=${videoId}`;
      } else {
        alert('No valid code detected. Try again with a clearer image.');
      }
    } catch (err) {
      console.error('Error scanning image:', err);
      alert('Error scanning image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input type="file" accept="image/png, image/jpeg" onChange={handleImageUpload} />
      {loading && <p>Scanning in progress…</p>}
    </div>
  );
}
