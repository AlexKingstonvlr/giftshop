import { useScrollFade } from '../hooks/useScrollFade';

const steps = [
  {
    num: 'Step 1',
    title: 'Tell Us What You Want',
    desc: 'Send us a simple message about the gift you want to make. You can tell us the occasion, your favorite color, or upload a reference photo.',
    time: 'Quick 5 Min Form',
    icon: '💬',
  },
  {
    num: 'Step 2',
    title: 'We Discuss & Plan',
    desc: 'We talk with you to select the best material (Wood, Resin, or 3D Print), confirm the exact size, and give you the best price.',
    time: 'Same Day Reply',
    icon: '🤝',
  },
  {
    num: 'Step 3',
    title: 'We Make Your Gift',
    desc: 'Our expert craftspeople use advanced laser machines, 3D printers, and hand-poured resin to make your gift perfectly in our Vellore shop.',
    time: 'High Quality Craft',
    icon: '🛠️',
  },
  {
    num: 'Step 4',
    title: 'Safe Fast Delivery',
    desc: 'We pack your custom gift very safely in a beautiful premium box and deliver it directly to your home with full care.',
    time: 'Careful Delivery',
    icon: '📦',
  },
];

export default function Process() {
  const headerRef = useScrollFade();

  return (
    <section id="how-it-works" className="py-24 px-6 relative overflow-hidden bg-[var(--charcoal)]/40 border-y border-[var(--gold)]/10">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div ref={headerRef} className="scroll-fade text-center mb-20">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-12 bg-[var(--gold)]/60" />
            <span className="text-sm tracking-[0.2em] uppercase text-[var(--gold)] font-sans-lux font-bold">
              How to Order
            </span>
            <div className="h-px w-12 bg-[var(--gold)]/60" />
          </div>
          <h2 className="font-serif-lux text-5xl md:text-6xl font-light text-[var(--cream)] leading-[1.1] mb-6">
            Easy steps to order your <span className="italic text-gold-gradient font-normal">custom gift</span>.
          </h2>
          <p className="font-sans-lux text-[var(--cream)]/75 max-w-xl mx-auto text-base md:text-lg">
            We make ordering custom gifts very simple and friendly. We guide you at every step.
          </p>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 md:-translate-x-px top-4 bottom-4 w-1 bg-gradient-to-b from-[var(--gold)]/20 via-[var(--gold)]/60 to-[var(--gold)]/20 rounded-full" />

          <div className="space-y-16">
            {steps.map((step, i) => {
              const ref = useScrollFade();
              const isEven = i % 2 === 0;
              return (
                <div
                  key={step.num}
                  ref={ref}
                  className="scroll-fade relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center group"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  {/* Left side - content on even steps */}
                  <div className={`${isEven ? 'md:text-right md:pr-14' : 'md:order-2 md:text-left md:pl-14'} pl-16 sm:pl-18`}>
                    <div className={`flex items-center gap-3 mb-3 ${isEven ? 'md:justify-end' : ''}`}>
                      <span className="text-3xl p-3 bg-transparent border border-[var(--gold)]/20 rounded-2xl group-hover:border-[var(--gold)] transition-colors shadow-sm">{step.icon}</span>
                      <span className="text-sm tracking-[0.25em] uppercase text-[var(--gold)] font-sans-lux font-bold bg-white/5 px-3 py-2 rounded-lg border border-white/10">
                        {step.time}
                      </span>
                    </div>
                    <h3 className="font-serif-lux text-3xl md:text-4xl text-[var(--cream)] font-semibold mb-3 leading-tight group-hover:text-[var(--gold)] transition-colors">
                      <span className="text-gold-gradient italic mr-3 font-bold">{step.num}:</span>
                      {step.title}
                    </h3>
                    <p className="font-sans-lux text-[var(--cream)]/80 leading-relaxed max-w-md text-base">
                      {step.desc}
                    </p>
                  </div>

                  {/* Right side - empty on even steps */}
                  <div className={`${isEven ? 'md:order-2' : ''} hidden md:block`} />

                  {/* Center dot */}
                  <div className="absolute left-6 md:left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[var(--gold)] ring-8 ring-[var(--obsidian)] z-10 group-hover:scale-125 transition-transform shadow-xl shadow-[var(--gold)]/40 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[var(--obsidian)]" />
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
