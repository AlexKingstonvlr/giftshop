import { useEffect, useRef, useState } from 'react';
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

function RotatingShowcase() {
  const [rotation, setRotation] = useState({ x: -15, y: 20 });
  const [auto, setAuto] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!auto) return;
    let raf: number;
    let y = 20;
    let x = -15;
    const animate = () => {
      y += 0.15;
      x = Math.sin(y * 0.02) * 10 - 10;
      setRotation({ x, y });
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(raf);
  }, [auto]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) / rect.width;
      const deltaY = (e.clientY - centerY) / rect.height;
      setAuto(false);
      setRotation({ x: -deltaY * 20, y: deltaX * 30 });
    };
    const handleLeave = () => setAuto(true);

    const el = ref.current;
    el?.addEventListener('mousemove', handleMove);
    el?.addEventListener('mouseleave', handleLeave);
    return () => {
      el?.removeEventListener('mousemove', handleMove);
      el?.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  const faces = [
    { label: 'Epoxy Resin', img: '/images/hero-resin-table.jpg', transform: 'translateZ(180px)' },
    { label: 'Laser Cut', img: '/images/hero-clock.jpg', transform: 'rotateY(90deg) translateZ(180px)' },
    { label: '3D Printing', img: '/images/hero-bust.jpg', transform: 'rotateY(180deg) translateZ(180px)' },
    { label: 'Custom Made', img: '/images/hero-dragon.jpg', transform: 'rotateY(-90deg) translateZ(180px)' },
    { label: 'Wood Craft', img: '/images/hero-resin-table.jpg', transform: 'rotateX(90deg) translateZ(180px)' },
    { label: 'Unique Gifts', img: '/images/hero-clock.jpg', transform: 'rotateX(-90deg) translateZ(180px)' },
  ];

  return (
    <div ref={ref} className="perspective-1000 w-[360px] h-[360px] md:w-[420px] md:h-[420px] relative">
      <div
        className="preserve-3d w-full h-full relative transition-transform duration-150 ease-out"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
      >
        {faces.map((f, i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-2xl overflow-hidden border border-[var(--gold)]/40 shadow-2xl bg-black"
            style={{
              transform: f.transform,
              backgroundImage: `url(${f.img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              boxShadow: 'inset 0 0 80px rgba(0,0,0,0.6), 0 0 40px rgba(201, 169, 97, 0.25)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/80" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
              <span className="font-serif-lux text-[var(--gold)] text-2xl md:text-3xl font-semibold italic">{f.label}</span>
              <span className="text-[10px] tracking-[0.25em] text-[var(--cream)]/70 uppercase font-sans-lux font-medium">VELLORE</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  const { content } = useSiteContent();

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg-gold noise-overlay pt-24 pb-12">
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[var(--gold)]/8 blur-[160px] pointer-events-none glow-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-amber-950/20 blur-[140px] pointer-events-none" />

      <GoldDustCanvas />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Text content */}
        <div className="text-center lg:text-left">
          {/* Tagline */}
          <div className="animate-fade-in-up inline-flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-[var(--gold)]/60" />
            <span className="text-xs tracking-[0.25em] uppercase text-[var(--gold)] font-sans-lux font-bold">
              Custom Made Gifts · Vellore
            </span>
            <div className="h-px w-12 bg-[var(--gold)]/60" />
          </div>

          {/* Headline */}
          <h1 className="animate-fade-in-up delay-200 font-serif-lux text-5xl sm:text-6xl md:text-7xl lg:text-[5.2rem] font-light leading-[1.05] tracking-tight mb-8 text-[var(--cream)]" dangerouslySetInnerHTML={{ __html: content.hero.title }}>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in-up delay-300 font-sans-lux text-lg md:text-xl text-[var(--cream)]/75 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10 font-light">
            {content.hero.description}
          </p>

          {/* CTAs */}
          <div className="animate-fade-in-up delay-400 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
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

          {/* Social proof */}
          <div className="animate-fade-in-up delay-500 flex items-center justify-center lg:justify-start gap-6 flex-wrap">
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

        {/* 3D Showcase */}
        <div className="flex items-center justify-center animate-fade-in-up delay-300">
          <RotatingShowcase />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-fade-in-up delay-700 flex flex-col items-center gap-1.5">
        <span className="text-[10px] tracking-[0.25em] uppercase text-[var(--cream)]/50 font-sans-lux font-medium">Explore Gifts</span>
        <ArrowDown size={16} className="text-[var(--gold)] float" />
      </div>
    </section>
  );
}
