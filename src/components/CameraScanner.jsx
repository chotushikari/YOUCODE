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
import React, { useEffect, useRef, useState } from 'react';
import Tesseract from 'tesseract.js';

export default function CameraScanner({ onScanSuccess }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState('');

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const captureAndScan = async () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    setScanning(true);
    setResult('Scanning...');

    try {
      const { data: { text } } = await Tesseract.recognize(canvas, 'eng', {
        logger: m => console.log(m)
      });

      console.log('Detected Text:', text);
      const cleanedText = text.replace(/[^A-Z0-9]/gi, '').trim();

      if (cleanedText.length === 0) {
        setResult('No code detected. Try again.');
        setScanning(false);
        return;
      }

      setResult(`Code Detected: ${cleanedText}`);
      setScanning(false);
      onScanSuccess(cleanedText);
    } catch (err) {
      console.error('Error scanning:', err);
      setResult('Error during scanning.');
      setScanning(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <video ref={videoRef} autoPlay playsInline className="max-w-sm rounded" />
      <canvas ref={canvasRef} className="hidden" />
      <button
        onClick={captureAndScan}
        className="mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded"
      >
        Capture & Scan
      </button>
      {scanning && <p className="text-yellow-400">Scanning in progress...</p>}
      {result && <p className="text-green-400">{result}</p>}
    </div>
  );
}
