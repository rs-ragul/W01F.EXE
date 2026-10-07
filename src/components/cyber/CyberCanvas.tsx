import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  radius: number;
  alpha: number;
  color: string;
  pulseSpeed: number;
  pulseOffset: number;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

export function CyberCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = width < 768;
    const particleCount = isMobile ? 36 : 75;
    const connectionDist = isMobile ? 95 : 140;
    const mouseConnectionDist = isMobile ? 110 : 180;

    const colors = [
      "rgba(0, 240, 255,",   // Cyan
      "rgba(41, 169, 255,",  // Blue
      "rgba(255, 59, 48,",   // Red Team
      "rgba(0, 255, 136,",   // Emerald
    ];

    const particles: Particle[] = [];
    const shockwaves: Shockwave[] = [];

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      const baseR = Math.random() * 1.6 + 0.8;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        baseRadius: baseR,
        radius: baseR,
        alpha: Math.random() * 0.4 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulseSpeed: Math.random() * 0.03 + 0.015,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    const mouse = { x: -1000, y: -1000, active: false };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleClick = (e: MouseEvent) => {
      shockwaves.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: 220,
        alpha: 0.9,
        color: "0, 240, 255",
      });
      // Secondary echo ring
      shockwaves.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: 140,
        alpha: 0.6,
        color: "255, 59, 48",
      });
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("click", handleClick, { passive: true });

    let isVisible = true;
    const handleVisibility = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility);

    let frame = 0;

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      frame++;
      ctx.clearRect(0, 0, width, height);

      // Render expanding tactical shockwaves
      for (let s = shockwaves.length - 1; s >= 0; s--) {
        const sw = shockwaves[s];
        sw.radius += 4;
        sw.alpha *= 0.94;

        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${sw.color}, ${sw.alpha * 0.45})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Crosshairs
        if (sw.radius < 60) {
          ctx.strokeStyle = `rgba(${sw.color}, ${sw.alpha * 0.6})`;
          ctx.beginPath();
          ctx.moveTo(sw.x - 12, sw.y);
          ctx.lineTo(sw.x + 12, sw.y);
          ctx.moveTo(sw.x, sw.y - 12);
          ctx.lineTo(sw.x, sw.y + 12);
          ctx.stroke();
        }
        ctx.restore();

        if (sw.alpha < 0.01 || sw.radius > sw.maxRadius) {
          shockwaves.splice(s, 1);
        }
      }

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Smooth cyclic breathing
        p.radius = p.baseRadius + Math.sin(frame * p.pulseSpeed + p.pulseOffset) * 0.5;

        // Boundary bounce
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Cursor magnetic interaction
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouseConnectionDist && dist > 0) {
            const force = (mouseConnectionDist - dist) / mouseConnectionDist;
            p.x += (dx / dist) * force * 1.5;
            p.y += (dy / dist) * force * 1.5;

            // Connecting beam to cursor
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${(1 - dist / mouseConnectionDist) * 0.3})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${p.alpha})`;
        ctx.fill();

        // Glowing outer halo for highlighted nodes
        if (i % 5 === 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.8, 0, Math.PI * 2);
          ctx.strokeStyle = `${p.color} ${p.alpha * 0.25})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }

        // Connect nearby nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const lineAlpha = (1 - dist / connectionDist) * 0.16;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(41, 169, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("click", handleClick);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1] opacity-75"
      style={{ willChange: "transform" }}
      aria-hidden="true"
    />
  );
}
