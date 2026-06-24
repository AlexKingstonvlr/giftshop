import { useSiteContent } from '../context/SiteContentContext';

export default function FAQ() {
  const { content } = useSiteContent();

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen">
      <div className="max-w-4xl mx-auto glass-lux-light p-8 md:p-12 border border-[var(--gold)]/20 rounded-2xl shadow-2xl">
        <h1 className="font-serif-lux text-4xl md:text-5xl text-[var(--cream)] mb-12 font-light text-center">
          Frequently Asked Questions
        </h1>
        <div className="space-y-8 font-sans-lux">
          {content.faq.map((item, index) => (
            <div key={index} className="border-b border-[var(--gold)]/15 pb-6">
              <h3 className="text-xl text-[var(--cream)] font-bold mb-3">{item.question}</h3>
              <p className="text-[var(--cream)]/80 leading-relaxed text-base">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
