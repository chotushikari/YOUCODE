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
import React, { useState } from 'react';
import { detectBarsFromImage } from '../utils/SmartBarDetector';

export default function ImageScanner({ onScanSuccess, cvReady }) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleImageUpload = (e) => {
    if (!cvReady) {
      alert('Scanner is still loading. Please wait.');
      return;
    }

    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const img = new Image();
      img.src = event.target.result;
      setPreview(img.src);

      img.onload = async () => {
        try {
          setLoading(true);
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const detectedBars = await detectBarsFromImage(imageData, canvas);

          onScanSuccess(detectedBars);
        } catch (error) {
          alert(error.message || 'Failed to detect barcode.');
        } finally {
          setLoading(false);
        }
      };
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="bg-gray-700 text-white p-2 rounded cursor-pointer"
      />
      {loading && <p className="text-yellow-400">Scanning in progress...</p>}
      {preview && <img src={preview} alt="Preview" className="max-w-xs border p-2 rounded" />}
    </div>
  );
}
