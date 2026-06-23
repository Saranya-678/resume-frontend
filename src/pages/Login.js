import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/api/users/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>⚡</div>
        <h1 style={styles.title}>Welcome back</h1>
        <p style={styles.subtitle}>Sign in to ResumeAI</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email" required placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={styles.input}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password" required placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={styles.input}
            />
          </div>
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.link}>Register</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh", display: "flex", alignItems: "center",
    justifyContent: "center", background: "#0f1117", padding: "20px",
  },
  card: {
    background: "#1a1d27", border: "1px solid #1e2130", borderRadius: "20px",
    padding: "48px 40px", width: "100%", maxWidth: "420px",
    textAlign: "center", boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
  },
  logo: { fontSize: "48px", marginBottom: "16px" },
  title: { fontSize: "26px", fontWeight: "700", color: "#f1f5f9", marginBottom: "8px" },
  subtitle: { fontSize: "14px", color: "#64748b", marginBottom: "32px" },
  error: {
    background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
    color: "#f87171", borderRadius: "10px", padding: "12px 16px",
    fontSize: "14px", marginBottom: "20px",
  },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  field: { display: "flex", flexDirection: "column", gap: "8px", textAlign: "left" },
  label: { fontSize: "13px", fontWeight: "600", color: "#94a3b8" },
  input: {
    background: "#0f1117", border: "1px solid #1e2130", borderRadius: "10px",
    padding: "12px 16px", color: "#f1f5f9", fontSize: "15px", outline: "none",
    transition: "border 0.2s",
  },
  btn: {
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)", color: "white",
    border: "none", borderRadius: "10px", padding: "14px",
    fontSize: "16px", fontWeight: "600", cursor: "pointer", marginTop: "8px",
  },
  footer: { marginTop: "24px", fontSize: "14px", color: "#64748b" },
  link: { color: "#4f46e5", textDecoration: "none", fontWeight: "600" },
};
