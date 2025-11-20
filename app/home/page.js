"use client";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { name: "Home", path: "/home" },
  { name: "Dashboard", path: "/" },
  { name: "Stats", path: "/code" },
  { name: "Health Check", path: "/healthz" }
];



export default function HomePage() {
  const [hovered, setHovered] = useState(-1);
  const [url, setUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!url) {
      setError("Please enter a URL");
      return;
    }
    const res = await fetch("/api/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    if (res.ok && data.shortCode) {
      setShortCode(data.shortCode);
      setCopied(false);
    } else {
      setError(data.error || "Failed to shorten URL");
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(`${window.location.origin}/${shortCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

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
        {navLinks.map((link, idx) => (
          <Link href={link.path} key={link.name} passHref>
            <div
              style={{
                width: "100%",
                padding: "14px 20px",
                marginBottom: "8px",
                borderRadius: "8px",
                cursor: "pointer",
                background: window.location.pathname === link.path ? "#485980" : "inherit",
                color: window.location.pathname === link.path ? "#eef2fb" : "#f5f9ff",
                transition: "background 0.18s, color 0.18s"
              }}
            >
              {link.name}
            </div>
          </Link>
        ))}
      </aside>
      <main style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "48px 32px"
      }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "14px", color: "#24314d" }}>
          TinyLink URL Shortener
        </h1>
        <p style={{
          fontSize: "1.18rem",
          color: "#384366",
          marginBottom: "28px",
          maxWidth: "620px",
          textAlign: "center"
        }}>
          This website transforms your lengthy URLs into concise, easy-to-share TinyLinks! Simply paste your long link below, and get a short code to share with anyone.
        </p>
        <div style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "14px",
          boxShadow: "0 4px 16px rgba(60,60,110,0.09)"
        }}>
          <form onSubmit={handleSubmit} style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "18px",
          }}>
            <input
              type="text"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="Paste URL to shorten"
              style={{
                padding: "12px",
                width: "320px",
                fontSize: "1.1rem",
                borderRadius: "8px",
                border: "1px solid #dbe3f5",
                boxShadow: "0 2px 4px rgba(160,170,210,0.07)"
              }}
            />
            <button
              type="submit"
              style={{
                background: "#2164f4",
                color: "#fff",
                padding: "11px 32px",
                border: "none",
                borderRadius: "6px",
                fontSize: "1.08rem",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(100,110,220,0.11)"
              }}
            >
              Shorten URL
            </button>
          </form>
          {shortCode && (
            <div style={{
              marginTop: "16px",
              background: "#eafdde",
              color: "#286c36",
              padding: "14px",
              borderRadius: "7px",
              display: "flex",
              alignItems: "center"
            }}>
              Shortened URL:&nbsp;
              <a href={`/${shortCode}`} style={{ fontWeight: 600 }}>
                {window.location.origin}/{shortCode}
              </a>
              <button
                onClick={handleCopy}
                style={{
                  marginLeft: "10px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  padding: 0,
                  opacity: 0.4,         // Transparent!
                  transition: "opacity 0.15s"
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0.4}
                title="Copy to clipboard"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none" stroke="#286c36" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="9" y="9" width="13" height="13" rx="3" />
                  <rect x="2" y="2" width="13" height="13" rx="3" />
                </svg>
              </button>
              {copied && <span style={{marginLeft: "8px", color: "#109a46"}}>Copied!</span>}
            </div>
          )}
          {error && (
            <div style={{ marginTop: "14px", color: "#d23d3d" }}>
              {error}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


