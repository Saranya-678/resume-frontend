import React, { useEffect, useState } from "react";
import API from "../api";

export default function AllResumes() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(null);

  const fetchResumes = () => {
    setLoading(true);
    API.get("/api/resume/all")
      .then((res) => setResumes(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchResumes(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resume?")) return;
    setDeleting(id);
    try {
      await API.delete(`/api/resume/delete/${id}`);
      setResumes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert("Delete failed.");
    } finally {
      setDeleting(null);
    }
  };

  const handleSearchSkill = async () => {
    if (!search.trim()) return fetchResumes();
    setLoading(true);
    try {
      const res = await API.get(`/api/resume/skill/${search.trim()}`);
      setResumes(res.data);
    } catch {
      setResumes([]);
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score) => {
    if (score >= 80) return "#4ade80";
    if (score >= 50) return "#facc15";
    return "#f87171";
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>All Resumes</h1>
        <span style={styles.count}>{resumes.length} total</span>
      </div>

      {/* Search */}
      <div style={styles.searchBar}>
        <input
          placeholder="Search by skill (e.g. Java, React, Python)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearchSkill()}
          style={styles.searchInput}
        />
        <button onClick={handleSearchSkill} style={styles.searchBtn}>Search</button>
        <button onClick={() => { setSearch(""); fetchResumes(); }} style={styles.clearBtn}>Clear</button>
      </div>

      {loading ? (
        <div style={styles.loading}>Loading resumes...</div>
      ) : resumes.length === 0 ? (
        <div style={styles.empty}>
          <div style={{ fontSize: "48px" }}>🔍</div>
          <div>No resumes found</div>
        </div>
      ) : (
        <div style={styles.tableWrap}>
          <div style={styles.tableHeader}>
            <span>Email</span>
            <span>Phone</span>
            <span>Skills</span>
            <span>ATS Score</span>
            <span>Match %</span>
            <span>Action</span>
          </div>
          {resumes.map((r) => (
            <div key={r.id} style={styles.row}>
              <span style={styles.email}>{r.email}</span>
              <span style={styles.muted}>{r.phone || "—"}</span>
              <span style={styles.skills}>{r.skills || "—"}</span>
              <span style={{ color: scoreColor(r.atsScore), fontWeight: "700" }}>{r.atsScore}%</span>
              <span style={{ color: scoreColor(r.matchPercentage), fontWeight: "600" }}>{r.matchPercentage}%</span>
              <button
                onClick={() => handleDelete(r.id)}
                disabled={deleting === r.id}
                style={styles.deleteBtn}
              >
                {deleting === r.id ? "..." : "Delete"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { maxWidth: "1100px", margin: "0 auto", padding: "40px 24px" },
  header: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" },
  title: { fontSize: "28px", fontWeight: "700", color: "#f1f5f9" },
  count: {
    background: "rgba(79,70,229,0.15)", color: "#a5b4fc",
    padding: "4px 12px", borderRadius: "20px", fontSize: "13px", fontWeight: "600",
  },
  searchBar: { display: "flex", gap: "10px", marginBottom: "24px" },
  searchInput: {
    flex: 1, background: "#1a1d27", border: "1px solid #1e2130", borderRadius: "10px",
    padding: "12px 16px", color: "#f1f5f9", fontSize: "14px", outline: "none",
  },
  searchBtn: {
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)", color: "white",
    border: "none", borderRadius: "10px", padding: "12px 20px",
    fontSize: "14px", fontWeight: "600", cursor: "pointer",
  },
  clearBtn: {
    background: "#1a1d27", color: "#94a3b8", border: "1px solid #1e2130",
    borderRadius: "10px", padding: "12px 16px", fontSize: "14px", cursor: "pointer",
  },
  loading: { textAlign: "center", padding: "60px", color: "#64748b", fontSize: "16px" },
  empty: { textAlign: "center", padding: "60px", color: "#64748b", fontSize: "18px", display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" },
  tableWrap: { background: "#1a1d27", border: "1px solid #1e2130", borderRadius: "14px", overflow: "hidden" },
  tableHeader: {
    display: "grid", gridTemplateColumns: "2fr 1.2fr 2fr 1fr 1fr 0.8fr",
    padding: "14px 20px", background: "#0f1117",
    fontSize: "12px", fontWeight: "600", color: "#64748b",
    textTransform: "uppercase", letterSpacing: "0.05em",
  },
  row: {
    display: "grid", gridTemplateColumns: "2fr 1.2fr 2fr 1fr 1fr 0.8fr",
    padding: "14px 20px", borderTop: "1px solid #1e2130",
    fontSize: "14px", alignItems: "center",
  },
  email: { color: "#a5b4fc", fontWeight: "500" },
  muted: { color: "#94a3b8" },
  skills: { color: "#94a3b8", fontSize: "13px" },
  deleteBtn: {
    background: "rgba(239,68,68,0.1)", color: "#f87171",
    border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px",
    padding: "6px 12px", fontSize: "13px", cursor: "pointer",
  },
};
