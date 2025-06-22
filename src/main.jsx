import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { createRoot } from 'react-dom/client';
import "./index.css"; // ✅ Ensure Tailwind CSS is loaded

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
