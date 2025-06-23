// // // src/components/WaveformDisplay.jsx
// // export default function WaveformDisplay({ bars }) {
// //   return (
// //     <div className="flex items-center justify-center p-4 bg-black rounded-xl">
// //       <svg width="400" height="80" viewBox="0 0 400 80" className="waveform-svg">
// //         {/* Spotify-like bar gradient */}
// //         <defs>
// //           <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
// //             <stop offset="0%" stopColor="#FFFFFF" />
// //             <stop offset="100%" stopColor="#FFFFFF" />
// //           </linearGradient>
// //         </defs>

// //         {/* Spotify logo placeholder */}
// //         <circle cx="30" cy="40" r="20" fill="white" />
// //         <text x="30" y="45" textAnchor="middle" fontSize="20" fill="black">▶️</text>

// //         {/* Beautiful Spotify-style bars */}
// //         {bars.map((bar, index) => (
// //           <rect
// //             key={index}
// //             x={70 + index * 10} // Spotify spacing
// //             y={80 - bar.height}
// //             width={6} // Spotify-style slim bar
// //             height={bar.height}
// //             rx={3} // Rounded bars like Spotify
// //             fill="url(#waveGradient)"
// //           />
// //         ))}
// //       </svg>
// //     </div>
// //   );
// // }

// // src/components/WaveformDisplay.jsx
// // src/components/WaveformDisplay.jsx
// // src/components/WaveformDisplay.jsx
// // src/components/WaveformDisplay.jsx

// // src/components/WaveformDisplay.jsx

// // src/components/WaveformDisplay.jsx
// import { downloadSVG, downloadPNG } from '../utils/SVGDownloader';

// export default function WaveformDisplay({
//   bars,
//   barColor = '#00CFFF',
//   bgColor = '#121212',
//   iconColor = '#FF0000'
// }) {
//   return (
//     <div className="flex flex-col items-center justify-center p-6 rounded-xl" style={{ backgroundColor: bgColor }}>
//       <svg
//         className="waveform-svg w-full h-auto max-w-[600px]" // Responsive
//         viewBox="0 0 500 80"
//         preserveAspectRatio="xMinYMid meet"
//       >
//         {/* YouTube Icon */}
//         <g transform="translate(20, 10) scale(1.2)">
//           <path
//             fill={iconColor}
//             d="M45.4 14.7c-.5-1.9-2-3.4-3.9-3.9C38.1 10 24 10 24 10s-14.1 0-17.5.8c-1.9.5-3.4 2-3.9 3.9C2 18.1 2 25 2 25s0 6.9.6 10.3c.5 1.9 2 3.4 3.9 3.9C9.9 40 24 40 24 40s14.1 0 17.5-.8c1.9-.5 3.4-2 3.9-3.9.6-3.4.6-10.3.6-10.3s0-6.9-.6-10.3zM19 31V19l12 6-12 6z"
//           />
//         </g>

//         {/* Bars */}
//         {bars.map((bar, index) => (
//           <rect
//             key={index}
//             x={100 + index * 14}
//             y={(80 - bar.height) / 2}
//             width={8}
//             height={bar.height}
//             rx={5}
//             fill={barColor}
//           />
//         ))}
//       </svg>

//       {/* Download Buttons */}
//       <div className="flex gap-4 mt-4">
//         <button
//           onClick={() => downloadSVG(document.querySelector('.waveform-svg'))}
//           className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
//         >
//           Download SVG
//         </button>

//         <button
//           onClick={() => downloadPNG(document.querySelector('.waveform-svg'))}
//           className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
//         >
//           Download PNG
//         </button>
//       </div>
//     </div>
//   );
// }
// src/components/WaveformDisplay.jsx
import { downloadPNG, downloadSVG } from '../utils/SVGDownloader';

export default function WaveformDisplay({
  bars,
  barColor = '#00CFFF',
  bgColor = '#121212',
  iconColor = '#FF0000',
  shortCode
}) {
  return (
    <div className="flex items-center justify-center p-6 rounded-xl" style={{ backgroundColor: bgColor }}>
      <svg
        className="waveform-svg w-full h-auto max-w-[600px]"
        viewBox="0 0 500 120"
        preserveAspectRatio="xMinYMid meet"
      >
        {/* YouTube Icon */}
        <g transform="translate(20, 10) scale(1.2)">
          <path
            fill={iconColor}
            d="M45.4 14.7c-.5-1.9-2-3.4-3.9-3.9C38.1 10 24 10 24 10s-14.1 0-17.5.8c-1.9.5-3.4 2-3.9 3.9C2 18.1 2 25 2 25s0 6.9.6 10.3c.5 1.9 2 3.4 3.9 3.9C9.9 40 24 40 24 40s14.1 0 17.5-.8c1.9-.5 3.4-2 3.9-3.9.6-3.4.6-10.3.6-10.3s0-6.9-.6-10.3zM19 31V19l12 6-12 6z"
          />
        </g>

        {/* Waveform Bars */}
        {bars.map((bar, index) => (
          <rect
            key={index}
            x={100 + index * 14}
            y={(80 - bar.height) / 2}
            width={8}
            height={bar.height}
            rx={5}
            fill={barColor}
          />
        ))}

        {/* Short Code Display */}
        <text
          x="250"
          y="110"
          textAnchor="middle"
          fontSize="20"
          fill={barColor}
          style={{ fontFamily: 'monospace', letterSpacing: '5px' }}
        >
          {shortCode}
        </text>
      </svg>

      {/* Download Options */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => downloadPNG(document.querySelector('.waveform-svg'))}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Download PNG
        </button>

        <button
          onClick={() => downloadSVG(document.querySelector('.waveform-svg'))}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
        >
          Download SVG
        </button>
      </div>
    </div>
  );
}
