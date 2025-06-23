// // src/utils/SVGDownloader.js

// // Download as SVG
// export function downloadSVG(svgElement) {
//   const serializer = new XMLSerializer();
//   const source = serializer.serializeToString(svgElement);

//   const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
//   const url = URL.createObjectURL(svgBlob);

//   const link = document.createElement('a');
//   link.href = url;
//   link.download = 'waveform-code.svg';
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);

//   URL.revokeObjectURL(url);
// }

// // Download as PNG
// export function downloadPNG(svgElement) {
//   const serializer = new XMLSerializer();
//   const source = serializer.serializeToString(svgElement);

//   const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
//   const url = URL.createObjectURL(svgBlob);

//   const img = new Image();
//   img.onload = () => {
//     const canvas = document.createElement('canvas');
//     canvas.width = img.width;
//     canvas.height = img.height;

//     const ctx = canvas.getContext('2d');
//     ctx.drawImage(img, 0, 0);

//     canvas.toBlob(blob => {
//       const pngUrl = URL.createObjectURL(blob);

//       const link = document.createElement('a');
//       link.href = pngUrl;
//       link.download = 'waveform-code.png';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       URL.revokeObjectURL(pngUrl);
//     });
//   };
//   img.src = url;
// }

// src/utils/SVGDownloader.js

// src/utils/SVGDownloader.js

// ✅ Download SVG as .svg file
export function downloadSVG(svgElement) {
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svgElement);

  const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'waveform.svg';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ✅ Download SVG as PNG
export function downloadSVGAsPNG(svgElement) {
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svgElement);

  const image = new Image();
  const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  image.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);

    canvas.toBlob((blob) => {
      const pngUrl = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = 'waveform.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(pngUrl);
    });
    URL.revokeObjectURL(url);
  };

  image.src = url;
}
