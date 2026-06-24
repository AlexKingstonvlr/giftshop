import { useScrollFade } from '../hooks/useScrollFade';

const craftFeatures = [
  {
    emoji: '💎',
    title: 'Expert Epoxy Resin Work',
    desc: 'We use high quality clear epoxy resin that stays bright and beautiful for many years. We mix colors, gold flakes, and wood to create beautiful shining tables, lamps, and coasters.',
    stats: ['High grade clear resin', 'Scratch resistant finish', 'Hand polished shine'],
  },
  {
    emoji: '✦',
    title: 'Top Precision Laser Machines',
    desc: 'Our advanced laser cutting machines cut wood, acrylic, and metal with exact 0.1mm accuracy. We make beautiful wall clocks, custom nameplates, and detailed 3D wooden maps.',
    stats: ['Exact 0.1mm cuts', 'Wood, Acrylic & Metal', 'Perfect clean edges'],
  },
  {
    emoji: '◈',
    title: 'Advanced 3D Printers',
    desc: 'We use high detail 3D printers to make custom photo light lamps, realistic face bust sculptures, and moving dragon models. The finish is extremely smooth and elegant.',
    stats: ['High detail printing', 'Durable strong material', 'Custom sizes available'],
  },
];

export default function CraftShowcase() {
  const headerRef = useScrollFade();

  return (
    <section id="equipment-materials" className="py-24 px-6 relative bg-transparent">
      <div className="max-w-7xl mx-auto relative">

        {/* Section Header */}
        <div ref={headerRef} className="scroll-fade text-center mb-20">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-12 bg-[var(--gold)]/60" />
            <span className="text-sm tracking-[0.2em] uppercase text-[var(--primary)] font-sans-lux font-bold">
              Our Equipment & Materials
            </span>
            <div className="h-px w-12 bg-[var(--gold)]/60" />
          </div>
          <h2 className="font-serif-lux text-5xl md:text-6xl font-light text-[var(--cream)] leading-[1.1] mb-6">
            How we make your <span className="italic text-gold-gradient font-normal">custom gifts</span>.
          </h2>
          <p className="font-sans-lux text-[var(--cream)]/75 max-w-xl mx-auto text-base md:text-lg">
            We use the best machines and top quality materials in our Vellore workshop to create gifts that last a lifetime.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="space-y-6">
            {craftFeatures.map((craft, i) => {
              return (
                <div
                  key={craft.title}
                  className="bg-zinc-900/90 p-8 rounded-2xl shadow-xl border border-zinc-800/80 hover:border-[var(--gold)]/40 transition-all duration-500 group flex flex-col md:flex-row items-start gap-6"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  {/* Left Icon Container */}
                  <div className="w-14 h-14 rounded-2xl border border-zinc-700 flex items-center justify-center text-2xl flex-shrink-0 bg-zinc-800 group-hover:scale-110 group-hover:border-[var(--gold)]/40 transition-all duration-400 shadow-sm">
                    {craft.emoji}
                  </div>

                  {/* Right Content Area */}
                  <div className="flex-1 font-sans-lux">
                    <h3 className="font-serif-lux text-2xl md:text-3xl text-white mb-2 font-semibold group-hover:text-[var(--gold)] transition-colors">
                      {craft.title}
                    </h3>
                    <p className="text-zinc-300 text-sm md:text-base leading-relaxed mb-6 font-normal">
                      {craft.desc}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {craft.stats.map((stat) => (
                        <span
                          key={stat}
                          className="text-[11px] tracking-[0.15em] uppercase font-bold px-3.5 py-1.5 rounded-lg bg-zinc-800 text-[var(--gold)] border border-zinc-700"
                        >
                          {stat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
