// // src/components/CameraScanner.jsx
// import React, { useRef, useEffect, useState } from 'react';
// import { detectBarsFromFrame } from '../utils/SmartBarDetector';

// export default function CameraScanner({ onScanSuccess, cvReady }) {
//   const videoRef = useRef(null);
//   const [scanning, setScanning] = useState(false);
//   const [message, setMessage] = useState('Align the code within the frame.');

//   useEffect(() => {
//     if (cvReady) {
//       navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
//         .then(stream => { videoRef.current.srcObject = stream; videoRef.current.play(); });
//     }
//   }, [cvReady]);

//   useEffect(() => {
//     if (!cvReady || !videoRef.current) return;

//     let frameCount = 0;
//     let intervalId;

//     const scanLoop = () => {
//       if (!videoRef.current) return;
//       const canvas = document.createElement('canvas');
//       canvas.width = videoRef.current.videoWidth;
//       canvas.height = videoRef.current.videoHeight;

//       const ctx = canvas.getContext('2d');
//       ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

//       try {
//         const detectedBars = detectBarsFromFrame(canvas);
//         onScanSuccess(detectedBars);
//         setMessage('✅ Match found! Redirecting...');
//         playBeep();
//         clearInterval(intervalId);
//       } catch (err) {
//         // Skip frames silently
//       }
//     };

//     intervalId = setInterval(() => {
//       if (frameCount % 3 === 0) scanLoop(); // Process every 3rd frame
//       frameCount++;
//     }, 300);

//     return () => clearInterval(intervalId);
//   }, [cvReady, onScanSuccess]);

//   const playBeep = () => {
//     const audio = new Audio('/beep.mp3'); // Add beep.mp3 to your public folder
//     audio.play();
//   };

//   return (
//     <div className="relative w-full max-w-md">
//       <video ref={videoRef} className="w-full rounded" />

//       {/* Frame Guidance Overlay */}
//       <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-4">
//         {[...Array(24)].map((_, i) => (
//           <div key={i} className="h-full border-l border-white/10" />
//         ))}
//       </div>

//       <p className="mt-4 text-center text-sm text-white">{message}</p>
//     </div>
//   );
// }

// src/components/CameraScanner.jsx
import React, { useRef, useState } from 'react';
import Tesseract from 'tesseract.js';

export default function CameraScanner({ onScanSuccess }) {
  const videoRef = useRef(null);
  const [scanning, setScanning] = useState(false);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    videoRef.current.play();
  };

  const captureImage = async () => {
    setScanning(true);
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/png');

    try {
      const result = await Tesseract.recognize(imageData, 'eng', {
        logger: m => console.log(m)
      });
      const detectedText = result.data.text.trim();
      console.log('Detected Text:', detectedText);

      if (detectedText.length > 0) {
        const videoId = detectedText.replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 11);
        window.location.href = `https://www.youtube.com/watch?v=${videoId}`;
      } else {
        alert('No valid code detected. Try again.');
      }
    } catch (err) {
      console.error('Error scanning:', err);
      alert('Error scanning. Please try again.');
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <video ref={videoRef} className="w-full max-w-md" />
      <button onClick={startCamera} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
        Start Camera
      </button>
      <button onClick={captureImage} className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">
        Capture & Scan
      </button>
      {scanning && <p>Scanning in progress…</p>}
    </div>
  );
}
