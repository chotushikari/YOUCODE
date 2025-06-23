import React, { useRef, useEffect, useState } from 'react';
import detectBarsFromImage from '../utils/SmartBarDetector';

export default function CameraScanner({ onScanSuccess, cvReady }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    if (cvReady) startCamera();

    return () => stopCamera();
  }, [cvReady]);

  const startCamera = async () => {
    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      videoRef.current.srcObject = cameraStream;
      setStream(cameraStream);
      requestAnimationFrame(scanFrame);
    } catch (error) {
      alert('Camera access denied or not available.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const scanFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0);

      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const detectedBars = detectBarsFromImage(imageData, canvas);

        if (detectedBars.length > 10) { // Detected threshold
          stopCamera();
          onScanSuccess(detectedBars);
          return;
        }
      } catch (error) {
        // Continue scanning
      }
    }

    requestAnimationFrame(scanFrame);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <video ref={videoRef} autoPlay playsInline muted className="w-full max-w-md rounded-lg" />
      <canvas ref={canvasRef} className="hidden" />
      <p className="text-gray-400 text-sm">Align your code inside the frame.</p>
    </div>
  );
}
