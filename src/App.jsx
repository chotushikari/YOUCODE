
// import React, { useState, useEffect } from 'react';
// import YouTubeInput from './components/YouTubeInput';
// import WaveformDisplay from './components/WaveformDisplay';
// import ImageScanner from './components/ImageScanner';
// import CameraScanner from './components/CameraScanner';

// import { extractVideoId, generateBars, getCenterOutBars } from './utils/BarcodeEngine';
// import { generateQRCodeDataURL } from './utils/QRCodeGenerator';
// import { normalizeBars, compareBarSequences } from './utils/BarcodeMatcher';

// const storedBarcodes = []; // Simulated in-memory storage

// export default function App() {
//   const [bars, setBars] = useState([]);
//   const [qrDataURL, setQrDataURL] = useState('');
//   const [cvReady, setCvReady] = useState(false);
//   const [view, setView] = useState('home'); // 'home' | 'scanner' | 'camera'

//   // Load OpenCV.js
//   useEffect(() => {
//     if (window.cv && window.cv.Mat) {
//       setCvReady(true);
//       return;
//     }
//     const script = document.createElement('script');
//     script.src = 'https://docs.opencv.org/4.5.0/opencv.js';
//     script.async = true;
//     script.onload = () => {
//       const checkOpenCV = () => {
//         if (window.cv && window.cv.Mat) {
//           setCvReady(true);
//         } else {
//           setTimeout(checkOpenCV, 100);
//         }
//       };
//       checkOpenCV();
//     };
//     document.head.appendChild(script);
//   }, []);

//   // Handle YouTube Link Generate
//   const handleGenerate = async (youtubeUrl) => {
//     const videoId = extractVideoId(youtubeUrl);
//     if (!videoId) {
//       alert('Invalid YouTube URL!');
//       return;
//     }

//     const rawBars = await generateBars(videoId);
//     const centerOutBars = getCenterOutBars(rawBars);
//     setBars(centerOutBars);

//     // Save to memory
//     storedBarcodes.push({
//       videoId,
//       bars: normalizeBars(centerOutBars)
//     });

//     const qrURL = await generateQRCodeDataURL(`https://www.youtube.com/watch?v=${videoId}`);
//     setQrDataURL(qrURL);
//   };

//   // Scanner Result Handler
//   const handleScanSuccess = (detectedBars) => {
//     const normalizedScanned = normalizeBars(detectedBars);

//     const matched = storedBarcodes.find(item =>
//       compareBarSequences(normalizedScanned, item.bars)
//     );

//     if (matched) {
//       window.location.href = `https://www.youtube.com/watch?v=${matched.videoId}`;
//     } else {
//       alert('No matching YouTube video found.');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col items-center justify-center gap-8 p-6">
//       <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
//         YouCode
//       </h1>

//       {view === 'home' && (
//         <>
//           <YouTubeInput onGenerate={handleGenerate} />

//           <div className="flex gap-4 mt-4">
//             <button
//               onClick={() => setView('scanner')}
//               className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded"
//             >
//               Scan Image
//             </button>

//             <button
//               onClick={() => setView('camera')}
//               className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded"
//             >
//               Camera Scanner
//             </button>
//           </div>

//           {bars.length > 0 && (
//             <div className="mt-10">
//               <WaveformDisplay
//                 bars={bars}
//                 barColor="#00CFFF"
//                 bgColor="#121212"
//                 qrDataURL={qrDataURL} // Optional hidden QR layer
//               />
//             </div>
//           )}
//         </>
//       )}

//       {view === 'scanner' && (
//         <div className="mt-10">
//           <ImageScanner onScanSuccess={handleScanSuccess} cvReady={cvReady} />
//           <button
//             onClick={() => setView('home')}
//             className="mt-6 bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded"
//           >
//             Back
//           </button>
//         </div>
//       )}

//       {view === 'camera' && (
//         <div className="mt-10">
//           <CameraScanner onScanSuccess={handleScanSuccess} cvReady={cvReady} />
//           <button
//             onClick={() => setView('home')}
//             className="mt-6 bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded"
//           >
//             Back
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// src/App.jsx
import React, { useState, useEffect } from 'react';
import YouTubeInput from './components/YouTubeInput';
import WaveformDisplay from './components/WaveformDisplay';
import ImageScanner from './components/ImageScanner';
import CameraScanner from './components/CameraScanner';

import { extractVideoId, generateBars, getCenterOutBars } from './utils/BarcodeEngine';
import { generateQRCodeDataURL } from './utils/QRCodeGenerator';
import { normalizeBars, compareBarSequences } from './utils/BarcodeMatcher';

const storedBarcodes = []; // In-memory storage for this session

export default function App() {
  const [bars, setBars] = useState([]);
  const [qrDataURL, setQrDataURL] = useState('');
  const [cvReady, setCvReady] = useState(false);
  const [view, setView] = useState('home'); // 'home' | 'scanner' | 'camera'

  // Load OpenCV.js once
  useEffect(() => {
    if (window.cv && window.cv.Mat) {
      setCvReady(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://docs.opencv.org/4.5.0/opencv.js';
    script.async = true;
    script.onload = () => {
      const checkOpenCV = () => {
        if (window.cv && window.cv.Mat) {
          setCvReady(true);
        } else {
          setTimeout(checkOpenCV, 100);
        }
      };
      checkOpenCV();
    };
    document.head.appendChild(script);
  }, []);

  // ✅ Generate YouTube barcode
  const handleGenerate = async (youtubeUrl) => {
    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      alert('Invalid YouTube URL!');
      return;
    }

    const rawBars = await generateBars(videoId);
    const centerOutBars = getCenterOutBars(rawBars);
    setBars(centerOutBars);

    // Save the signature for matching
    storedBarcodes.push({
      videoId,
      bars: normalizeBars(centerOutBars)
    });

    const qrURL = await generateQRCodeDataURL(`https://www.youtube.com/watch?v=${videoId}`);
    setQrDataURL(qrURL);
  };

  // ✅ Handle scanner result
  const handleScanSuccess = (detectedBars) => {
    const normalizedScanned = normalizeBars(detectedBars);

    const matched = storedBarcodes.find(item =>
      compareBarSequences(normalizedScanned, item.bars)
    );

    if (matched) {
      window.location.href = `https://www.youtube.com/watch?v=${matched.videoId}`;
    } else {
      alert('No matching YouTube video found.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col items-center justify-center gap-8 p-6">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
        YouCode
      </h1>

      {/* Home View */}
      {view === 'home' && (
        <>
          <YouTubeInput onGenerate={handleGenerate} />

          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setView('scanner')}
              className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded"
            >
              Scan Image
            </button>

            <button
              onClick={() => setView('camera')}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded"
            >
              Camera Scanner
            </button>
          </div>

          {bars.length > 0 && (
            <div className="mt-10">
              <WaveformDisplay
                bars={bars}
                barColor="#00CFFF"
                bgColor="#121212"
                qrDataURL={qrDataURL}
              />
            </div>
          )}
        </>
      )}

      {/* Image Scanner View */}
      {view === 'scanner' && (
        <div className="mt-10">
          <ImageScanner onScanSuccess={handleScanSuccess} cvReady={cvReady} />
          <button
            onClick={() => setView('home')}
            className="mt-6 bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded"
          >
            Back
          </button>
        </div>
      )}

      {/* Camera Scanner View */}
      {view === 'camera' && (
        <div className="mt-10">
          <CameraScanner onScanSuccess={handleScanSuccess} cvReady={cvReady} />
          <button
            onClick={() => setView('home')}
            className="mt-6 bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}
