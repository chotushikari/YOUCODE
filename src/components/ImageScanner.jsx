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
import React, { useRef } from 'react';

export default function ImageScanner({ onScanSuccess, cvReady }) {
  const fileInputRef = useRef();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      processImage(file);
    } else {
      alert('Please upload a valid image file.');
    }
  };

  const processImage = (file) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // ✅ Resize image to a consistent width
      const targetWidth = 500; // Standard width for processing
      const scale = targetWidth / img.width;
      canvas.width = targetWidth;
      canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      try {
        const detectedBars = detectBars(imageData, canvas);
        onScanSuccess(detectedBars);
      } catch (error) {
        alert(error.message);
      }
    };
    img.src = URL.createObjectURL(file);
  };

    const detectBars = (imageData, canvas) => {
    const cv = window.cv;

    const src = cv.matFromImageData(imageData);
    const gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

    // ✅ Apply Otsu’s Thresholding for universal compatibility
    const thresholded = new cv.Mat();
    cv.threshold(gray, thresholded, 0, 255, cv.THRESH_BINARY_INV + cv.THRESH_OTSU);

    // ✅ Sum pixel intensities vertically
    const columnSums = [];
    for (let x = 0; x < thresholded.cols; x++) {
        let sum = 0;
        for (let y = 0; y < thresholded.rows; y++) {
        sum += thresholded.ucharPtr(y, x)[0];
        }
        columnSums.push(sum);
    }

    // ✅ Smart bar detection
    const barCenters = [];
    let inBar = false;
    let barStart = 0;
    const threshold = Math.max(...columnSums) * 0.3;

    for (let x = 0; x < columnSums.length; x++) {
        if (columnSums[x] > threshold && !inBar) {
        inBar = true;
        barStart = x;
        } else if ((columnSums[x] <= threshold || x === columnSums.length - 1) && inBar) {
        inBar = false;
        const barCenter = (barStart + x - 1) / 2;
        barCenters.push(barCenter);
        }
    }

    if (barCenters.length < 10) {
        throw new Error('Not enough bars detected. Try a clearer image.');
    }

    // ✅ Always select 24 bars, centered
    const sortedBars = barCenters.sort((a, b) => a - b);
    let selectedBars = sortedBars;

    if (sortedBars.length > 24) {
        const start = Math.floor((sortedBars.length - 24) / 2);
        selectedBars = sortedBars.slice(start, start + 24);
    }

    // ✅ Measure heights precisely
    const barSignature = selectedBars.map(centerX => {
        let topY = 0;
        let bottomY = gray.rows - 1;

        for (let y = 0; y < gray.rows; y++) {
        if (thresholded.ucharPtr(y, Math.floor(centerX))[0] === 255) {
            topY = y;
            break;
        }
        }

        for (let y = gray.rows - 1; y >= 0; y--) {
        if (thresholded.ucharPtr(y, Math.floor(centerX))[0] === 255) {
            bottomY = y;
            break;
        }
        }

        const barHeight = bottomY - topY;

        return {
        position: (centerX / canvas.width) * 100,
        height: (barHeight / canvas.height) * 100
        };
    });

    // ✅ Cleanup
    src.delete();
    gray.delete();
    thresholded.delete();

    return barSignature;
    };


  return (
    <div className="flex flex-col items-center">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageUpload}
        className="mb-4"
      />
      <button
        onClick={() => fileInputRef.current.click()}
        className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
      >
        Upload Image for Scanning
      </button>
    </div>
  );
}
