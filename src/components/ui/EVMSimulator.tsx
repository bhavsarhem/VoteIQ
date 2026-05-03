"use client";
import { useState } from "react";

export default function EVMHero() {
  const [voted, setVoted] = useState(false);
  const [showSlip, setShowSlip] = useState(false);

  const vote = () => {
    if (voted) return;
    setVoted(true);
    setTimeout(() => setShowSlip(true), 700);
    setTimeout(() => { setVoted(false); setShowSlip(false); }, 7000);
  };

  const candidates = [
    { id: 1, name: "CANDIDATE A", symbol: "▲", canVote: false },
    { id: 2, name: "DEMOCRACY",   symbol: "★", canVote: true  },
    { id: 3, name: "CANDIDATE C", symbol: "●", canVote: false },
  ];

  return (
    <div style={{ position: "relative", paddingBottom: showSlip ? "130px" : "0", transition: "padding-bottom 0.8s" }}>
      {/* Screen flash */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 40,
        background: voted ? "rgba(19,136,8,0.07)" : "transparent",
        transition: "background 1s",
      }} />

      {/* EVM Body */}
      <div
        style={{
          width: "min(420px, 90vw)",
          background: "linear-gradient(160deg,#1c1c1c,#0f0f0f)",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: "22px",
          overflow: "hidden",
          boxShadow: "0 40px 80px rgba(0,0,0,0.7)",
        }}
      >
        {/* Header */}
        <div style={{ background: "#0a0a0a", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 10, height: 10, borderRadius: "50%",
              background: voted ? "#138808" : "#FF9933",
              boxShadow: voted ? "0 0 12px #138808" : "0 0 10px #FF9933",
              transition: "all 0.4s",
            }} />
            <span style={{ fontSize: 11, fontFamily: "monospace", color: "rgba(255,255,255,0.35)", letterSpacing: "3px" }}>
              {voted ? "VOTE RECORDED" : "EVM ACTIVE"}
            </span>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: "50%",
                background: voted ? "#138808" : "#2a2a2a",
                transition: `background 0.3s ${i * 0.1}s`,
              }} />
            ))}
          </div>
        </div>

        {/* Candidates */}
        {candidates.map(c => (
          <div
            key={c.id}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "18px 20px",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ color: "#FF9933", fontFamily: "monospace", fontSize: 13, fontWeight: 700, width: 14 }}>{c.id}</span>
              <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.08)" }} />
              <div>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: 14, letterSpacing: 1 }}>{c.name}</div>
                <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, fontFamily: "monospace" }}>Party {c.id}</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 14 }}>{c.symbol}</span>

              {/* ── VOTE BUTTON ── */}
              {c.canVote ? (
                <button
                  onClick={vote}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: "none",
                    outline: "none",
                    background: voted ? "#138808" : "#0A2463",
                    boxShadow: voted
                      ? "0 0 18px #138808"
                      : "0 0 14px rgba(10,36,99,0.8), inset 0 2px 4px rgba(255,255,255,0.15)",
                    cursor: voted ? "default" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s ease",
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => { if (!voted) (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.15)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
                  onMouseDown={e => { if (!voted) (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.9)"; }}
                  onMouseUp={e => { if (!voted) (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)"; }}
                >
                  <div style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: voted ? "#fff" : "rgba(255,255,255,0.35)",
                    transition: "all 0.3s",
                  }} />
                </button>
              ) : (
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "rgba(255,255,255,0.05)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: 0.4,
                }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "rgba(255,255,255,0.15)" }} />
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Footer */}
        <div style={{ background: "#0a0a0a", padding: "10px 20px", display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <span style={{ fontSize: 10, fontFamily: "monospace", color: "rgba(255,255,255,0.15)", letterSpacing: 2 }}>ECI APPROVED</span>
          <span style={{ fontSize: 10, fontFamily: "monospace", color: "rgba(255,255,255,0.15)", letterSpacing: 2 }}>BU-17 / VVPAT</span>
        </div>
      </div>

      {/* VVPAT Slip */}
      <div style={{
        position: "absolute",
        bottom: showSlip ? "-130px" : "0",
        left: "50%",
        transform: "translateX(-50%)",
        opacity: showSlip ? 1 : 0,
        transition: "bottom 0.9s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s",
        width: 210,
        zIndex: 10,
        pointerEvents: "none",
      }}>
        <div style={{ background: "#fff", borderRadius: "0 0 12px 12px", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.8)" }}>
          <div style={{ padding: 14, margin: 6, border: "3px dashed rgba(0,0,0,0.12)", borderRadius: 4 }}>
            <div style={{ fontSize: 9, fontFamily: "monospace", fontWeight: 900, letterSpacing: 3, color: "rgba(0,0,0,0.35)", textAlign: "center", borderBottom: "1px solid rgba(0,0,0,0.1)", paddingBottom: 8, marginBottom: 8 }}>VVPAT VERIFIED</div>
            <div style={{ fontFamily: "monospace", fontSize: 17, fontWeight: 900, textAlign: "center", color: "#000" }}>DEMOCRACY ★</div>
            <div style={{ fontFamily: "monospace", fontSize: 9, marginTop: 10, textAlign: "center", background: "#000", color: "#fff", padding: "3px 6px", letterSpacing: 2 }}>VOTE CAST SUCCESSFULLY</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "0 8px 4px" }}>
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#060606" }} />
            ))}
          </div>
        </div>
      </div>

      <p style={{ marginTop: 14, color: "rgba(255,255,255,0.22)", fontSize: 11, fontFamily: "monospace", letterSpacing: 3, textTransform: "uppercase", textAlign: "center" }}>
        Press the blue button to cast a demo vote
      </p>
    </div>
  );
}
