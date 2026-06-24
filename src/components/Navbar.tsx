import { useState, useEffect } from 'react';
import { Menu, X, Star, Lock, Phone, Mail } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const links = [
  { name: 'Collection', id: 'collection' },
  { name: 'Crafts', id: 'craft' },
  { name: 'How to Order', id: 'how-it-works' },
  { name: 'Order Custom Gift', id: 'custom-order' },
  { name: 'Contact', id: 'contact' },
];

interface NavbarProps {
  onOpenAdmin: () => void;
}

export default function Navbar({ onOpenAdmin }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, id: string) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    setOpen(false);
  };

  return (
    <nav
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'py-3 glass-lux border-b border-gold/10 shadow-2xl shadow-black/40 top-0' : 'py-5 top-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <div className="w-10 h-10 rounded-full border border-[var(--gold)]/40 flex items-center justify-center bg-black/40 backdrop-blur-sm group-hover:border-[var(--gold)] transition-colors">
              <span className="font-serif-lux text-[var(--gold)] text-xl italic font-bold">G</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className={`font-serif-lux text-xl md:text-2xl tracking-[0.15em] font-semibold ${!scrolled ? 'text-white' : 'text-[var(--cream)]'}`}>
                Gift Shop Vellore
              </span>
              <span className={`text-[9px] tracking-[0.25em] uppercase mt-0.5 font-sans-lux font-medium ${!scrolled ? 'text-[var(--gold)]/80' : 'text-[var(--gold)]/80'}`}>
                Custom Made Gifts
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-8">
            {links.map((l) => (
              <li key={l.name}>
                <a
                  href={`#${l.id}`}
                  onClick={(e) => handleNav(e, l.id)}
                  className={`text-xs font-sans-lux tracking-[0.15em] uppercase ${!scrolled ? 'text-[var(--gold)]/90' : 'text-[var(--gold)]/90'} hover:text-[var(--gold)] transition-colors duration-300 relative group font-medium`}
                >
                  {l.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-[var(--gold)] group-hover:w-full transition-all duration-300" />
                </a>
              </li>
            ))}
          </ul>

          {/* Top right buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={(e) => handleNav(e, 'testimonials')}
              className="btn-outline-gold text-xs uppercase px-5 py-2.5 rounded-lg flex items-center gap-2 font-sans-lux font-medium"
              aria-label="Testimonial"
            >
              <Star size={14} className="text-[var(--gold)] fill-[var(--gold)]" />
              Testimonial
            </button>

            <button
              onClick={onOpenAdmin}
              className={`w-10 h-10 rounded-lg border ${!scrolled ? 'border-white/20 bg-white/10 text-white/80' : 'border-[var(--border)]/50 bg-black/5 text-[var(--cream)]/70'} hover:border-[var(--gold)]/40 hover:text-[var(--gold)] transition-all`}
              title="Admin Login"
              aria-label="Admin Login"
            >
              <Lock size={15} />
            </button>
          </div>

          {/* Mobile toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={onOpenAdmin}
              className="w-9 h-9 rounded-lg border border-[var(--border)]/50 bg-black/5 flex items-center justify-center text-[var(--cream)]/70"
              aria-label="Admin Login"
            >
              <Lock size={14} />
            </button>
            <button
              className={`p-1 ${!scrolled ? 'text-white' : 'text-[var(--cream)]'}`}
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`lg:hidden transition-all duration-500 overflow-hidden ${
            open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="glass-lux border-t border-[var(--gold)]/10 px-6 py-6 flex flex-col gap-5">
            {links.map((l) => (
              <a
                key={l.name}
                href={`#${l.id}`}
                onClick={(e) => handleNav(e, l.id)}
                className="text-[var(--cream)] text-sm uppercase tracking-[0.15em] font-sans-lux font-medium"
              >
                {l.name}
              </a>
            ))}
            {/* Mobile contact cluster */}
            <div className="border-t border-[var(--gold)]/15 pt-4 mt-2 space-y-3">
              <a
                href="tel:9514585959"
                className="flex items-center gap-2 text-[var(--cream)]/70 text-xs hover:text-[var(--gold)] transition-colors"
              >
                <Phone size={12} className="text-[var(--gold)]" />
                9514585959
              </a>
              <a
                href="mailto:giftshop.vlr@gmail.com"
                className="flex items-center gap-2 text-[var(--cream)]/70 text-xs hover:text-[var(--gold)] transition-colors"
              >
                <Mail size={12} className="text-[var(--gold)]" />
                giftshop.vlr@gmail.com
              </a>
              <a
                href="https://www.instagram.com/giftshop.vlr?igsh=MWIxMXk5dWdtbGs2eg=="
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[var(--cream)]/70 text-xs hover:text-[var(--gold)] transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-[var(--gold)]">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                @giftshop.vlr
              </a>
            </div>
            <button
              onClick={(e) => handleNav(e, 'testimonials')}
              className="btn-outline-gold text-xs uppercase px-5 py-3 rounded-lg flex items-center justify-center gap-2 font-sans-lux font-medium mt-1"
            >
              <Star size={14} className="text-[var(--gold)] fill-[var(--gold)]" />
              Testimonial
            </button>
          </div>
        </div>
      </nav>
  );
}
