// ============================================================
// api.js — Axios Base Configuration
// ============================================================
// All API calls in this project go through this single file.
// This ensures the JWT token is automatically attached to
// every request without repeating code in each component.
// ============================================================

import axios from "axios";

// ------------------------------------------------------------
// BASE URL — pulled from environment variable
// ------------------------------------------------------------
// In Vercel: set REACT_APP_API_URL in Project → Settings → Environment Variables
// In local:  create a .env file and add REACT_APP_API_URL=http://localhost:8080
// ------------------------------------------------------------
const API = axios.create({
  baseURL: "https://ai-resume-analyzer-production-6db5.up.railway.app",
});

// ------------------------------------------------------------
// REQUEST INTERCEPTOR — Auto-attach JWT token
// ------------------------------------------------------------
// Before every API call, this interceptor checks localStorage
// for a saved JWT token and adds it to the Authorization header.
// This makes all protected routes work without manual headers.
// ------------------------------------------------------------
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
