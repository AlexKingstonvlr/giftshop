import { useEffect, useRef, useState } from 'react';
import { useScrollFade } from '../hooks/useScrollFade';

const stats = [
  { value: 1200, suffix: '+', label: 'Gifts Delivered' },
  { value: 100, suffix: '%', label: 'Custom Made' },
  { value: 99, suffix: '%', label: 'Happy Customers' },
  { value: 15, suffix: '+', label: 'Years of Wood & Craft Experience' },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const interval = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(interval);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="number-counter font-bold">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function Stats() {
  const headerRef = useScrollFade();

  return (
    <section className="py-20 px-6 border-y border-[var(--gold)]/10 bg-[var(--charcoal)]/60">
      <div className="max-w-6xl mx-auto">
        <div ref={headerRef} className="scroll-fade text-center mb-12">
          <span className="text-sm tracking-[0.3em] uppercase text-[var(--gold)] font-sans-lux font-bold">
            Our Experience in Numbers
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={stat.label} className="text-center" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="font-serif-lux text-5xl md:text-6xl font-bold text-gold-static mb-3">
                <Counter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="h-1 w-10 bg-[var(--gold)]/40 mx-auto mb-3 rounded-full" />
              <p className="text-xs tracking-[0.15em] uppercase text-[var(--cream)]/80 font-sans-lux font-semibold">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
