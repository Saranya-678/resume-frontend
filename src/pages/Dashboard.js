import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

export default function Dashboard() {
  const [stats, setStats] = useState({ totalResumes: 0, averageScore: 0, topScore: 0 });
  const [topCandidates, setTopCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get("/api/resume/analytics"),
      API.get("/api/resume/top"),
    ]).then(([analyticsRes, topRes]) => {
      setStats(analyticsRes.data);
      setTopCandidates(topRes.data.slice(0, 5));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const scoreColor = (score) => {
    if (score >= 80) return "#4ade80";
    if (score >= 50) return "#facc15";
    return "#f87171";
  };

  if (loading) return <div style={styles.loading}>Loading dashboard...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Dashboard</h1>
        <Link to="/upload" style={styles.uploadBtn}>+ Upload Resume</Link>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        {[
          { label: "Total Resumes", value: stats.totalResumes, icon: "📄", color: "#4f46e5" },
          { label: "Average ATS Score", value: `${stats.averageScore}%`, icon: "📊", color: "#7c3aed" },
          { label: "Top Score", value: `${stats.topScore}%`, icon: "🏆", color: "#059669" },
        ].map((stat) => (
          <div key={stat.label} style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: stat.color + "22" }}>{stat.icon}</div>
            <div>
              <div style={styles.statValue}>{stat.value}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.actionsGrid}>
          {[
            { to: "/upload", icon: "📤", label: "Upload Resume", desc: "Analyze a new resume with AI" },
            { to: "/resumes", icon: "📋", label: "All Resumes", desc: "View and manage all resumes" },
            { to: "/analytics", icon: "📈", label: "Analytics", desc: "View detailed insights" },
          ].map((action) => (
            <Link to={action.to} key={action.to} style={styles.actionCard}>
              <span style={styles.actionIcon}>{action.icon}</span>
              <div>
                <div style={styles.actionLabel}>{action.label}</div>
                <div style={styles.actionDesc}>{action.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Top Candidates */}
      {topCandidates.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Top Candidates</h2>
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <span>Email</span><span>Phone</span><span>Skills</span><span>ATS Score</span>
            </div>
            {topCandidates.map((r) => (
              <div key={r.id} style={styles.tableRow}>
                <span style={styles.email}>{r.email}</span>
                <span style={{ color: "#94a3b8" }}>{r.phone}</span>
                <span style={{ color: "#94a3b8", fontSize: "13px" }}>{r.skills}</span>
                <span style={{ color: scoreColor(r.atsScore), fontWeight: "700" }}>{r.atsScore}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {topCandidates.length === 0 && (
        <div style={styles.empty}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>📂</div>
          <div style={{ fontSize: "18px", color: "#94a3b8" }}>No resumes yet</div>
          <Link to="/upload" style={{ color: "#4f46e5", marginTop: "8px", display: "block" }}>Upload your first resume →</Link>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { maxWidth: "1100px", margin: "0 auto", padding: "40px 24px" },
  loading: { textAlign: "center", padding: "80px", color: "#64748b", fontSize: "18px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" },
  title: { fontSize: "28px", fontWeight: "700", color: "#f1f5f9" },
  uploadBtn: {
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)", color: "white",
    textDecoration: "none", borderRadius: "10px", padding: "10px 20px",
    fontSize: "14px", fontWeight: "600",
  },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "40px" },
  statCard: {
    background: "#1a1d27", border: "1px solid #1e2130", borderRadius: "16px",
    padding: "24px", display: "flex", alignItems: "center", gap: "16px",
  },
  statIcon: { fontSize: "28px", padding: "12px", borderRadius: "12px" },
  statValue: { fontSize: "28px", fontWeight: "700", color: "#f1f5f9" },
  statLabel: { fontSize: "13px", color: "#64748b", marginTop: "4px" },
  section: { marginBottom: "40px" },
  sectionTitle: { fontSize: "18px", fontWeight: "600", color: "#f1f5f9", marginBottom: "16px" },
  actionsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" },
  actionCard: {
    background: "#1a1d27", border: "1px solid #1e2130", borderRadius: "14px",
    padding: "20px", display: "flex", alignItems: "center", gap: "14px",
    textDecoration: "none", transition: "border-color 0.2s",
  },
  actionIcon: { fontSize: "28px" },
  actionLabel: { fontSize: "15px", fontWeight: "600", color: "#f1f5f9" },
  actionDesc: { fontSize: "13px", color: "#64748b", marginTop: "4px" },
  table: { background: "#1a1d27", border: "1px solid #1e2130", borderRadius: "14px", overflow: "hidden" },
  tableHeader: {
    display: "grid", gridTemplateColumns: "2fr 1fr 2fr 1fr",
    padding: "14px 20px", background: "#0f1117",
    fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em",
  },
  tableRow: {
    display: "grid", gridTemplateColumns: "2fr 1fr 2fr 1fr",
    padding: "14px 20px", borderTop: "1px solid #1e2130",
    fontSize: "14px", alignItems: "center",
  },
  email: { color: "#a5b4fc", fontWeight: "500" },
  empty: { textAlign: "center", padding: "60px", color: "#64748b" },
};
