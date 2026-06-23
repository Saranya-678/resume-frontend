import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const navStyle = {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
    background: "rgba(15,17,23,0.95)", backdropFilter: "blur(12px)",
    borderBottom: "1px solid #1e2130",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 32px", height: "64px",
  };

  const logoStyle = {
    fontSize: "20px", fontWeight: "700",
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
    textDecoration: "none",
  };

  const linkStyle = (active) => ({
    color: active ? "#4f46e5" : "#94a3b8",
    textDecoration: "none", fontSize: "14px", fontWeight: "500",
    padding: "6px 14px", borderRadius: "8px",
    background: active ? "rgba(79,70,229,0.1)" : "transparent",
    transition: "all 0.2s",
  });

  const btnStyle = {
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    color: "white", border: "none", borderRadius: "8px",
    padding: "8px 18px", fontSize: "14px", fontWeight: "600",
    cursor: "pointer",
  };

  return (
    <nav style={navStyle}>
      <Link to="/" style={logoStyle}>⚡ ResumeAI</Link>
      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
        <Link to="/" style={linkStyle(isActive("/"))}>Dashboard</Link>
        <Link to="/upload" style={linkStyle(isActive("/upload"))}>Upload</Link>
        <Link to="/resumes" style={linkStyle(isActive("/resumes"))}>Resumes</Link>
        <Link to="/analytics" style={linkStyle(isActive("/analytics"))}>Analytics</Link>
        <button onClick={logout} style={{ ...btnStyle, marginLeft: "12px" }}>Logout</button>
      </div>
    </nav>
  );
}
