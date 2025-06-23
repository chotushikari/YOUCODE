// src/components/CameraScanner.jsx
import React, { useEffect, useRef, useState } from 'react';
import { detectBarsFromImage } from '../utils/SmartBarDetector';

export default function CameraScanner({ onScanSuccess, cvReady }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [message, setMessage] = useState('Align your waveform code in the frame');

  useEffect(() => {
    if (!cvReady) return;

    const constraints = { video: { facingMode: 'environment' }, audio: false };
    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch((err) => {
        alert('Camera access denied or not available.');
      });

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [cvReady]);

  const processFrame = async () => {
    if (!scanning) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    try {
      const detectedBars = await detectBarsFromImage(imageData, canvas);
      onScanSuccess(detectedBars);
    } catch (error) {
      // Try again on next frame
    }

    requestAnimationFrame(processFrame);
  };

  const startScanning = () => {
    setScanning(true);
    processFrame();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <video ref={videoRef} className="w-full max-w-md rounded" />
      <canvas ref={canvasRef} className="hidden" />

      <p className="text-yellow-400">{message}</p>

      {!scanning && (
        <button
          onClick={startScanning}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Start Scanning
        </button>
      )}
    </div>
  );
}
