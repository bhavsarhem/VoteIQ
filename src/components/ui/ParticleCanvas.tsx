"use client";
import { useEffect, useRef } from "react";

export default function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    // Floating background particles
    const COLORS = ["#FF9933", "#138808", "#ffffff", "#FF9933"];
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    // Mouse trail
    type Trail = { x: number; y: number; age: number; color: string };
    const trail: Trail[] = [];
    let mx = -999, my = -999;
    const TRAIL_COLORS = ["#FF9933", "#FF9933", "#138808", "#ffffff"];

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      for (let i = 0; i < 3; i++) {
        trail.push({
          x: mx + (Math.random() - 0.5) * 10,
          y: my + (Math.random() - 0.5) * 10,
          age: 0,
          color: TRAIL_COLORS[Math.floor(Math.random() * TRAIL_COLORS.length)],
        });
      }
    };
    window.addEventListener("mousemove", onMouseMove);

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Background particles
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;

        p.x += p.speedX; p.y += p.speedY;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      }

      // Mouse trail
      for (let i = trail.length - 1; i >= 0; i--) {
        const t = trail[i];
        t.age++;
        const life = 1 - t.age / 40;
        if (life <= 0) { trail.splice(i, 1); continue; }

        const r = life * 12;
        const grad = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, r);
        grad.addColorStop(0, t.color + "ff");
        grad.addColorStop(1, t.color + "00");

        ctx.beginPath();
        ctx.arc(t.x, t.y, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.globalAlpha = life * 0.8;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
