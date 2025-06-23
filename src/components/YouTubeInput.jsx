// src/components/YouTubeInput.jsx
import { useState } from 'react';

export default function YouTubeInput({ onGenerate }) {
  const [url, setUrl] = useState('');

  const handleGenerate = () => {
    if (!url.trim()) return;
    onGenerate(url.trim());
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste YouTube link here..."
        className="w-80 p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500 bg-gray-800 text-white"
      />
      <button
        onClick={handleGenerate}
        className="bg-gradient-to-r from-red-600 to-pink-600 p-3 rounded-lg text-white font-semibold hover:from-red-700 hover:to-pink-700 transition"
      >
        Generate Waveform Code
      </button>
    </div>
  );
}
