"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Cursor from "@/components/ui/CustomCursor";
import ParticleCanvas from "@/components/ui/ParticleCanvas";
import EVMHero from "@/components/ui/EVMSimulator";
import DemocracyPulse from "@/components/ui/DemocracyPulse";
import ElectionBuddy from "@/components/ai/ElectionBuddy";
import DemocracyHistory from "@/components/sections/DemocracyHistory";

// ─── Scroll Progress Bar ─────────────────────────────────────────
function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const h = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setPct(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, zIndex: 100, background: "rgba(255,255,255,0.04)" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#FF9933,#fff,#138808)", transition: "width 60ms linear" }} />
    </div>
  );
}

// ─── Reveal on scroll ────────────────────────────────────────────
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.style.opacity = "1"; el.style.transform = "translateY(0)"; obs.disconnect(); }
    }, { threshold: 0.08, rootMargin: "0px 0px -50px 0px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: 0, transform: "translateY(36px)", transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s` }}>
      {children}
    </div>
  );
}

// ─── Animated Counter ────────────────────────────────────────────
function Counter({ to, suffix = "", prefix = "" }: { to: number; suffix?: string; prefix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1800;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setVal(Math.floor(ease * to));
          if (p < 1) requestAnimationFrame(tick);
          else setVal(to);
        };
        requestAnimationFrame(tick);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{prefix}{val.toLocaleString("en-IN")}{suffix}</span>;
}

// ─── Stat Card ───────────────────────────────────────────────────
function Stat({ to, suffix, label, color = "#FF9933" }: { to: number; suffix?: string; label: string; color?: string }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "28px 20px", textAlign: "center" }}>
      <div style={{ fontSize: 38, fontWeight: 900, color, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
        <Counter to={to} suffix={suffix} />
      </div>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.32)", marginTop: 10, letterSpacing: "2px", textTransform: "uppercase", fontFamily: "monospace" }}>{label}</div>
    </div>
  );
}

// ─── Phase Steps data ─────────────────────────────────────────
const STEPS = [
  {
    phase: "PHASE 01", title: "Voter Registration", color: "#FF9933",
    desc: "The ECI maintains the electoral rolls. Every Indian citizen aged 18+ can enroll for their EPIC (Voter ID) card. As of 2026, India has over 970 million registered voters on the rolls.",
    tip: "Check your enrollment at voterportal.eci.gov.in",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    phase: "PHASE 02", title: "Model Code of Conduct", color: "#138808",
    desc: "Once the Election Commission announces dates, the MCC instantly activates. No government can announce new welfare schemes, transfer key officials, or misuse state resources during this period.",
    tip: "MCC violations can lead to candidate disqualification by the ECI",
    icon: "M12 3v1m0 16v1M3 12h1m16 0h1M5.636 5.636l.707.707m12.021 12.021l.707.707M5.636 18.364l.707-.707m12.021-12.021l.707-.707",
  },
  {
    phase: "PHASE 03", title: "Campaign Season", color: "#FF9933",
    desc: "Parties release manifestos and hold rallies across the country. The ECI caps campaign spending per candidate. Independent media fact-checkers and the MCC enforcement team monitor violations.",
    tip: "Campaign expenditure limits: ₹95 lakh (Lok Sabha), ₹40 lakh (Vidhan Sabha)",
    icon: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z",
  },
  {
    phase: "PHASE 04", title: "Polling Day (EVM + VVPAT)", color: "#138808",
    desc: "You go to your booth, verify via the electoral roll, and press one button on the EVM. The VVPAT prints a paper slip showing your candidate for 7 seconds before it drops into a sealed box — proof of your vote.",
    tip: "India uses over 5.5 million EVMs across 1.5 million+ polling booths",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  },
  {
    phase: "PHASE 05", title: "Counting & Government Formation", color: "#FF9933",
    desc: "EVMs are opened at counting centres under 3-tier security and multi-party observation. The candidate with most votes in each of the 543 constituencies wins. 272+ seats forms the government.",
    tip: "Live results are streamed at results.eci.gov.in",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  },
];

// ─── Divider ──────────────────────────────────────────────────
const Div = () => (
  <div style={{ maxWidth: 1200, margin: "0 auto 80px", padding: "0 40px" }}>
    <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent)" }} />
  </div>
);

// ─── Badge ────────────────────────────────────────────────────
const Badge = ({ text, color = "#FF9933" }: { text: string; color?: string }) => (
  <div style={{ display: "inline-flex", alignItems: "center", padding: "6px 16px", borderRadius: 100, border: `1px solid ${color}35`, background: `${color}10`, color, fontSize: 11, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase" as const, marginBottom: 20 }}>
    {text}
  </div>
);

// ─── Page ─────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <Cursor />
      <ParticleCanvas />
      <ScrollProgress />
      <ElectionBuddy />

      {/* NAV */}
      <nav style={{ position: "fixed", top: 12, left: 0, right: 0, zIndex: 90, display: "flex", justifyContent: "center" }}>
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)", borderRadius: 100, padding: "10px 28px", display: "flex", alignItems: "center", gap: 20 }}>
          <span style={{ fontWeight: 900, color: "#fff", letterSpacing: "3px", fontSize: 13 }}>
            VOTE<span style={{ color: "#FF9933" }}>IQ</span>
          </span>
          <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.1)" }} />
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: "monospace", letterSpacing: "2px" }}>India · Democracy · 2026</span>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "100px 40px 60px", position: "relative" }}>
        <div style={{ position: "absolute", top: "15%", left: "10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,153,51,0.06),transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(19,136,8,0.06),transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>

          {/* Left copy */}
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <Badge text="Interactive Election Guide · Bharat 2026" />

            <h1 style={{ fontSize: "clamp(42px,5.5vw,76px)", fontWeight: 900, lineHeight: 0.92, letterSpacing: "-2px", color: "#fff", margin: 0 }}>
              Voting is not<br />
              <span style={{ background: "linear-gradient(135deg,#FF9933,#fff 50%,#138808)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                rocket science.
              </span>
              <br />
              <span style={{ fontSize: "clamp(20px,2.8vw,36px)", fontWeight: 300, color: "rgba(255,255,255,0.38)" }}>
                It is one click.
              </span>
            </h1>

            <p style={{ color: "rgba(255,255,255,0.44)", fontSize: 17, lineHeight: 1.7, maxWidth: 430, margin: 0 }}>
              The world's largest democracy — 970M+ voters, 543 constituencies, one mandate. Explore the process, try the live EVM, and understand why your vote shapes Bharat's future.
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 12, color: "rgba(255,255,255,0.22)", fontSize: 12 }}>
              <div style={{ width: 32, height: 1, background: "#FF9933" }} />
              <span style={{ fontFamily: "monospace", letterSpacing: "3px", textTransform: "uppercase" }}>Scroll to explore</span>
              <motion.span animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 1.4 }} style={{ color: "#FF9933", fontSize: 20 }}>↓</motion.span>
            </div>
          </motion.div>

          {/* Right: India Map */}
          <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }} style={{ display: "flex", justifyContent: "center" }}>
            <DemocracyPulse />
          </motion.div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section style={{ padding: "0 40px 90px", maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
            <Stat to={970} suffix="M+" label="Registered Voters" color="#FF9933" />
            <Stat to={543} suffix=""   label="Lok Sabha Seats"   color="#138808" />
            <Stat to={36}  suffix=""   label="States + UTs"      color="#FF9933" />
            <Stat to={1500000} suffix="+" label="Polling Booths"  color="#138808" />
          </div>
        </Reveal>
      </section>

      <Div />

      {/* ══ EVM DEMO ══ */}
      <section style={{ padding: "0 40px 120px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <Reveal>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <Badge text="Live Demo" color="#138808" />
              <h2 style={{ fontSize: "clamp(32px,4vw,56px)", fontWeight: 900, color: "#fff", margin: 0, lineHeight: 1.1 }}>
                One click.<br />
                <span style={{ color: "#138808" }}>That's democracy.</span>
              </h2>
              <p style={{ color: "rgba(255,255,255,0.44)", fontSize: 16, lineHeight: 1.7, margin: 0 }}>
                This is a live simulation of India's Electronic Voting Machine (EVM). Press the blue button next to <strong style={{ color: "#fff" }}>DEMOCRACY</strong> to cast your demo vote — the VVPAT slip will drop out, exactly as it does on polling day.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {["Hover over the EVM to see it tilt in 3D", "Press the blue button to cast your vote", "Watch the VVPAT slip drop to confirm your choice"].map((tip, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, color: "rgba(255,255,255,0.45)", fontSize: 14 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF9933", flexShrink: 0 }} />
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <EVMHero />
            </div>
          </Reveal>
        </div>
      </section>

      <Div />

      {/* ══ 5 PHASES ══ */}
      <section style={{ padding: "0 40px 120px", maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <Badge text="The 5-Phase Journey" />
            <h2 style={{ fontSize: "clamp(34px,4.5vw,58px)", fontWeight: 900, color: "#fff", margin: "0 0 16px", lineHeight: 1.1 }}>
              From Registration to Results
            </h2>
            <p style={{ color: "rgba(255,255,255,0.34)", fontSize: 16, maxWidth: 560, margin: "0 auto", lineHeight: 1.65 }}>
              The Election Commission of India manages the most complex electoral exercise on Earth. Here is exactly how it works in 2026.
            </p>
          </div>
        </Reveal>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 780, margin: "0 auto", position: "relative" }}>
          {/* Timeline spine */}
          <div style={{ position: "absolute", left: 43, top: 56, bottom: 56, width: 1, background: "linear-gradient(180deg,rgba(255,153,51,0.5),rgba(19,136,8,0.5))", pointerEvents: "none" }} />

          {STEPS.map((s, i) => (
            <Reveal key={s.phase} delay={i * 0.08}>
              <div
                style={{ display: "flex", gap: 22, alignItems: "flex-start", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "26px 26px 26px 22px", position: "relative", overflow: "hidden", transition: "border-color 0.3s,background 0.3s" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = s.color + "30"; el.style.background = s.color + "06"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,0.06)"; el.style.background = "rgba(255,255,255,0.025)"; }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${s.color}80,transparent)` }} />

                {/* Icon */}
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: s.color + "15", border: `1.5px solid ${s.color}35`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={s.icon} />
                  </svg>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" as const }}>
                    <span style={{ fontSize: 10, fontFamily: "monospace", fontWeight: 700, letterSpacing: "3px", color: s.color, background: s.color + "15", padding: "3px 10px", borderRadius: 100, border: `1px solid ${s.color}25` }}>{s.phase}</span>
                    <h3 style={{ fontSize: 19, fontWeight: 800, color: "#fff", margin: 0 }}>{s.title}</h3>
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.48)", lineHeight: 1.65, margin: "0 0 12px", fontSize: 14 }}>{s.desc}</p>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontFamily: "monospace", color: s.color, background: s.color + "0d", border: `1px solid ${s.color}25`, borderRadius: 8, padding: "5px 12px" }}>
                    ℹ {s.tip}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Div />

      {/* ══ DEMOCRACY HISTORY ══ */}
      <DemocracyHistory />

      <Div />

      {/* ══ WHY VOTE CTA ══ */}
      <section style={{ padding: "0 40px 120px", maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 40, padding: "80px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 50%,rgba(255,153,51,0.05),transparent 60%),radial-gradient(ellipse at 70% 50%,rgba(19,136,8,0.05),transparent 60%)", pointerEvents: "none" }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              {/* Animated India flag strips */}
              <motion.div animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} style={{ display: "inline-flex", marginBottom: 32 }}>
                <div style={{ display: "flex", width: 64, height: 44, borderRadius: 6, overflow: "hidden", border: "1px solid rgba(255,255,255,0.2)", gap: 0 }}>
                  <div style={{ flex: 1, background: "#FF9933" }} />
                  <div style={{ flex: 1, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", border: "1.5px solid #000080", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: 2, height: 2, background: "#000080", borderRadius: "50%" }} />
                    </div>
                  </div>
                  <div style={{ flex: 1, background: "#138808" }} />
                </div>
              </motion.div>

              <h2 style={{ fontSize: "clamp(30px,4.5vw,54px)", fontWeight: 900, color: "#fff", margin: "0 0 20px", lineHeight: 1.15 }}>
                Your vote builds<br />
                <span style={{ background: "linear-gradient(135deg,#FF9933,#fff 50%,#138808)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  tomorrow's Bharat.
                </span>
              </h2>

              <p style={{ color: "rgba(255,255,255,0.42)", fontSize: 18, maxWidth: 580, margin: "0 auto 48px", lineHeight: 1.65 }}>
                Every school built, every highway laid, every hospital funded — it flows from the mandate you give. One vote. Infinite impact.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, maxWidth: 680, margin: "0 auto", textAlign: "left" }}>
                {[
                  { label: "Infrastructure", value: "PM Gati Shakti, metro networks", color: "#FF9933" },
                  { label: "Healthcare",     value: "Ayushman Bharat 2.0, AIIMS",   color: "#138808" },
                  { label: "Education",      value: "NEP 2026, IIT expansion",       color: "#fff" },
                ].map(item => (
                  <div key={item.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "3px", textTransform: "uppercase" as const, color: item.color, marginBottom: 6 }}>{item.label}</div>
                    <div style={{ color: "rgba(255,255,255,0.38)", fontSize: 13 }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "32px 40px", textAlign: "center", color: "rgba(255,255,255,0.14)", fontSize: 12, fontFamily: "monospace", letterSpacing: "2px" }}>
        VOTEIQ · POWERED BY GOOGLE CLOUD & GEMINI AI · EMPOWERING INDIAN DEMOCRACY · 2026
      </footer>
    </>
  );
}
