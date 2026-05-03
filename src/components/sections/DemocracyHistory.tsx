"use client";
import { useRef, useEffect } from "react";

const MILESTONES = [
  {
    year: "1947",
    title: "The Birth of a Nation",
    subtitle: "India wins Independence",
    desc: "After 200 years of colonial rule, India emerged free on August 15, 1947. The world doubted whether this vast, diverse nation could survive as a democracy. We proved them wrong — every single time.",
    quote: "\"At the stroke of the midnight hour, when the world sleeps, India will awake to life and freedom.\" — Jawaharlal Nehru",
    stat: "350M people",
    statLabel: "Population at Independence",
    color: "#FF9933",
    icon: "🇮🇳",
  },
  {
    year: "1949",
    title: "The World's Greatest Document",
    subtitle: "Constitution of India adopted",
    desc: "Dr. B.R. Ambedkar led the drafting of the longest written constitution in the world. It guaranteed universal adult suffrage — every citizen 21+ could vote, regardless of caste, gender, or literacy. No property requirement. No literacy test. Just citizenship.",
    quote: "\"The Constitution is not a mere lawyers' document — it is a vehicle of life.\" — Dr. B.R. Ambedkar",
    stat: "395 articles",
    statLabel: "Original Constitution Length",
    color: "#138808",
    icon: "📜",
  },
  {
    year: "1951–52",
    title: "The World's Largest Gamble",
    subtitle: "First General Elections",
    desc: "Western experts said it was impossible. 85% of India was illiterate. Yet 173 million voters participated across 132,000 polling stations. The Election Commission used symbols on ballots so everyone could vote. It was the greatest leap of faith in democratic history.",
    quote: "\"India's first election was the biggest experiment in democracy the world had ever seen.\"",
    stat: "173 Million",
    statLabel: "Voters in First Election",
    color: "#FF9933",
    icon: "🗳️",
  },
  {
    year: "1975–77",
    title: "Democracy's Darkest Hour",
    subtitle: "Emergency & the Triumph of the People",
    desc: "When the Emergency was imposed in 1975, suspending civil liberties and the press, the people of India refused to bow. In the 1977 elections — the first after Emergency was lifted — voters threw out the ruling party. Democracy did not break. It bent, then roared back.",
    quote: "\"You can imprison a person, but you cannot imprison the idea of freedom.\"",
    stat: "1977",
    statLabel: "Year democracy fought back",
    color: "#138808",
    icon: "✊",
  },
  {
    year: "1984",
    title: "The Test of Resilience",
    subtitle: "Democracy Survives Tragedy",
    desc: "Following the assassination of PM Indira Gandhi, India faced its most violent political moment. Yet within weeks, elections were held peacefully. Power transferred constitutionally. In the most turbulent moment, the system held — proving India's democracy was built to last.",
    quote: "\"India is not just a country. It is an idea — the idea that diversity is strength.\"",
    stat: "379M",
    statLabel: "Voters in 1984 elections",
    color: "#FF9933",
    icon: "🕊️",
  },
  {
    year: "1993",
    title: "Power to the Villages",
    subtitle: "73rd & 74th Amendments",
    desc: "The Panchayati Raj amendment brought democracy to every village in India. 3 million elected representatives now govern at the grass-roots level. 33% of seats were reserved for women — revolutionary at the time. Democracy didn't just live in Parliament. It breathed in every grama panchayat.",
    quote: "\"True democracy cannot be worked by twenty men sitting at the centre. It has to be worked from below.\" — Mahatma Gandhi",
    stat: "3 Million+",
    statLabel: "Elected local representatives",
    color: "#138808",
    icon: "🏡",
  },
  {
    year: "2019",
    title: "Humanity's Largest Exercise",
    subtitle: "900 Million Voters. One Mandate.",
    desc: "The 2019 Lok Sabha election was the largest democratic exercise in human history. 900 million eligible voters. 67.4% turnout. EVMs connected by technology to every corner of the country — from snowbound Himalayan posts to remote island booths accessible only by boat. Results counted in a single day.",
    quote: "\"India is proof that democracy is not a Western concept — it is a human one.\"",
    stat: "67.4% turnout",
    statLabel: "Participation — 900M eligible",
    color: "#FF9933",
    icon: "🌏",
  },
  {
    year: "2026",
    title: "The Unfinished Mission",
    subtitle: "Your Vote. Your Story.",
    desc: "Today, 970 million Indians are eligible to vote. Every five years, the world watches India — the most diverse nation on Earth — speak with one collective voice. This democracy was built by ordinary people making extraordinary choices. The next chapter is yours to write.",
    quote: "\"The future of democracy is in the hands of those who choose to participate.\"",
    stat: "970M+",
    statLabel: "Eligible voters today",
    color: "#138808",
    icon: "⚡",
  },
];

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.style.opacity = "1";
        el.style.transform = "translateY(0) scale(1)";
        obs.disconnect();
      }
    }, { threshold: 0.06, rootMargin: "0px 0px -40px 0px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: 0,
      transform: "translateY(40px) scale(0.98)",
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

export default function DemocracyHistory() {
  return (
    <section style={{ padding: "0 40px 140px", maxWidth: 1100, margin: "0 auto" }}>

      {/* Section Header */}
      <Reveal>
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 18px", borderRadius: 100,
            border: "1px solid rgba(255,153,51,0.3)", background: "rgba(255,153,51,0.08)",
            color: "#FF9933", fontSize: 11, fontWeight: 700, letterSpacing: "3px",
            textTransform: "uppercase", marginBottom: 20,
          }}>
            75+ Years of Democracy
          </div>
          <h2 style={{
            fontSize: "clamp(34px, 5vw, 60px)", fontWeight: 900, color: "#fff",
            margin: "0 0 16px", lineHeight: 1.1, letterSpacing: "-1px",
          }}>
            Born Free.{" "}
            <span style={{ background: "linear-gradient(135deg,#FF9933,#fff 50%,#138808)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Stayed Strong.
            </span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 17, maxWidth: 580, margin: "0 auto", lineHeight: 1.65 }}>
            India did not inherit democracy — it built it from scratch, in the face of poverty, illiteracy, division, and doubt. This is that story.
          </p>
        </div>
      </Reveal>

      {/* Timeline */}
      <div style={{ position: "relative" }}>

        {/* Vertical spine */}
        <div style={{
          position: "absolute", left: "50%", top: 0, bottom: 0,
          width: 1,
          background: "linear-gradient(180deg, transparent, rgba(255,153,51,0.4) 10%, rgba(19,136,8,0.4) 90%, transparent)",
          transform: "translateX(-50%)",
          pointerEvents: "none",
        }} />

        <div style={{ display: "flex", flexDirection: "column", gap: 64 }}>
          {MILESTONES.map((m, i) => {
            const isLeft = i % 2 === 0;
            return (
              <Reveal key={m.year} delay={0.05}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto 1fr",
                  gap: 0,
                  alignItems: "center",
                }}>
                  {/* Left content */}
                  <div style={{ paddingRight: 48, textAlign: "right", opacity: isLeft ? 1 : 0, pointerEvents: isLeft ? "auto" : "none" }}>
                    {isLeft && <MilestoneCard m={m} align="right" />}
                  </div>

                  {/* Center node */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2 }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: "50%",
                      background: `radial-gradient(circle at 35% 35%, ${m.color}40, ${m.color}10)`,
                      border: `2px solid ${m.color}50`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 20,
                      boxShadow: `0 0 20px ${m.color}30, 0 0 0 4px rgba(6,6,6,1), 0 0 0 5px ${m.color}20`,
                    }}>
                      {m.icon}
                    </div>
                    <div style={{
                      marginTop: 8, padding: "3px 12px", borderRadius: 100,
                      background: m.color + "15",
                      border: `1px solid ${m.color}30`,
                      color: m.color, fontFamily: "monospace",
                      fontSize: 12, fontWeight: 800, letterSpacing: "2px",
                      whiteSpace: "nowrap",
                    }}>
                      {m.year}
                    </div>
                  </div>

                  {/* Right content */}
                  <div style={{ paddingLeft: 48, opacity: !isLeft ? 1 : 0, pointerEvents: !isLeft ? "auto" : "none" }}>
                    {!isLeft && <MilestoneCard m={m} align="left" />}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA */}
      <Reveal delay={0.1}>
        <div style={{
          marginTop: 96, textAlign: "center",
          padding: "60px 40px",
          background: "rgba(255,153,51,0.04)",
          border: "1px solid rgba(255,153,51,0.12)",
          borderRadius: 32,
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%,rgba(255,153,51,0.06),transparent 60%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🇮🇳</div>
            <h3 style={{ fontSize: "clamp(24px,3.5vw,40px)", fontWeight: 900, color: "#fff", margin: "0 0 16px", lineHeight: 1.2 }}>
              Every election is a{" "}
              <span style={{ color: "#FF9933" }}>new chapter</span>{" "}
              in this story.
            </h3>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 16, maxWidth: 480, margin: "0 auto", lineHeight: 1.65 }}>
              Millions fought, marched, and sacrificed for your right to vote. Honour them — not with words, but with your ballot.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function MilestoneCard({ m, align }: { m: typeof MILESTONES[0]; align: "left" | "right" }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.025)",
        border: `1px solid rgba(255,255,255,0.07)`,
        borderRadius: 20,
        padding: "24px 26px",
        position: "relative",
        overflow: "hidden",
        textAlign: align,
        transition: "border-color 0.3s, background 0.3s",
        cursor: "default",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = m.color + "30";
        el.style.background = m.color + "06";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "rgba(255,255,255,0.07)";
        el.style.background = "rgba(255,255,255,0.025)";
      }}
    >
      {/* Top accent */}
      <div style={{
        position: "absolute", top: 0,
        left: align === "left" ? 0 : "auto",
        right: align === "right" ? 0 : "auto",
        width: "60%", height: 2,
        background: `linear-gradient(${align === "left" ? "90deg" : "270deg"}, ${m.color}80, transparent)`,
      }} />

      {/* Subtitle */}
      <div style={{
        fontSize: 11, fontFamily: "monospace", fontWeight: 700,
        letterSpacing: "2px", color: m.color, textTransform: "uppercase",
        marginBottom: 8,
      }}>
        {m.subtitle}
      </div>

      {/* Title */}
      <h3 style={{ fontSize: 20, fontWeight: 900, color: "#fff", margin: "0 0 10px", lineHeight: 1.2 }}>
        {m.title}
      </h3>

      {/* Description */}
      <p style={{ color: "rgba(255,255,255,0.48)", fontSize: 13.5, lineHeight: 1.65, margin: "0 0 14px" }}>
        {m.desc}
      </p>

      {/* Quote */}
      <div style={{
        borderLeft: align === "left" ? `2px solid ${m.color}40` : "none",
        borderRight: align === "right" ? `2px solid ${m.color}40` : "none",
        paddingLeft: align === "left" ? 12 : 0,
        paddingRight: align === "right" ? 12 : 0,
        color: "rgba(255,255,255,0.3)",
        fontSize: 12, fontStyle: "italic", lineHeight: 1.55,
        marginBottom: 14,
      }}>
        {m.quote}
      </div>

      {/* Stat */}
      <div style={{
        display: "inline-flex", flexDirection: "column",
        alignItems: align === "left" ? "flex-start" : "flex-end",
        background: m.color + "10",
        border: `1px solid ${m.color}20`,
        borderRadius: 12, padding: "8px 14px",
      }}>
        <span style={{ fontSize: 22, fontWeight: 900, color: m.color, lineHeight: 1, fontFamily: "monospace" }}>
          {m.stat}
        </span>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "monospace", marginTop: 3 }}>
          {m.statLabel}
        </span>
      </div>
    </div>
  );
}
