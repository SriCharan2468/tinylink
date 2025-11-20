"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const navLinks = [
  { name: "Home", path: "/home" },
  { name: "Dashboard", path: "/" },
  { name: "Stats", path: "/code" },
  { name: "Health Check", path: "/healthz" }
];

// Helper to format date
function formatDate(dateStr) {
  if (!dateStr) return "Never";
  const date = new Date(dateStr);
  return date.toLocaleString();
}

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [search, setSearch] = useState("");
  const [url, setUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [addError, setAddError] = useState("");
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  useEffect(() => {
    async function fetchLinks() {
      let query = "/api/links";
      if (search) query += `?code=${encodeURIComponent(search)}`;
      const res = await fetch(query);
      const data = await res.json();
      setLinks(data.links || []);
    }
    fetchLinks();
  }, [search]);

  async function handleAdd(e) {
    e.preventDefault();
    setAddError("");
    if (!url) {
      setAddError("Enter URL");
      return;
    }
    const res = await fetch("/api/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, shortCode }),
    });
    const data = await res.json();
    if (res.ok && data.shortCode) {
      setUrl("");
      setShortCode("");
      setAddError("");
      setLinks(current => [data.link, ...current]);
    } else {
      setAddError(data.error || "Failed to add");
    }
  }

  async function handleDelete(code) {
    if (!confirm(`Delete link ${code}?`)) return;
    const res = await fetch(`/api/delete?code=${code}`, { method: "DELETE" });
    if (res.ok) {
      setLinks(current => current.filter(l => l.shortCode !== code));
    } else {
      alert("Failed to delete");
    }
  }

  const displayedLinks = !search
    ? links
    : links.filter(link => link.shortCode.includes(search));

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f5f9ff" }}>
      <aside style={{
        width: "240px",
        background: "#24314d",
        color: "#fafcff",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        paddingTop: "32px",
        boxShadow: "2px 0 8px rgba(60,60,110,0.1)"
      }}>
        {navLinks.map((link, idx) => {
          const isActive = currentPath === link.path;
          return (
            <Link href={link.path} key={link.name} passHref>
              <div
                style={{
                  width: "100%",
                  padding: "14px 20px",
                  marginBottom: "8px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  background: isActive ? "#485980" : "inherit",
                  color: isActive ? "#eef2fb" : "#f5f9ff",
                  transition: "background 0.18s, color 0.18s"
                }}
              >
                {link.name}
              </div>
            </Link>
          );
        })}
      </aside>
      <main style={{ flex: 1, padding: "48px 0" }}>
        <div style={{ maxWidth: "980px", margin: "0 auto", background: "#f5fbfa", borderRadius: "18px", boxShadow: "0 6px 24px rgba(80,100,120,0.07)", padding: "24px 30px" }}>
          <h2 style={{ fontSize: "2rem", color: "#2a385a", marginBottom: "24px", textAlign: "center" }}>
            Dashboard
          </h2>
          <form style={{ display: "flex", gap: "16px", marginBottom: "24px", alignItems: "center", flexWrap: "wrap", justifyContent: "center" }} onSubmit={handleAdd}>
            <input
              type="text"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="Enter URL"
              style={{
                padding: "12px",
                borderRadius: "6px",
                border: "2px solid #2696a8",
                width: "300px",
                fontSize: "1rem",
                background: "#e9f7fc"
              }}
            />
            <input
              type="text"
              value={shortCode}
              onChange={e => setShortCode(e.target.value)}
              placeholder="Custom code (optional)"
              style={{
                padding: "12px",
                borderRadius: "6px",
                border: "2px solid #2696a8",
                width: "180px",
                fontSize: "1rem",
                background: "#e9f7fc"
              }}
            />
            <button
              type="submit"
              style={{
                background: "#2696a8",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "12px 28px",
                fontWeight: 500,
                cursor: "pointer"
              }}
            >Add</button>
            {addError && <span style={{ color: "#cd3849", marginLeft: "18px" }}>{addError}</span>}
          </form>
          <div style={{
            marginBottom: "22px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            justifyContent: "center"
          }}>
            <span style={{
              fontSize: "1.02rem",
              color: "#2a385a",
              fontWeight: 600
            }}>
              Search links by code:
            </span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="code"
              style={{
                padding: "11px",
                borderRadius: "6px",
                border: "2.5px solid #2a385a",
                minWidth: "200px",
                background: "#eef3fa",
                fontSize: "1rem"
              }}
            />
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "#fff",
              border: "3px solid #2a385a",
              color: "#223350",
              fontSize: "1.07rem"
            }}>
              <thead>
                <tr style={{ background: "#d7f2fa", fontWeight: 600 }}>
                  <th style={{ padding: "14px", border: "3px solid #2a385a" }}>Short Code</th>
                  <th style={{ padding: "14px", border: "3px solid #2a385a" }}>Target URL</th>
                  <th style={{ padding: "14px", border: "3px solid #2a385a" }}>Total Clicks</th>
                  <th style={{ padding: "14px", border: "3px solid #2a385a" }}>Last Clicked</th>
                  <th style={{ padding: "14px", border: "3px solid #2a385a" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedLinks.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: "center", padding: "28px", color: "#469ba7" }}>No links found.</td></tr>
                ) : (
                  displayedLinks.map(link => (
                    <tr key={link.shortCode} style={{ background: "#f7fcfa" }}>
                      <td style={{ padding: "16px 10px", border: "3px solid #2a385a", fontWeight: 600 }}>
                        <a href={`/${link.shortCode}`} style={{ color: "#2196a8", textDecoration: "underline" }}>{link.shortCode}</a>
                      </td>
                      <td style={{ padding: "16px 10px", border: "3px solid #2a385a", wordBreak: "break-word" }}>{link.url}</td>
                      <td style={{ padding: "16px 10px", border: "3px solid #2a385a" }}>{link.clicks ?? 0}</td>
                      <td style={{ padding: "16px 10px", border: "3px solid #2a385a" }}>{formatDate(link.lastClicked)}</td>
                      <td style={{ padding: "16px 10px", border: "3px solid #2a385a" }}>
                        <button
                          onClick={() => handleDelete(link.shortCode)}
                          style={{
                            background: "#cd3849",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            padding: "8px 16px",
                            marginRight: "12px",
                            cursor: "pointer",
                            fontWeight: 600
                          }}
                        >Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
