"use client";
import { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "model"; text: string; id: number };

const SUGGESTED = [
  "How do I register to vote?",
  "What is an EVM?",
  "How does VVPAT work?",
  "What is Model Code of Conduct?",
  "When is the next Lok Sabha election?",
];

const GREETING = "Namaste! 🙏 I'm **Election Buddy** — your guide to Indian democracy. Ask me anything about elections, ECI, voter registration, EVMs, or the voting process!";

let idCounter = 1;

function TypewriterText({ text, renderFn, delay = 10 }: { text: string; renderFn: (t: string) => React.ReactNode; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(t);
    }, delay);
    return () => clearInterval(t);
  }, [text, delay]);
  return <>{renderFn(displayed)}</>;
}

export default function ElectionBuddy() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", text: GREETING, id: idCounter++ },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError("");
    setShowSuggestions(false);
    setInput("");
    const userMsg: Message = { role: "user", text: trimmed, id: idCounter++ };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      // Build history — skip the initial greeting (model msg), Gemini history must start with user
      const allMsgs = [...messages, userMsg];
      const historyForApi = allMsgs
        .slice(0, -1) // exclude the very last message we just added (that's the current message)
        .filter(m => !(m.id === 1 && m.role === "model")) // skip greeting
        .map(m => ({ role: m.role, parts: [{ text: m.text }] }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history: historyForApi }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setMessages(prev => [...prev, { role: "model", text: data.response, id: idCounter++ }]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg.includes("API") || msg.includes("key") ? "⚠️ API key issue — check your .env.local" : "❌ Failed to get response. Check your connection.");
      setMessages(prev => [...prev, { role: "model", text: "Something went wrong. Please try again.", id: idCounter++ }]);
    } finally {
      setLoading(false);
    }
  };

  // Render markdown-lite (bold, bullets)
  const renderText = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((p, i) =>
      i % 2 === 1
        ? <strong key={i} style={{ color: "#FF9933" }}>{p}</strong>
        : <span key={i}>{p}</span>
    );
  };

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9000, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>

      {/* ── CHAT PANEL ── */}
      {open && (
        <div style={{
          width: 380,
          height: 560,
          marginBottom: 12,
          display: "flex",
          flexDirection: "column",
          borderRadius: 24,
          overflow: "hidden",
          border: "1px solid rgba(255,153,51,0.2)",
          background: "rgba(8,8,8,0.97)",
          backdropFilter: "blur(24px)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,153,51,0.08), inset 0 1px 0 rgba(255,255,255,0.05)",
          animation: "slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        }}>

          {/* Header */}
          <div style={{
            padding: "16px 20px",
            background: "linear-gradient(135deg, rgba(255,153,51,0.12), rgba(19,136,8,0.08))",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Avatar */}
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: "linear-gradient(135deg, #FF9933, #FFB366)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 16px rgba(255,153,51,0.4)",
                fontSize: 18, flexShrink: 0,
              }}>
                🗳️
              </div>
              <div>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, letterSpacing: 0.5 }}>Election Buddy</div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 1 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: loading ? "#FF9933" : "#138808", boxShadow: `0 0 6px ${loading ? "#FF9933" : "#138808"}`, animation: "pulse 2s infinite" }} />
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "monospace", letterSpacing: 1 }}>
                    {loading ? "THINKING..." : "ONLINE · ECI AI"}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50%", width: 32, height: 32, color: "rgba(255,255,255,0.5)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, transition: "all 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.12)"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.5)"; }}
            >
              ✕
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div style={{ background: "rgba(255,50,50,0.1)", borderBottom: "1px solid rgba(255,50,50,0.2)", padding: "10px 16px", color: "#ff8080", fontSize: 12, display: "flex", alignItems: "center", gap: 8 }}>
              {error}
            </div>
          )}

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 12, scrollbarWidth: "thin", scrollbarColor: "rgba(255,153,51,0.2) transparent" }}>
            {messages.map((msg, idx) => {
              const isLastModelMsg = msg.role === "model" && idx === messages.length - 1 && msg.id > 1; // Don't animate greeting
              return (
              <div key={msg.id} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 8 }}>
                {msg.role === "model" && (
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#FF9933,#FFB366)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0, boxShadow: "0 0 8px rgba(255,153,51,0.3)" }}>
                    🗳️
                  </div>
                )}
                <div style={{
                  maxWidth: "78%",
                  padding: "11px 15px",
                  borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  background: msg.role === "user"
                    ? "linear-gradient(135deg, #FF9933, #e8852a)"
                    : "rgba(255,255,255,0.05)",
                  border: msg.role === "user"
                    ? "none"
                    : "1px solid rgba(255,255,255,0.08)",
                  color: msg.role === "user" ? "#fff" : "rgba(255,255,255,0.85)",
                  fontSize: 13.5,
                  lineHeight: 1.55,
                  boxShadow: msg.role === "user"
                    ? "0 4px 16px rgba(255,153,51,0.25)"
                    : "0 2px 8px rgba(0,0,0,0.3)",
                }}>
                  {isLastModelMsg ? <TypewriterText text={msg.text} renderFn={renderText} /> : renderText(msg.text)}
                </div>
              </div>
            )})}

            {/* Typing indicator */}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "flex-end", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#FF9933,#FFB366)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>🗳️</div>
                <div style={{ padding: "12px 16px", borderRadius: "18px 18px 18px 4px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", gap: 5, alignItems: "center" }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#FF9933", animation: `typingBounce 1.2s ${i * 0.2}s ease-in-out infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {showSuggestions && (
            <div style={{ padding: "0 16px 12px", display: "flex", gap: 8, flexWrap: "wrap" }}>
              {SUGGESTED.slice(0, 3).map((s, i) => (
                <button
                  key={i}
                  onClick={() => send(s)}
                  style={{
                    fontSize: 11, padding: "5px 10px", borderRadius: 100,
                    border: "1px solid rgba(255,153,51,0.25)",
                    background: "rgba(255,153,51,0.06)",
                    color: "rgba(255,153,51,0.8)",
                    cursor: "pointer", transition: "all 0.2s",
                    fontFamily: "monospace", letterSpacing: 0.5,
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,153,51,0.15)"; (e.currentTarget as HTMLButtonElement).style.color = "#FF9933"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,153,51,0.06)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,153,51,0.8)"; }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.3)", display: "flex", gap: 10, alignItems: "center" }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && send(input)}
              placeholder="Ask about Indian elections..."
              disabled={loading}
              style={{
                flex: 1, background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 50, padding: "10px 18px",
                color: "#fff", fontSize: 13, outline: "none",
                transition: "border-color 0.2s",
                fontFamily: "inherit",
              }}
              onFocus={e => { (e.target as HTMLInputElement).style.borderColor = "rgba(255,153,51,0.4)"; }}
              onBlur={e => { (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
            />
            <button
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
              style={{
                width: 40, height: 40, borderRadius: "50%",
                background: input.trim() ? "linear-gradient(135deg,#FF9933,#e8852a)" : "rgba(255,255,255,0.06)",
                border: "none", cursor: input.trim() ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s", flexShrink: 0,
                boxShadow: input.trim() ? "0 4px 14px rgba(255,153,51,0.35)" : "none",
              }}
              onMouseEnter={e => { if (input.trim()) (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── FAB BUTTON ── */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: 56, height: 56, borderRadius: "50%",
          background: open
            ? "rgba(255,255,255,0.1)"
            : "linear-gradient(135deg, #FF9933, #e8852a)",
          border: "1px solid rgba(255,255,255,0.15)",
          boxShadow: open ? "none" : "0 8px 24px rgba(255,153,51,0.45), 0 0 0 0 rgba(255,153,51,0.3)",
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          fontSize: 22,
          animation: open ? "none" : "fabPulse 3s ease-in-out infinite",
          transform: open ? "rotate(90deg)" : "rotate(0deg)",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = open ? "rotate(90deg) scale(1.08)" : "scale(1.08)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = open ? "rotate(90deg)" : "scale(1)"; }}
        title={open ? "Close" : "Ask Election Buddy"}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <span>🗳️</span>
        )}
      </button>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes typingBounce {
          0%,60%,100% { transform: translateY(0); opacity: 0.4; }
          30%          { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes fabPulse {
          0%,100% { box-shadow: 0 8px 24px rgba(255,153,51,0.45), 0 0 0 0 rgba(255,153,51,0.3); }
          50%      { box-shadow: 0 8px 24px rgba(255,153,51,0.45), 0 0 0 10px rgba(255,153,51,0); }
        }
        @keyframes pulse {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
