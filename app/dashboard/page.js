"use client";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchLinks();
  }, []);

  async function fetchLinks() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/links");
      const data = await res.json();

      // Support multiple response shapes: [] or { links: [] } or { data: [...] }
      let linksData = [];
      if (Array.isArray(data)) {
        linksData = data;
      } else if (Array.isArray(data.links)) {
        linksData = data.links;
      } else if (Array.isArray(data.data)) {
        linksData = data.data;
      } else {
        // fallback: find the first array inside the object
        const firstArray = Object.values(data).find((v) => Array.isArray(v));
        linksData = firstArray ?? [];
      }

      // Optional: log suspicious entries so you can inspect server response
      const bad = linksData.filter((l) => !l || typeof l.shortCode !== "string");
      if (bad.length > 0) {
        // eslint-disable-next-line no-console
        console.warn("fetchLinks: some items are missing shortCode or are invalid", bad);
      }

      setLinks(linksData);
    } catch (err) {
      setError("Failed to load links. Try again later.");
      setLinks([]);
      // eslint-disable-next-line no-console
      console.error("fetchLinks error:", err);
    }
    setLoading(false);
  }

  async function handleAdd(e) {
    e.preventDefault();
    setAdding(true);
    setError("");
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: newUrl })
      });
      const data = await res.json();
      if (res.ok && data.link && data.link.shortCode) {
        setLinks(prev => [data.link, ...prev]);
        setNewUrl("");
      } else {
        setError(data.error || "Error adding link");
      }
    } catch (err) {
      setError("Error adding link. Try again.");
      // eslint-disable-next-line no-console
      console.error("handleAdd error:", err);
    }
    setAdding(false);
  }

  // Filtered valid links for display (defensive)
  const validLinks = (links || []).filter(
    link => link && typeof link.shortCode === "string"
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f7fc",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column"
    }}>
      <div style={{
        maxWidth: 900,
        margin: "2rem auto",
        padding: 36,
        background: "#f8fafc",
        borderRadius: 18,
        boxShadow: "0 2px 18px #e7effa"
      }}>
        <h2 style={{ textAlign: "center", color: "#204060", fontSize: 28, marginBottom: 18 }}>
          Dashboard
        </h2>

        <form onSubmit={handleAdd} style={{ display: "flex", gap: 14, marginBottom: 26 }}>
          <input
            value={newUrl}
            onChange={e => setNewUrl(e.target.value)}
            placeholder="Paste URL here"
            style={{
              flex: 1,
              padding: "14px",
              fontSize: "1.12rem",
              borderRadius: 10,
              border: "2px solid #24314d",
              outline: "none"
            }}
            required
          />
          <button
            type="submit"
            disabled={adding}
            style={{
              padding: "14px 32px",
              borderRadius: 10,
              background: "#198460",
              color: "#fff",
              border: "none",
              fontWeight: 600,
              fontSize: 18,
              cursor: "pointer",
              boxShadow: "0 2px 8px #d9e9ff",
              opacity: adding ? 0.6 : 1
            }}
          >
            {adding ? "Adding..." : "Add"}
          </button>
        </form>

        {error && (
          <div style={{
            textAlign: "center",
            color: "#d23d3d",
            fontWeight: 600,
            margin: "12px 0"
          }}>
            {error}
          </div>
        )}

        <div style={{ overflowX: "auto" }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "18px",
            background: "#f7fcfa",
            boxShadow: "0 2px 10px #d5e6f2",
            borderRadius: "9px"
          }}>
            <thead>
              <tr style={{ background: "#e8f1fa" }}>
                <th style={thStyle}>Short Code</th>
                <th style={thStyle}>Target URL</th>
                <th style={thStyle}>Total Clicks</th>
                <th style={thStyle}>Last Clicked</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "32px" }}>
                    Loading...
                  </td>
                </tr>
              ) : validLinks.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "32px" }}>
                    No links found.
                  </td>
                </tr>
              ) : (
                validLinks.map((link, idx) => {
                  // extra guard inside map to be 100% safe
                  if (!link || typeof link.shortCode !== "string") return null;
                  return (
                    <tr key={link.shortCode ?? idx} style={{ background: "#f7fcfa" }}>
                      <td style={tdStyle}>
                        {/* route: /code/<shortCode> — adjust if your route is different */}
                        <a
                          href={`/code/${link.shortCode}`}
                          style={{ color: "#2196a8", textDecoration: "underline" }}
                        >
                          {link.shortCode}
                        </a>
                      </td>
                      <td style={{ ...tdStyle, wordBreak: "break-all" }}>{link.url}</td>
                      <td style={tdStyle}>{link.clicks ?? 0}</td>
                      <td style={tdStyle}>
                        {link.lastClicked ? new Date(link.lastClicked).toLocaleString() : "Never"}
                      </td>
                      <td style={tdStyle}>
                        <button
                          // Provide your actual delete logic
                          style={{
                            background: "#e64747",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            padding: "8px 14px",
                            cursor: "pointer"
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const thStyle = {
  padding: "14px 10px",
  border: "2px solid #244",
  color: "#244",
  fontWeight: 700,
  textAlign: "left"
};

const tdStyle = {
  padding: "14px 10px",
  border: "1px solid #bdd2e5"
};
