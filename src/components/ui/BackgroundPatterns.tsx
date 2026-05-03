"use client";

import React, { useEffect, useRef } from "react";

export default function BackgroundPatterns() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Array to hold the trail dots
    const particles: { x: number; y: number; age: number; color: string }[] = [];
    const colors = ["#FF9933", "#138808", "#ffffff"];

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Add new particle on move
      particles.push({
        x: mouseX,
        y: mouseY,
        age: 0,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    });

    const animate = () => {
      // Clear with slight opacity for trailing blur effect
      ctx.fillStyle = "rgba(5, 5, 5, 0.15)";
      ctx.fillRect(0, 0, width, height);

      // Add a subtle grid pattern
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      const gridSize = 80;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }

      // Draw and update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.age++;

        const radius = Math.max(0, 15 - p.age * 0.3);
        const opacity = Math.max(0, 1 - p.age * 0.02);

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = opacity;
        ctx.fill();
        
        // Add stronger glow
        ctx.shadowBlur = 20;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;

        // Move slightly
        p.x += (Math.random() - 0.5) * 1;
        p.y += (Math.random() - 0.5) * 1;
      }

      // Remove old particles
      while (particles.length > 0 && particles[0].age > 50) {
        particles.shift();
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-5]"
    />
  );
}
