import { useSiteContent } from '../context/SiteContentContext';

export default function TermsOfService() {
  const { content } = useSiteContent();

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen">
      <div className="max-w-4xl mx-auto glass-lux-light p-8 md:p-12 border border-[var(--gold)]/20 rounded-2xl shadow-2xl bg-black/40">
        <h1 className="font-serif-lux text-4xl md:text-5xl text-[var(--cream)] mb-8 font-light text-center">
          {content.termsOfService?.title || "Terms of Service"}
        </h1>
        <div className="font-sans-lux text-[var(--cream)]/80 text-lg leading-relaxed space-y-6 whitespace-pre-wrap">
          {content.termsOfService?.content || "Content coming soon."}
        </div>
      </div>
    </div>
  );
}
