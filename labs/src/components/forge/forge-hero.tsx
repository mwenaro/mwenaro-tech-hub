'use client';

import { useEffect, useRef } from 'react';

export function ForgeHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Array<{ x: number; y: number; vx: number; vy: number; size: number; opacity: number }> = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Spawn particles
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Connect nearby particles
        particles.slice(i + 1).forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(232, 93, 59, ${(1 - dist / 100) * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 93, 59, ${p.opacity})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section className="relative pt-36 pb-24 px-6 overflow-hidden bg-zinc-950 dark:bg-black">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-60"
        aria-hidden="true"
      />
      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white/60 text-xs font-black uppercase tracking-[0.2em] mb-8">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Experimental Zone — Active
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight leading-[1.05] mb-6">
          The{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-yellow-400">
            Forge
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-12">
          Our live R&D playground. Every tool here is an experiment built by the Labs team to push the boundaries of what's possible.
        </p>

        {/* Jump links */}
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { label: '🤖 Prompt Optimizer', href: '#prompt-optimizer' },
            { label: '🌐 Stack Vitals', href: '#stack-visualizer' },
            { label: '🎨 Design Previewer', href: '#component-previewer' },
            { label: '💬 AI Strategist', href: '#ai-strategist' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-6 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white/70 hover:text-white text-sm font-semibold transition-all duration-200 backdrop-blur-sm"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
