// ============================================================
// index.js — React App Entry Point
// ============================================================
// This is the first file React executes.
// It mounts the <App /> component into the #root div
// defined in public/index.html.
// ============================================================

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // Global styles applied here

// Find the #root div in public/index.html and mount the app
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  // StrictMode helps catch bugs during development
  // (runs effects twice in dev, no impact on production build)
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
