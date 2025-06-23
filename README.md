<<<<<<< HEAD
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
=======
# 📣 YouCode - Spotify-style YouTube Code Generator

A beautiful, AI-enhanced, shareable code generator for YouTube links inspired by Spotify Codes.

![screenshot-placeholder](./screenshots/preview.png)

## 📁 Features
- 🎧 Generate stylized waveform QR codes for YouTube **videos, playlists, and channels**
- 🎨 Custom templates: Spotify-style rectangle cards, posters, or story-size exports
- 🌟 Always includes **YouTube branding** + AI layout suggestions
- 📍 Download as **PNG, SVG, PDF** for digital or print
- 🔍 Built-in scanner to test your code

## ⚡ Live Demo
[https://youcode.vercel.app](https://youcode.vercel.app) (Coming Soon)

## ⚖️ Tech Stack
- **React** + Tailwind CSS
- **Konva.js** / **Fabric.js** (Canvas layout)
- **QRCode.react**, **@zxing/browser**
- **YouTube Data API** (metadata)
- **html2canvas + jsPDF** for downloads
- **Vercel** for deployment

## 🌈 Screenshots
_**(To be added after MVP)**_
- Code Preview
- Customization Panel
- Export Interface

## 💡 Roadmap
- [x] Generate waveform-style barcode
- [x] Add color customization
- [x] Support YouTube video, playlist, channel
- [x] Multiple layout templates
- [x] Export options (PNG, SVG, PDF)
- [x] QR scanner
- [ ] AI-powered text & theme suggestions
- [ ] Batch QR generation

## ✉ Contributing
PRs welcome! Open issues or drop feature requests anytime.

## 🚫 License
MIT
>>>>>>> 958a703068b4360a4cc403acef01020a71c4292b
