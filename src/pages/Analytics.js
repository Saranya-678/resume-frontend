import React, { useEffect, useState } from "react";
import API from "../api";

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [topCandidates, setTopCandidates] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get("/api/resume/analytics"),
      API.get("/api/resume/top"),
      API.get("/api/resume/count"),
    ]).then(([a, t, c]) => {
      setAnalytics(a.data);
      setTopCandidates(t.data);
      setCount(c.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={styles.loading}>Loading analytics...</div>;

  const scoreColor = (score) => {
    if (score >= 80) return "#4ade80";
    if (score >= 50) return "#facc15";
    return "#f87171";
  };

  const barWidth = (score) => `${Math.min(score, 100)}%`;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Analytics</h1>
      <p style={styles.subtitle}>Insights across all analyzed resumes</p>

      {/* KPI Cards */}
      <div style={styles.kpiGrid}>
        {[
          { label: "Total Resumes", value: count, icon: "📄", color: "#4f46e5" },
          { label: "Average ATS Score", value: `${analytics?.averageScore ?? 0}%`, icon: "📊", color: "#7c3aed" },
          { label: "Highest Score", value: `${analytics?.topScore ?? 0}%`, icon: "🏆", color: "#059669" },
          {
            label: "Above 80% Score",
            value: topCandidates.filter((r) => r.atsScore >= 80).length,
            icon: "⭐", color: "#d97706",
          },
        ].map((k) => (
          <div key={k.label} style={styles.kpiCard}>
            <div style={{ ...styles.kpiIcon, background: k.color + "22" }}>{k.icon}</div>
            <div style={{ ...styles.kpiValue, color: k.color }}>{k.value}</div>
            <div style={styles.kpiLabel}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Score Distribution */}
      {topCandidates.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Score Distribution — All Candidates</h2>
          <div style={styles.barChart}>
            {topCandidates.map((r) => (
              <div key={r.id} style={styles.barRow}>
                <div style={styles.barEmail}>{r.email}</div>
                <div style={styles.barTrack}>
                  <div style={{
                    ...styles.barFill,
                    width: barWidth(r.atsScore),
                    background: `linear-gradient(90deg, ${scoreColor(r.atsScore)}88, ${scoreColor(r.atsScore)})`,
                  }} />
                </div>
                <div style={{ ...styles.barScore, color: scoreColor(r.atsScore) }}>{r.atsScore}%</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Score Buckets */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Score Breakdown</h2>
        <div style={styles.bucketGrid}>
          {[
            { label: "Excellent (80–100%)", color: "#4ade80", filter: (r) => r.atsScore >= 80 },
            { label: "Good (50–79%)", color: "#facc15", filter: (r) => r.atsScore >= 50 && r.atsScore < 80 },
            { label: "Needs Work (0–49%)", color: "#f87171", filter: (r) => r.atsScore < 50 },
          ].map((bucket) => {
            const count = topCandidates.filter(bucket.filter).length;
            const pct = topCandidates.length > 0 ? Math.round((count / topCandidates.length) * 100) : 0;
            return (
              <div key={bucket.label} style={{ ...styles.bucketCard, borderColor: bucket.color + "44" }}>
                <div style={{ ...styles.bucketNum, color: bucket.color }}>{count}</div>
                <div style={styles.bucketLabel}>{bucket.label}</div>
                <div style={styles.bucketPct}>{pct}% of total</div>
              </div>
            );
          })}
        </div>
      </div>

      {topCandidates.length === 0 && (
        <div style={styles.empty}>
          <div style={{ fontSize: "48px" }}>📊</div>
          <div>No data yet — upload some resumes to see analytics</div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { maxWidth: "1000px", margin: "0 auto", padding: "40px 24px" },
  loading: { textAlign: "center", padding: "80px", color: "#64748b", fontSize: "18px" },
  title: { fontSize: "28px", fontWeight: "700", color: "#f1f5f9", marginBottom: "8px" },
  subtitle: { fontSize: "15px", color: "#64748b", marginBottom: "32px" },
  kpiGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "40px" },
  kpiCard: {
    background: "#1a1d27", border: "1px solid #1e2130", borderRadius: "16px",
    padding: "24px 20px", textAlign: "center",
  },
  kpiIcon: { fontSize: "28px", padding: "10px", borderRadius: "12px", display: "inline-block", marginBottom: "12px" },
  kpiValue: { fontSize: "32px", fontWeight: "800" },
  kpiLabel: { fontSize: "12px", color: "#64748b", marginTop: "6px", fontWeight: "500" },
  section: { marginBottom: "36px" },
  sectionTitle: { fontSize: "18px", fontWeight: "600", color: "#f1f5f9", marginBottom: "16px" },
  barChart: {
    background: "#1a1d27", border: "1px solid #1e2130", borderRadius: "14px",
    padding: "24px", display: "flex", flexDirection: "column", gap: "14px",
  },
  barRow: { display: "grid", gridTemplateColumns: "2fr 4fr 60px", gap: "12px", alignItems: "center" },
  barEmail: { fontSize: "13px", color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  barTrack: { background: "#0f1117", borderRadius: "99px", height: "10px", overflow: "hidden" },
  barFill: { height: "100%", borderRadius: "99px", transition: "width 0.6s ease" },
  barScore: { fontSize: "13px", fontWeight: "700", textAlign: "right" },
  bucketGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" },
  bucketCard: {
    background: "#1a1d27", border: "1px solid", borderRadius: "14px",
    padding: "24px", textAlign: "center",
  },
  bucketNum: { fontSize: "40px", fontWeight: "800" },
  bucketLabel: { color: "#e2e8f0", fontSize: "14px", fontWeight: "500", marginTop: "8px" },
  bucketPct: { color: "#64748b", fontSize: "13px", marginTop: "4px" },
  empty: { textAlign: "center", padding: "60px", color: "#64748b", fontSize: "16px", display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" },
};
