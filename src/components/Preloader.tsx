import { useEffect, useState } from 'react';

export default function Preloader() {
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setHidden(true), 400);
          return 100;
        }
        return p + 8 + Math.random() * 12;
      });
    }, 80);

    const onLoad = () => {
      setProgress(100);
      setTimeout(() => setHidden(true), 500);
    };
    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad);

    return () => {
      clearInterval(interval);
      window.removeEventListener('load', onLoad);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[var(--obsidian)] flex flex-col items-center justify-center transition-opacity duration-700 ${
        progress >= 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Logo */}
      <div className="mb-12 animate-fade-in-up text-center">
        <div className="flex items-center justify-center gap-3.5 mb-2">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-[var(--gold)]/40 flex items-center justify-center bg-white">
            <img src="/GSV-logo.png" alt="GSV" className="w-full h-full object-contain p-1" />
          </div>
          <div className="text-left">
            <div className="font-serif-lux text-2xl md:text-3xl tracking-[0.15em] text-[var(--cream)] font-bold">
              Gift Shop Vellore
            </div>
            <div className="text-[9px] tracking-[0.25em] text-[var(--gold)]/80 uppercase font-sans-lux font-medium">
              Custom Made Gifts
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="w-64">
        <div className="h-1 bg-[var(--cream)]/10 rounded-full relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--gold)] via-[var(--gold-light)] to-[var(--gold)] transition-all duration-300 rounded-full"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--cream)]/60 font-sans-lux font-medium">
            Loading Custom Gifts...
          </span>
          <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--gold)] font-sans-lux font-bold number-counter">
            {Math.min(Math.floor(progress), 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
