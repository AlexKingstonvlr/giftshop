import { useEffect, useRef } from 'react';
import { ArrowDown, Star } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

const GOLD = { r: 212, g: 175, b: 55 };
const BLUE = { r: 106, g: 198, b: 232 };

function GoldDustCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    interface Particle { x: number; y: number; vx: number; vy: number; r: number; a: number; drift: number; color: typeof GOLD }
    const particles: Particle[] = [];
    const N = 90;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    for (let i = 0; i < N; i++) {
      const isGold = Math.random() > 0.35;
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.08,
        vy: -(Math.random() * 0.12 + 0.03),
        r: Math.random() * 3 + 0.5,
        a: Math.random() * 0.4 + 0.15,
        drift: Math.random() * Math.PI * 2,
        color: isGold ? GOLD : BLUE,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx + Math.sin(p.drift) * 0.06;
        p.y += p.vy;
        p.drift += 0.005;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;

        const glowR = p.r * 5;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
        grad.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.a})`);
        grad.addColorStop(0.3, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.a * 0.25})`);
        grad.addColorStop(1, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
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

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.55 }} />;
}

export default function Hero() {
  const { content } = useSiteContent();

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-12">
      {/* Hero background image */}
      <div
        className="hero-bg absolute inset-0 w-full h-full pointer-events-none"
        style={{ backgroundImage: `url(${content.hero.image})` }}
      />

      {/* Ambient background spheres */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-[1]">
        <div className="sphere-1" />
        <div className="sphere-2" />
        <div className="gradient-glow" />
      </div>

      <GoldDustCanvas />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20 flex items-center justify-center">
        <div className="text-center max-w-3xl">
          <div className="animate-fade-in-up inline-flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-[var(--gold)]/60" />
            <span className="text-sm tracking-[0.25em] uppercase text-[var(--gold)] font-sans-lux font-bold">
              Custom Made Gifts · Vellore
            </span>
            <div className="h-px w-12 bg-[var(--gold)]/60" />
          </div>

          <h1 className="animate-fade-in-up delay-200 font-serif-lux text-5xl sm:text-6xl md:text-7xl lg:text-[5.2rem] font-light leading-[1.05] tracking-tight mb-8 text-[var(--cream)]" dangerouslySetInnerHTML={{ __html: content.hero.title }}>
          </h1>

          <p className="animate-fade-in-up delay-300 font-sans-lux text-lg md:text-xl text-[var(--cream)]/70 leading-relaxed max-w-xl mx-auto mb-10 font-light">
            {content.hero.description}
          </p>

          <div className="hero-cta-wrapper animate-fade-in-up delay-400 flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a
              href="#custom-order"
              onClick={(e) => handleScroll(e, 'custom-order')}
              className="btn-gold text-xs uppercase px-9 py-4.5 rounded-xl tracking-[0.2em] font-bold shadow-xl shadow-black/15 w-full sm:w-auto text-center"
            >
              Order Custom Gift
            </a>
            <a
              href="#collection"
              onClick={(e) => handleScroll(e, 'collection')}
              className="bg-black/5 backdrop-blur-sm text-[var(--cream)] border border-[var(--border)] text-xs uppercase px-9 py-4.5 rounded-xl tracking-[0.2em] font-bold w-full sm:w-auto text-center hover:bg-black/10 transition-all duration-400"
            >
              View Collection
            </a>
          </div>

          <div className="hero-stats-wrapper animate-fade-in-up delay-500 flex items-center justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} className="text-[var(--gold)] fill-[var(--gold)]" />
              ))}
              <span className="text-[var(--cream)] text-xs tracking-wider ml-2 font-sans-lux font-medium">4.9 / 5 Star Rating</span>
            </div>
            <div className="h-4 w-px bg-[var(--border)] hidden sm:block" />
            <span className="text-[var(--cream)]/80 text-xs tracking-wider font-sans-lux">
              Trusted by 1000+ happy customers
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-fade-in-up delay-700 flex flex-col items-center gap-1.5">
        <span className="text-[10px] tracking-[0.25em] uppercase text-[var(--cream)]/40 font-sans-lux font-medium">Explore Gifts</span>
        <ArrowDown size={16} className="text-[var(--gold)] float" />
      </div>
    </section>
  );
}
