// ============================================================
// App.js — Root Component & Route Definitions
// ============================================================
// All page routes are defined here.
// Protected routes require a JWT token in localStorage.
// Public routes (login, register) are accessible to all.
// ============================================================

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import AllResumes from "./pages/AllResumes";
import Analytics from "./pages/Analytics";
import Navbar from "./components/Navbar";

// ------------------------------------------------------------
// PrivateRoute — Guards protected pages
// ------------------------------------------------------------
// If a JWT token exists in localStorage → allow access.
// If not → redirect to /login automatically.
// ------------------------------------------------------------
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

// ------------------------------------------------------------
// Layout — Wraps protected pages with the Navbar
// ------------------------------------------------------------
// paddingTop: 70px accounts for the fixed navbar height
// so page content doesn't hide behind it.
// ------------------------------------------------------------
function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "70px" }}>{children}</main>
    </>
  );
}

// ------------------------------------------------------------
// App — Route Map
// ------------------------------------------------------------
// /login       → Public — Login page
// /register    → Public — Register page
// /            → Protected — Dashboard
// /upload      → Protected — Upload a resume
// /resumes     → Protected — View all resumes
// /analytics   → Protected — Analytics charts
// *            → Any unknown URL redirects to Dashboard
// ------------------------------------------------------------
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes — wrapped in PrivateRoute + Layout */}
        <Route path="/" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
        <Route path="/upload" element={<PrivateRoute><Layout><Upload /></Layout></PrivateRoute>} />
        <Route path="/resumes" element={<PrivateRoute><Layout><AllResumes /></Layout></PrivateRoute>} />
        <Route path="/analytics" element={<PrivateRoute><Layout><Analytics /></Layout></PrivateRoute>} />

        {/* Fallback — redirect unknown URLs to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
