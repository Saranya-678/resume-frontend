import React, { useState, useRef } from "react";
import API from "../api";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  const handleFile = (f) => {
    if (f && f.type === "application/pdf") {
      setFile(f); setError(""); setResult(null);
    } else {
      setError("Please upload a PDF file only.");
    }
  };

  const handleSubmit = async () => {
    if (!file) return setError("Please select a PDF file.");
    setLoading(true); setError(""); setResult(null);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await API.post("/api/resume/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score) => {
    if (score >= 80) return "#4ade80";
    if (score >= 50) return "#facc15";
    return "#f87171";
  };

  const scoreBg = (score) => {
    if (score >= 80) return "rgba(74,222,128,0.1)";
    if (score >= 50) return "rgba(250,204,21,0.1)";
    return "rgba(248,113,113,0.1)";
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Upload Resume</h1>
      <p style={styles.subtitle}>Upload a PDF resume for AI-powered ATS analysis</p>

      {/* Drop Zone */}
      <div
        style={{ ...styles.dropZone, borderColor: dragging ? "#4f46e5" : file ? "#059669" : "#1e2130" }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
        onClick={() => fileRef.current.click()}
      >
        <input ref={fileRef} type="file" accept=".pdf" style={{ display: "none" }}
          onChange={(e) => handleFile(e.target.files[0])} />
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>{file ? "✅" : "📄"}</div>
        {file ? (
          <>
            <div style={{ color: "#4ade80", fontWeight: "600", fontSize: "16px" }}>{file.name}</div>
            <div style={{ color: "#64748b", fontSize: "13px", marginTop: "4px" }}>
              {(file.size / 1024).toFixed(1)} KB · Click to change
            </div>
          </>
        ) : (
          <>
            <div style={{ color: "#94a3b8", fontSize: "16px", fontWeight: "500" }}>
              Drag & drop your PDF here
            </div>
            <div style={{ color: "#64748b", fontSize: "13px", marginTop: "6px" }}>or click to browse</div>
          </>
        )}
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <button onClick={handleSubmit} disabled={loading || !file} style={{
        ...styles.btn, opacity: (!file || loading) ? 0.6 : 1,
        cursor: (!file || loading) ? "not-allowed" : "pointer",
      }}>
        {loading ? "⏳ Analyzing..." : "🔍 Analyze Resume"}
      </button>

      {/* Results */}
      {result && (
        <div style={styles.results}>
          <h2 style={styles.resultsTitle}>Analysis Results</h2>

          {/* Score cards */}
          <div style={styles.scoreGrid}>
            <div style={{ ...styles.scoreCard, background: scoreBg(result.atsScore), borderColor: scoreColor(result.atsScore) + "44" }}>
              <div style={{ ...styles.scoreBig, color: scoreColor(result.atsScore) }}>{result.atsScore}%</div>
              <div style={styles.scoreLabel}>ATS Score</div>
            </div>
            <div style={{ ...styles.scoreCard, background: scoreBg(result.matchPercentage), borderColor: scoreColor(result.matchPercentage) + "44" }}>
              <div style={{ ...styles.scoreBig, color: scoreColor(result.matchPercentage) }}>{result.matchPercentage}%</div>
              <div style={styles.scoreLabel}>Skill Match</div>
            </div>
          </div>

          {/* Contact Info */}
          <div style={styles.infoCard}>
            <h3 style={styles.cardTitle}>📇 Contact Info</h3>
            <div style={styles.infoGrid}>
              <div><span style={styles.infoLabel}>Email</span><span style={styles.infoValue}>{result.email}</span></div>
              <div><span style={styles.infoLabel}>Phone</span><span style={styles.infoValue}>{result.phone}</span></div>
              <div><span style={styles.infoLabel}>LinkedIn</span><span style={styles.infoValue}>{result.linkedin}</span></div>
            </div>
          </div>

          <div style={styles.twoCol}>
            {/* Skills Found */}
            <div style={styles.infoCard}>
              <h3 style={styles.cardTitle}>✅ Skills Found</h3>
              <div style={styles.tagGrid}>
                {result.skills?.length > 0
                  ? result.skills.map((s) => <span key={s} style={styles.tagGreen}>{s}</span>)
                  : <span style={{ color: "#64748b" }}>No skills detected</span>}
              </div>
            </div>

            {/* Missing Skills */}
            <div style={styles.infoCard}>
              <h3 style={styles.cardTitle}>❌ Missing Skills</h3>
              <div style={styles.tagGrid}>
                {result.missingSkills?.length > 0
                  ? result.missingSkills.map((s) => <span key={s} style={styles.tagRed}>{s}</span>)
                  : <span style={{ color: "#4ade80" }}>All key skills present!</span>}
              </div>
            </div>
          </div>

          {/* Suggestions */}
          {result.suggestions?.length > 0 && (
            <div style={styles.infoCard}>
              <h3 style={styles.cardTitle}>💡 Suggestions</h3>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                {result.suggestions.map((s, i) => (
                  <li key={i} style={styles.suggestion}>
                    <span style={{ color: "#4f46e5", marginRight: "10px" }}>→</span>{s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Certifications */}
          {result.certifications?.length > 0 && (
            <div style={styles.infoCard}>
              <h3 style={styles.cardTitle}>🏅 Certifications Detected</h3>
              <div style={styles.tagGrid}>
                {result.certifications.map((c) => <span key={c} style={styles.tagBlue}>{c}</span>)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { maxWidth: "800px", margin: "0 auto", padding: "40px 24px" },
  title: { fontSize: "28px", fontWeight: "700", color: "#f1f5f9", marginBottom: "8px" },
  subtitle: { fontSize: "15px", color: "#64748b", marginBottom: "32px" },
  dropZone: {
    border: "2px dashed", borderRadius: "16px", padding: "60px 20px",
    textAlign: "center", cursor: "pointer", transition: "all 0.2s",
    background: "#1a1d27", marginBottom: "20px",
  },
  error: {
    background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
    color: "#f87171", borderRadius: "10px", padding: "12px 16px",
    fontSize: "14px", marginBottom: "16px",
  },
  btn: {
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)", color: "white",
    border: "none", borderRadius: "12px", padding: "14px 32px",
    fontSize: "16px", fontWeight: "600", width: "100%", marginBottom: "32px",
  },
  results: { display: "flex", flexDirection: "column", gap: "20px" },
  resultsTitle: { fontSize: "22px", fontWeight: "700", color: "#f1f5f9" },
  scoreGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  scoreCard: {
    border: "1px solid", borderRadius: "16px", padding: "28px",
    textAlign: "center",
  },
  scoreBig: { fontSize: "48px", fontWeight: "800", lineHeight: 1 },
  scoreLabel: { color: "#94a3b8", fontSize: "14px", marginTop: "8px", fontWeight: "500" },
  infoCard: {
    background: "#1a1d27", border: "1px solid #1e2130",
    borderRadius: "14px", padding: "24px",
  },
  cardTitle: { fontSize: "16px", fontWeight: "600", color: "#f1f5f9", marginBottom: "16px" },
  infoGrid: { display: "flex", flexDirection: "column", gap: "10px" },
  infoLabel: { fontSize: "12px", color: "#64748b", fontWeight: "600", textTransform: "uppercase", marginRight: "12px" },
  infoValue: { color: "#e2e8f0", fontSize: "14px" },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  tagGrid: { display: "flex", flexWrap: "wrap", gap: "8px" },
  tagGreen: {
    background: "rgba(74,222,128,0.1)", color: "#4ade80",
    border: "1px solid rgba(74,222,128,0.3)", borderRadius: "8px",
    padding: "4px 12px", fontSize: "13px", fontWeight: "500",
  },
  tagRed: {
    background: "rgba(248,113,113,0.1)", color: "#f87171",
    border: "1px solid rgba(248,113,113,0.3)", borderRadius: "8px",
    padding: "4px 12px", fontSize: "13px", fontWeight: "500",
  },
  tagBlue: {
    background: "rgba(79,70,229,0.1)", color: "#a5b4fc",
    border: "1px solid rgba(79,70,229,0.3)", borderRadius: "8px",
    padding: "4px 12px", fontSize: "13px", fontWeight: "500",
  },
  suggestion: {
    background: "#0f1117", borderRadius: "8px", padding: "10px 14px",
    fontSize: "14px", color: "#cbd5e1", display: "flex", alignItems: "center",
  },
};
