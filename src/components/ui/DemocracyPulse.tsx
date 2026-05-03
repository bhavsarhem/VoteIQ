"use client";
import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: "970M+",  label: "Voters",        color: "#FF9933", angle: 30  },
  { value: "543",    label: "Constituencies", color: "#138808", angle: 100 },
  { value: "1.5M+",  label: "Booths",         color: "#ffffff", angle: 175 },
  { value: "5.5M+",  label: "EVMs",           color: "#FF9933", angle: 245 },
  { value: "36",     label: "States & UTs",   color: "#138808", angle: 310 },
];

function polarToXY(angle: number, radius: number) {
  const rad = (angle - 90) * (Math.PI / 180);
  return { x: Math.cos(rad) * radius, y: Math.sin(rad) * radius };
}

export default function DemocracyPulse() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [tick, setTick] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Only render dynamic SVG on client to avoid SSR/client float mismatch
  useEffect(() => { setMounted(true); }, []);

  // Mouse parallax
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      setMouse({ x: (e.clientX - cx) / rect.width, y: (e.clientY - cy) / rect.height });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  // Animate rings
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60);
    return () => clearInterval(id);
  }, []);

  const rings = [240, 190, 140, 90];
  const CENTER = 240;

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 480,
        aspectRatio: "1",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Only render dynamic SVG on client — avoids SSR/client float precision mismatch */}
      {mounted && (
        <svg
          viewBox={`0 0 ${CENTER * 2} ${CENTER * 2}`}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            overflow: "visible",
            transform: `translate(${mouse.x * -14}px, ${mouse.y * -14}px)`,
            transition: "transform 0.4s ease",
          }}
        >
          <defs>
            <radialGradient id="ringGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF9933" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#FF9933" stopOpacity="0" />
            </radialGradient>
            <filter id="pulseGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <linearGradient id="scannerGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#FF9933" stopOpacity="0" />
              <stop offset="100%" stopColor="#FF9933" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Filled background */}
          <circle cx={CENTER} cy={CENTER} r={rings[0]} fill="url(#ringGrad)" />

          {/* Animated concentric rings */}
          {rings.map((r, i) => (
            <circle
              key={i}
              cx={CENTER} cy={CENTER} r={r}
              fill="none" stroke="#FF9933"
              strokeWidth={i === 0 ? 1.5 : 1}
              opacity={0.12 + i * 0.04}
              strokeDasharray={`${2 + i} ${8 - i}`}
              style={{
                transformOrigin: `${CENTER}px ${CENTER}px`,
                animation: `spin${i % 2 === 0 ? "CW" : "CCW"} ${18 + i * 6}s linear infinite`,
              }}
            />
          ))}

          {/* Pulse waves */}
          {[0, 1, 2].map(i => {
            const progress = (tick / 60 + i / 3) % 1;
            return (
              <circle
                key={`pulse-${i}`}
                cx={CENTER} cy={CENTER}
                r={progress * rings[0]}
                fill="none" stroke="#FF9933"
                strokeWidth="1.5"
                opacity={(1 - progress) * 0.3}
              />
            );
          })}

          {/* Cross-hair lines */}
          {[0, 45, 90, 135].map(angle => {
            const rad = angle * Math.PI / 180;
            return (
              <line
                key={angle}
                x1={CENTER + Math.cos(rad) * 30} y1={CENTER + Math.sin(rad) * 30}
                x2={CENTER + Math.cos(rad) * rings[0]} y2={CENTER + Math.sin(rad) * rings[0]}
                stroke="#FF9933" strokeWidth="0.5" opacity="0.08"
              />
            );
          })}

          {/* Rotating scanner beam */}
          <line
            x1={CENTER} y1={CENTER}
            x2={CENTER} y2={CENTER - rings[0]}
            stroke="url(#scannerGrad)" strokeWidth="1.5" opacity="0.4"
            style={{ transformOrigin: `${CENTER}px ${CENTER}px`, animation: "spinCW 4s linear infinite" }}
          />

          {/* Stat bubbles */}
          {STATS.map((stat, i) => {
            const { x, y } = polarToXY(stat.angle, rings[0] + 40);
            const tx = CENTER + x + mouse.x * 8;
            const ty = CENTER + y + mouse.y * 8;
            return (
              <g key={i} style={{ transform: `translate(${tx}px, ${ty}px)`, transition: "transform 0.5s ease" }}>
                <line
                  x1={-x * 0.18} y1={-y * 0.18}
                  x2={-x * 0.08} y2={-y * 0.08}
                  stroke={stat.color} strokeWidth="1" opacity="0.4"
                />
                <circle cx="0" cy="0" r="2" fill={stat.color} opacity="0.8" />
                <text x="0" y="-6" textAnchor="middle" fill={stat.color}
                  fontSize="14" fontWeight="900" fontFamily="monospace"
                  style={{ filter: `drop-shadow(0 0 6px ${stat.color})` }}>
                  {stat.value}
                </text>
                <text x="0" y="10" textAnchor="middle" fill="rgba(255,255,255,0.35)"
                  fontSize="9" fontFamily="monospace" letterSpacing="2">
                  {stat.label.toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>
      )}

      {/* Center orb */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          transform: `translate(${mouse.x * 6}px, ${mouse.y * 6}px)`,
          transition: "transform 0.3s ease",
        }}
      >
        {/* Orb glow rings */}
        <div style={{
          position: "absolute",
          width: 120, height: 120, borderRadius: "50%",
          background: "radial-gradient(circle,rgba(255,153,51,0.18),transparent 70%)",
          animation: "orbPulse 3s ease-in-out infinite",
        }} />
        <div style={{
          position: "relative",
          width: 80, height: 80, borderRadius: "50%",
          background: "radial-gradient(circle at 35% 35%,rgba(255,153,51,0.3),rgba(255,153,51,0.05))",
          border: "1.5px solid rgba(255,153,51,0.4)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 30px rgba(255,153,51,0.25), inset 0 0 20px rgba(255,153,51,0.08)",
        }}>
          {/* India tricolor mini flag */}
          <div style={{ display: "flex", flexDirection: "column", width: 22, height: 16, borderRadius: 2, overflow: "hidden", border: "1px solid rgba(255,255,255,0.2)" }}>
            <div style={{ flex: 1, background: "#FF9933" }} />
            <div style={{ flex: 1, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", border: "1px solid #000080" }} />
            </div>
            <div style={{ flex: 1, background: "#138808" }} />
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 4 }}>
          <div style={{ fontSize: 11, fontFamily: "monospace", letterSpacing: "3px", color: "rgba(255,153,51,0.7)", textTransform: "uppercase" }}>
            Democracy
          </div>
          <div style={{ fontSize: 10, fontFamily: "monospace", letterSpacing: "2px", color: "rgba(255,255,255,0.2)" }}>
            LIVE PULSE
          </div>
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes spinCW  { to { transform: rotate(360deg);  } }
        @keyframes spinCCW { to { transform: rotate(-360deg); } }
        @keyframes orbPulse {
          0%,100% { transform: scale(1);   opacity: 0.7; }
          50%      { transform: scale(1.2); opacity: 1;   }
        }
      `}</style>
    </div>
  );
}
