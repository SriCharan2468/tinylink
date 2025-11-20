"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StatsEntryPage() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!CODE_REGEX.test(trimmed)) {
      setError("Invalid code format. Use 6-8 letters or numbers.");
      return;
    }
    setError("");
    router.push(`/code/${trimmed}`);
  }

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
        maxWidth: 500,
        margin: "2rem auto",
        padding: 36,
        background: "#f8fafc",
        borderRadius: 18,
        boxShadow: "0 2px 18px #e7effa"
      }}>
        <h2 style={{
          textAlign: "center",
          marginBottom: 32,
          color: "#204060",
          fontSize: 28
        }}>
          Link Stats Checker
        </h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: 14, marginBottom: 16 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Enter short code"
            style={{
              flex: 1,
              padding: "14px",
              fontSize: "1.12rem",
              borderRadius: 10,
              border: "2px solid #24314d",
              outline: "none"
            }}
          />
          <button type="submit" style={{
            padding: "14px 32px",
            borderRadius: 10,
            background: "#2164f4",
            color: "#fff",
            border: "none",
            fontWeight: 600,
            fontSize: 18,
            cursor: "pointer",
            boxShadow: "0 2px 8px #d9e9ff"
          }}>
            Search
          </button>
        </form>
        {error && (
          <div style={{
            textAlign: "center",
            color: "#d23d3d",
            fontWeight: 600,
            marginTop: 12,
            marginBottom: 2
          }}>
            {error}
          </div>
        )}
        <div style={{ marginTop: 32, textAlign: "center" }}>
          <a href="/home" style={{
            background: "#3580fb",
            color: "#fff",
            border: "none",
            padding: "12px 28px",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 16,
            boxShadow: "0 2px 6px #d6e8fc"
          }}>
            Go to Home
          </a>
        </div>
      </div>
    </div>
  );
}
