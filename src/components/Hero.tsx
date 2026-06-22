import { useEffect, useRef } from 'react';
import { ArrowDown, Star } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

function GoldDustCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; a: number; drift: number }[] = [];
    const N = 40;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    for (let i = 0; i < N; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -Math.random() * 0.25 - 0.05,
        r: Math.random() * 1.5 + 0.3,
        a: Math.random() * 0.6 + 0.2,
        drift: Math.random() * Math.PI * 2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx + Math.sin(p.drift) * 0.1;
        p.y += p.vy;
        p.drift += 0.008;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        grad.addColorStop(0, `rgba(228, 199, 122, ${p.a})`);
        grad.addColorStop(0.5, `rgba(201, 169, 97, ${p.a * 0.4})`);
        grad.addColorStop(1, 'rgba(201, 169, 97, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.6 }} />;
}

function GradientParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particles: HTMLDivElement[] = [];
    let cleanup = false;

    function resetParticle(p: HTMLDivElement) {
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      p.style.left = `${posX}%`;
      p.style.top = `${posY}%`;
      p.style.opacity = '0';
      return { x: posX, y: posY };
    }

    function animateParticle(p: HTMLDivElement) {
      if (cleanup) return;
      const pos = resetParticle(p);
      const duration = Math.random() * 10 + 10;
      const delay = Math.random() * 5;

      setTimeout(() => {
        if (cleanup) return;
        p.style.transition = `all ${duration}s linear`;
        p.style.opacity = (Math.random() * 0.3 + 0.1).toString();
        const moveX = pos.x + (Math.random() * 20 - 10);
        const moveY = pos.y - Math.random() * 30;
        p.style.left = `${moveX}%`;
        p.style.top = `${moveY}%`;

        setTimeout(() => animateParticle(p), duration * 1000);
      }, delay * 1000);
    }

    for (let i = 0; i < 60; i++) {
      const p = document.createElement('div');
      p.className = 'gradient-particle';
      const size = Math.random() * 3 + 1;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      container.appendChild(p);
      particles.push(p);
      animateParticle(p);
    }

    return () => {
      cleanup = true;
      particles.forEach(p => p.remove());
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full z-[3] pointer-events-none" />;
}

export default function Hero() {
  const { content } = useSiteContent();

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--obsidian)] pt-24 pb-12">
      {/* Gradient background spheres */}
      <div className="absolute inset-0 w-full h-full z-0">
        <div className="gradient-sphere sphere-1" />
        <div className="gradient-sphere sphere-2" />
        <div className="gradient-sphere sphere-3" />
        <div className="gradient-glow" />
        <div className="gradient-grid-overlay" />
        <div className="absolute inset-0 z-[5] opacity-[0.04] pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }} />
      </div>

      <GradientParticles />
      <GoldDustCanvas />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20 flex items-center justify-center">
        <div className="text-center max-w-3xl">
          <div className="animate-fade-in-up inline-flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-[var(--gold)]/60" />
            <span className="text-xs tracking-[0.25em] uppercase text-[var(--gold)] font-sans-lux font-bold">
              Custom Made Gifts · Vellore
            </span>
            <div className="h-px w-12 bg-[var(--gold)]/60" />
          </div>

          <h1 className="animate-fade-in-up delay-200 font-serif-lux text-5xl sm:text-6xl md:text-7xl lg:text-[5.2rem] font-light leading-[1.05] tracking-tight mb-8 text-[var(--cream)]" dangerouslySetInnerHTML={{ __html: content.hero.title }}>
          </h1>

          <p className="animate-fade-in-up delay-300 font-sans-lux text-lg md:text-xl text-[var(--cream)]/75 leading-relaxed max-w-xl mx-auto mb-10 font-light">
            {content.hero.description}
          </p>

          <div className="animate-fade-in-up delay-400 flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a
              href="#custom-order"
              onClick={(e) => handleScroll(e, 'custom-order')}
              className="btn-gold text-xs uppercase px-9 py-4.5 rounded-xl tracking-[0.2em] font-bold shadow-xl shadow-[var(--gold)]/20 w-full sm:w-auto text-center"
            >
              Order Custom Gift
            </a>
            <a
              href="#collection"
              onClick={(e) => handleScroll(e, 'collection')}
              className="btn-outline-gold text-xs uppercase px-9 py-4.5 rounded-xl tracking-[0.2em] font-bold w-full sm:w-auto text-center"
            >
              View Collection
            </a>
          </div>

          <div className="animate-fade-in-up delay-500 flex items-center justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} className="text-[var(--gold)] fill-[var(--gold)]" />
              ))}
              <span className="text-[var(--cream)]/80 text-xs tracking-wider ml-2 font-sans-lux font-medium">4.9 / 5 Star Rating</span>
            </div>
            <div className="h-4 w-px bg-[var(--gold)]/30 hidden sm:block" />
            <span className="text-[var(--cream)]/60 text-xs tracking-wider font-sans-lux">
              Trusted by 1000+ happy customers
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-fade-in-up delay-700 flex flex-col items-center gap-1.5">
        <span className="text-[10px] tracking-[0.25em] uppercase text-[var(--cream)]/50 font-sans-lux font-medium">Explore Gifts</span>
        <ArrowDown size={16} className="text-[var(--gold)] float" />
      </div>
    </section>
  );
}
