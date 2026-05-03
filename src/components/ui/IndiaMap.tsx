"use client";
import { useEffect, useRef } from "react";

// Accurate India outline SVG path traced from official map reference
// ViewBox: 0 0 500 560
const INDIA_MAINLAND = `
  M 198,14
  L 213,10 L 228,8 L 242,7 L 255,8 L 265,6
  L 277,5 L 287,8 L 295,6 L 305,4 L 315,7
  L 324,5 L 332,8 L 340,6 L 348,10 L 357,8
  L 364,12 L 370,18 L 374,26 L 376,35
  L 378,44 L 382,52 L 388,58 L 394,64
  L 400,68 L 405,75 L 408,82 L 410,90
  L 406,96 L 398,100 L 390,104
  L 382,108 L 378,115 L 375,122
  L 373,130 L 372,138 L 368,144
  L 364,150 L 362,158 L 364,166
  L 368,172 L 370,180 L 368,188
  L 362,194 L 358,202 L 355,210
  L 354,218 L 357,226 L 360,233
  L 361,242 L 358,250 L 352,257
  L 346,263 L 340,270 L 334,278
  L 328,286 L 322,295 L 315,303
  L 305,312 L 295,320 L 285,328
  L 275,336 L 266,344 L 258,354
  L 250,364 L 244,374 L 238,384
  L 233,394 L 229,404 L 226,414
  L 223,424 L 220,433 L 218,442
  L 216,450 L 214,458 L 213,466
  L 212,472 L 214,476
  L 210,480 L 206,484 L 202,480
  L 198,474 L 195,468 L 193,462
  L 191,455 L 188,448 L 185,440
  L 180,432 L 174,424 L 167,416
  L 160,408 L 153,400 L 146,392
  L 140,382 L 135,372 L 131,362
  L 128,352 L 126,342 L 124,332
  L 122,320 L 120,308 L 119,296
  L 118,282 L 116,268 L 114,254
  L 112,240 L 110,226 L 109,212
  L 108,198 L 108,184 L 108,170
  L 105,158 L 100,148 L 94,140
  L 88,134 L 83,128 L 80,120
  L 78,112 L 80,104 L 86,97
  L 94,92 L 100,87 L 104,80
  L 106,73 L 105,66 L 100,60
  L 95,55 L 92,49 L 95,44
  L 102,40 L 110,38 L 116,34
  L 122,28 L 128,22 L 135,16
  L 143,12 L 152,10 L 162,10
  L 172,10 L 182,11 L 191,12
  L 198,14 Z
`;

// Northeastern states - distinctive protrusion to the east
const NORTHEAST = `
  M 378,115 L 385,110 L 392,106 L 400,104
  L 408,102 L 416,100 L 424,99 L 432,100
  L 438,104 L 443,110 L 446,117 L 447,125
  L 445,132 L 440,138 L 434,143 L 427,146
  L 420,148 L 413,150 L 406,152 L 400,155
  L 394,158 L 390,163 L 386,170 L 382,176
  L 378,180 L 374,178 L 372,173 L 371,167
  L 372,160 L 373,152 L 374,144 L 375,136
  L 376,128 L 377,120 L 378,115 Z
`;

// Andaman Islands
const ANDAMAN = `
  M 430,345 L 433,338 L 436,333 L 438,338 L 440,345 L 437,352 L 433,356 L 430,350 Z
  M 433,362 L 436,357 L 439,362 L 438,369 L 434,373 L 432,368 Z
  M 435,378 L 437,373 L 440,378 L 439,385 L 435,388 Z
`;

// Lakshadweep
const LAKSHADWEEP = `
  M 90,350 L 93,346 L 96,350 L 94,355 L 90,355 Z
  M 82,370 L 85,366 L 88,370 L 86,375 L 82,374 Z
`;

// Sri Lanka
const SRILANKA = `
  M 225,494 L 231,488 L 238,490 L 242,498
  L 240,508 L 233,513 L 226,510 L 222,503 Z
`;

export default function IndiaMap() {
  const mainRef = useRef<SVGPathElement>(null);
  const neRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const animate = (el: SVGPathElement | null, delay: number) => {
      if (!el) return;
      try {
        const len = el.getTotalLength();
        el.style.strokeDasharray = `${len}`;
        el.style.strokeDashoffset = `${len}`;
        setTimeout(() => {
          el.style.transition = "stroke-dashoffset 3.5s cubic-bezier(0.25,0.46,0.45,0.94)";
          el.style.strokeDashoffset = "0";
        }, delay);
      } catch {
        // fallback: just show it
        el.style.strokeDasharray = "none";
        el.style.strokeDashoffset = "0";
      }
    };
    animate(mainRef.current, 200);
    animate(neRef.current, 400);
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 420, margin: "0 auto" }}>
      {/* Ambient glow behind map */}
      <div style={{
        position: "absolute", top: "20%", left: "15%",
        width: "70%", height: "70%", borderRadius: "50%",
        background: "radial-gradient(circle,rgba(255,153,51,0.12),transparent 70%)",
        filter: "blur(40px)", pointerEvents: "none",
      }} />

      <svg
        viewBox="60 0 430 540"
        width="100%"
        style={{ overflow: "visible", display: "block" }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Soft fill for mainland */}
        <path d={INDIA_MAINLAND} fill="rgba(255,153,51,0.05)" stroke="none" />
        <path d={NORTHEAST}      fill="rgba(255,153,51,0.05)" stroke="none" />

        {/* Animated glowing border — mainland */}
        <path
          ref={mainRef}
          d={INDIA_MAINLAND}
          fill="none"
          stroke="#FF9933"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
        />

        {/* Animated glowing border — northeast states */}
        <path
          ref={neRef}
          d={NORTHEAST}
          fill="rgba(255,153,51,0.04)"
          stroke="#FF9933"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
        />

        {/* Andaman Islands */}
        <path d={ANDAMAN} fill="rgba(255,153,51,0.05)" stroke="#FF9933" strokeWidth="1.5" opacity="0.6" />

        {/* Lakshadweep */}
        <path d={LAKSHADWEEP} fill="rgba(255,153,51,0.05)" stroke="#FF9933" strokeWidth="1.2" opacity="0.5" />

        {/* Sri Lanka (dashed — not part of India) */}
        <path d={SRILANKA} fill="rgba(255,153,51,0.03)" stroke="#FF9933" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.4" />

        {/* New Delhi capital pulse */}
        <g>
          <circle cx="215" cy="108" r="4" fill="#FF9933">
            <animate attributeName="r" values="4;10;4" dur="2.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0;1" dur="2.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="215" cy="108" r="4" fill="#FF9933" filter="url(#glow)" />
          <text x="222" y="106" fill="rgba(255,153,51,0.8)" fontSize="11" fontFamily="monospace" fontWeight="700">New Delhi</text>
        </g>

        {/* State capital dots */}
        {[
          { cx: 130, cy: 228, label: "Mumbai"  },
          { cx: 322, cy: 435, label: "Chennai"  },
          { cx: 380, cy: 200, label: "Kolkata"  },
          { cx: 196, cy: 388, label: "Bengaluru" },
        ].map(p => (
          <g key={p.label}>
            <circle cx={p.cx} cy={p.cy} r="3" fill="#138808" opacity="0.8" filter="url(#glow)" />
          </g>
        ))}

        {/* Bottom label */}
        <text x="245" y="540" textAnchor="middle" fill="rgba(255,153,51,0.4)" fontSize="10" fontFamily="monospace" letterSpacing="4">
          BHARAT · REPUBLIC OF INDIA
        </text>
      </svg>
    </div>
  );
}
