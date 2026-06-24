import { useScrollFade } from '../hooks/useScrollFade';
import { ArrowUpRight } from 'lucide-react';

const crafts = [
  {
    name: 'Epoxy Resin',
    tagline: 'Deep shiny beauty',
    description: 'Each resin gift is mixed and poured by hand, cured carefully, and polished to look like shiny glass. Very premium finish.',
    image: '/images/hero-resin-table.jpg',
    pieces: 'Custom Items',
    accent: '#1e3a8a',
  },
  {
    name: 'Laser Cut Wood',
    tagline: 'Top precision cutting',
    description: 'Perfect clean cuts in high quality wood and acrylic. Beautiful patterns, wall clocks, and 3D maps made with great care.',
    image: '/images/hero-clock.jpg',
    pieces: 'Custom Items',
    accent: '#c9a961',
  },
  {
    name: '3D Printing',
    tagline: 'Modern 3D sculpture',
    description: 'We use advanced 3D printers to make custom photo lamps, detailed face sculptures, and moving dragon toys.',
    image: '/images/hero-bust.jpg',
    pieces: 'Custom Items',
    accent: '#e5e7eb',
  },
];

export default function Featured() {
  const headerRef = useScrollFade();

  const handleExplore = () => {
    const el = document.getElementById('collection');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="craft" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--charcoal)] to-transparent opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div ref={headerRef} className="scroll-fade text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-12 bg-[var(--gold)]/60" />
            <span className="text-sm tracking-[0.2em] uppercase text-[var(--gold)] font-sans-lux font-bold">
              Our Three Main Crafts
            </span>
            <div className="h-px w-12 bg-[var(--gold)]/60" />
          </div>
          <h2 className="font-serif-lux text-5xl md:text-6xl font-light text-[var(--cream)] leading-[1.1] mb-6">
            Three crafts.<br />
            <span className="italic text-gold-gradient font-normal">Expertly made</span> for you.
          </h2>
          <p className="font-sans-lux text-[var(--cream)]/75 max-w-xl mx-auto text-base md:text-lg leading-relaxed">
            We specialize in three unique ways of making gifts. Every item is hand-finished with great care in Vellore.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {crafts.map((craft, i) => {
            const ref = useScrollFade();
            return (
              <div
                key={craft.name}
                ref={ref}
                onClick={handleExplore}
                className="scroll-fade group relative overflow-hidden cursor-pointer rounded-2xl shadow-2xl border border-[var(--gold)]/20 hover:border-[var(--gold)]/50 transition-all duration-500"
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-[var(--charcoal)]">
                  <img
                    src={craft.image}
                    alt={craft.name}
                    className="w-full h-full object-cover product-image-zoom"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  <div
                    className="absolute inset-0 opacity-30 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-50"
                    style={{ background: `radial-gradient(circle at center, ${craft.accent}, transparent 70%)` }}
                  />

                  {/* Number */}
                  <div className="absolute top-6 left-6 z-10">
                    <span className="font-serif-lux text-5xl font-bold italic text-[var(--gold)]/60 group-hover:text-[var(--gold)] transition-colors duration-500">
                      0{i + 1}
                    </span>
                  </div>

                  {/* Arrow */}
                  <div className="absolute top-6 right-6 w-11 h-11 rounded-xl border border-[var(--gold)]/30 flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-400 bg-black/70 backdrop-blur-md z-10">
                    <ArrowUpRight size={18} className="text-[var(--gold)]" />
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-10 font-sans-lux">
                    <div className="h-1 w-10 bg-[var(--gold)] mb-4 group-hover:w-20 transition-all duration-400 rounded-full" />
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--gold)] mb-2 font-bold font-sans-lux">
                      {craft.tagline}
                    </p>
                    <h3 className="font-serif-lux text-3xl text-[var(--cream)] mb-3 font-semibold">
                      {craft.name}
                    </h3>
                    <p className="font-sans-lux text-sm text-[var(--cream)]/80 leading-relaxed mb-6">
                      {craft.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-[var(--gold)]/20">
                      <span className="text-xs tracking-wider text-[var(--cream)]/60 font-semibold uppercase">{craft.pieces}</span>
                      <span className="text-xs tracking-wider text-[var(--gold)] font-bold uppercase group-hover:translate-x-1 transition-transform duration-300">
                        View Items →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
