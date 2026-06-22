import { useScrollFade } from '../hooks/useScrollFade';
import { Star, Quote } from 'lucide-react';
import { type TestimonialItem } from '../data/products';

interface TestimonialsProps {
  testimonials: TestimonialItem[];
}

function TestimonialCard({ testimonial, index }: { testimonial: TestimonialItem; index: number }) {
  const ref = useScrollFade();

  return (
    <div
      ref={ref}
      className="scroll-fade glass-lux-light p-8 md:p-10 border border-[var(--gold)]/15 hover:border-[var(--gold)]/40 transition-all duration-500 relative group rounded-2xl shadow-xl bg-black/40 flex flex-col justify-between"
      style={{ transitionDelay: `${(index % 4) * 100}ms` }}
    >
      <Quote size={36} className="text-[var(--gold)]/20 absolute top-6 right-6 group-hover:text-[var(--gold)]/50 transition-colors duration-500" />

      <div>
        <div className="flex items-center gap-1.5 mb-6">
          {[...Array(5)].map((_, idx) => (
            <Star key={idx} size={15} className="text-[var(--gold)] fill-[var(--gold)]" />
          ))}
        </div>

        {testimonial.image && (
          <div className="mb-6 rounded-xl overflow-hidden border border-[var(--gold)]/30 max-h-60 bg-black">
            <img src={testimonial.image} alt="Customer item" className="w-full h-full object-cover" />
          </div>
        )}

        <p className="font-serif-lux text-xl md:text-2xl text-[var(--cream)]/90 leading-relaxed mb-8 italic font-normal">
          "{testimonial.quote}"
        </p>
      </div>

      <div className="flex items-center gap-4 pt-6 border-t border-[var(--gold)]/15 font-sans-lux">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--gold)] to-[var(--gold-dark)] flex items-center justify-center font-serif-lux text-[var(--obsidian)] font-bold text-lg shadow-lg">
          {testimonial.initials}
        </div>
        <div>
          <p className="text-[var(--cream)] font-bold text-base">{testimonial.name}</p>
          <p className="text-[var(--cream)]/60 text-xs tracking-wider uppercase font-medium">{testimonial.title}</p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const headerRef = useScrollFade();

  return (
    <section id="testimonials" className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div ref={headerRef} className="scroll-fade text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-12 bg-[var(--gold)]/60" />
            <span className="text-xs tracking-[0.2em] uppercase text-[var(--gold)] font-sans-lux font-bold">
              Customer Testimonials
            </span>
            <div className="h-px w-12 bg-[var(--gold)]/60" />
          </div>
          <h2 className="font-serif-lux text-5xl md:text-6xl font-light text-[var(--cream)] leading-[1.1] mb-6">
            What our <span className="italic text-gold-gradient font-normal">happy customers</span> say.
          </h2>
          <p className="font-sans-lux text-[var(--cream)]/75 max-w-xl mx-auto text-base md:text-lg">
            We are very proud of the feedback we get from people who order our custom gifts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, i) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
