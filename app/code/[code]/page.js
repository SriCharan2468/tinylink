"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CodeStatsPage() {
  const { code } = useParams();
  const router = useRouter();
  const [link, setLink] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError("");
      setLink(null);
      try {
        const res = await fetch(`/api/link/${code}`);
        const data = await res.json();
        setLoading(false);
        if (res.ok && data.link) setLink(data.link);
        else setError(data.error || "Unknown error");
      } catch {
        setError("Server error. Try again later.");
        setLoading(false);
      }
    }
    fetchStats();
  }, [code]);

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
        maxWidth: 600,
        margin: "2rem auto",
        padding: 36,
        background: "#f8fafc",
        borderRadius: 18,
        boxShadow: "0 2px 18px #e7effa",
      }}>
        <h2 style={{ textAlign: "center", marginBottom: 32, color: "#204060", fontSize: 28 }}>
          Stats for {code}
        </h2>
        {loading && (
          <div style={{ fontSize: 20, color: "#2374f1", textAlign: "center", margin: "30px 0" }}>
            Loading...
          </div>
        )}
        {error && (
          <div style={{
            color: "#b32625",
            textAlign: "center",
            fontWeight: "600",
            fontSize: 18,
            marginBottom: 28
          }}>
            {error}
            <div style={{ marginTop: 20 }}>
              <a href="/code" style={{
                background: "#3580fb",
                color: "#fff",
                border: "none",
                padding: "10px 22px",
                borderRadius: 8,
                textDecoration: "none",
                fontWeight: 600,
                fontSize: 16,
                boxShadow: "0 2px 6px #d6e8fc",
                marginRight: 8
              }}>
                Try another code
              </a>
              <a href="/home" style={{
                background: "#2164f4",
                color: "#fff",
                border: "none",
                padding: "10px 22px",
                borderRadius: 8,
                textDecoration: "none",
                fontWeight: 600,
                fontSize: 16,
                boxShadow: "0 2px 6px #d6e8fc"
              }}>
                Back to Home
              </a>
            </div>
          </div>
        )}
        {link && (
          <table style={{
            width: "100%",
            fontSize: 18,
            borderCollapse: "separate",
            borderSpacing: "0 18px"
          }}>
            <tbody>
              <TableRow label="Target URL"
                value={<a href={link.url} target="_blank" rel="noopener" style={{ color: "#2164f4", wordBreak: "break-all" }}>{link.url}</a>}
              />
              <TableRow label="Total Clicks" value={link.clicks ?? 0} />
              <TableRow label="Last Clicked" value={link.lastClicked ? new Date(link.lastClicked).toLocaleString() : "Never"} />
              <TableRow label="Created At" value={new Date(link.createdAt).toLocaleString()} />
            </tbody>
          </table>
        )}
        {link && (
          <div style={{ marginTop: 38, textAlign: "center" }}>
            <a href="/code" style={{
              background: "#3580fb",
              color: "#fff",
              border: "none",
              padding: "12px 28px",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 16,
              boxShadow: "0 2px 6px #d6e8fc",
              marginRight: 8
            }}>
              Try another code
            </a>
            <a href="/home" style={{
              background: "#2164f4",
              color: "#fff",
              border: "none",
              padding: "12px 28px",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 16,
              boxShadow: "0 2px 6px #d6e8fc"
            }}>
              Back to Home
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// Simple reusable table row for label-value pairs
function TableRow({ label, value }) {
  return (
    <tr>
      <td style={{
        fontWeight: 700,
        color: "#215489",
        padding: "10px 0",
        width: "220px",
        verticalAlign: "top"
      }}>
        {label}:
      </td>
      <td style={{
        color: "#174466",
        padding: "10px 0",
        wordBreak: "break-word"
      }}>
        {value}
      </td>
    </tr>
  );
}
