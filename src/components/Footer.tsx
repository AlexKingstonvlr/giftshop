import { Lock, Phone, MessageCircle, MapPin } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

type AnchorLink = { name: string; id: string };
type RouteLink = { name: string; path: string };
type FooterLink = AnchorLink | RouteLink;

const footerLinks: Record<string, FooterLink[]> = {
  Crafts: [{ name: 'Epoxy Resin Gifts', id: 'collection' }, { name: 'Laser Cut Wood', id: 'collection' }, { name: '3D Printing', id: 'collection' }, { name: 'Special Orders', id: 'custom-order' }],
  Company: [{ name: 'About Us', path: '/about' }],
  Support: [{ name: 'FAQs', path: '/faqs' }, { name: 'Return/Refund Policy', path: '/refund-policy' }, { name: 'How to Order', id: 'how-it-works' }],
};

interface FooterProps {
  onOpenAdmin: () => void;
}

export default function Footer({ onOpenAdmin }: FooterProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleAnchor = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer id="contact" className="border-t border-[var(--gold)]/10 pt-20 pb-12 px-6 relative overflow-hidden bg-[var(--charcoal)]/60">
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 font-sans-lux">
        {/* Top brand */}
        <div className="text-center mb-16">
          <h3 className="font-serif-lux text-4xl md:text-5xl font-semibold text-[var(--cream)] leading-none mb-4 tracking-[0.1em]">
            Gift Shop Vellore
          </h3>
          <div className="h-1 w-16 bg-[var(--gold)]/60 mx-auto mb-4 rounded-full" />
          <p className="font-sans-lux text-[var(--cream)]/70 text-base md:text-lg max-w-lg mx-auto font-medium">
            "Beautiful custom made luxury gifts. Hand-finished with great care in Vellore."
          </p>
        </div>

        {/* Links + Map */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16 pb-16 border-b border-[var(--gold)]/15">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs tracking-[0.2em] uppercase text-[var(--gold)] mb-5 font-bold font-sans-lux">
                {category}
              </h4>
              <ul className="space-y-3.5">
                {links.map((l) => {
                  const isAnchor = 'id' in l;
                  return (
                  <li key={l.name}>
                    {isAnchor ? (
                      <a
                        href={`#${(l as AnchorLink).id}`}
                        onClick={(e) => handleAnchor(e, (l as AnchorLink).id)}
                        className="text-[var(--cream)]/70 hover:text-[var(--gold)] text-sm font-sans-lux transition-colors duration-300 font-medium"
                      >
                        {l.name}
                      </a>
                    ) : (
                      <Link
                        to={(l as RouteLink).path}
                        onClick={() => window.scrollTo(0, 0)}
                        className="text-[var(--cream)]/70 hover:text-[var(--gold)] text-sm font-sans-lux transition-colors duration-300 font-medium"
                      >
                        {l.name}
                      </Link>
                    )}
                  </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {/* Contact Us */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-[var(--gold)] mb-5 font-bold font-sans-lux">
              Contact Us
            </h4>
            <ul className="space-y-3.5">
              <li>
                <a
                  href="tel:9514585959"
                  className="flex items-center gap-2.5 text-[var(--cream)]/70 hover:text-[var(--gold)] text-sm font-sans-lux transition-colors duration-300 font-medium"
                >
                  <Phone size={14} className="text-[var(--gold)] flex-shrink-0" />
                  9514585959
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/919514585959"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-[var(--cream)]/70 hover:text-[var(--gold)] text-sm font-sans-lux transition-colors duration-300 font-medium"
                >
                  <MessageCircle size={14} className="text-[var(--gold)] flex-shrink-0" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/giftshop.vlr?igsh=MWIxMXk5dWdtbGs2eg=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-[var(--cream)]/70 hover:text-[var(--gold)] text-sm font-sans-lux transition-colors duration-300 font-medium"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px] text-[var(--gold)] flex-shrink-0">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  @giftshop.vlr
                </a>
              </li>
              <li>
                <a
                  href="https://maps.app.goo.gl/fn6puQwjaphdSqrb9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 text-[var(--cream)]/70 hover:text-[var(--gold)] text-sm font-sans-lux transition-colors duration-300 font-medium"
                >
                  <MapPin size={14} className="text-[var(--gold)] flex-shrink-0 mt-0.5" />
                  <span>
                    Siva Complex, 239/1, Phase 2<br />
                    Sathuvachari, Vellore — 632009
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs tracking-wider text-[var(--cream)]/50 font-sans-lux font-medium">
          <p>© {new Date().getFullYear()} Gift Shop Vellore. All custom gifts made with pride.</p>
          
          <div className="flex items-center gap-6">
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 text-[var(--gold)] hover:text-[var(--gold-light)] font-bold transition-colors bg-white/5 px-4 py-2 rounded-xl border border-[var(--gold)]/30 shadow-md"
            >
              <Lock size={13} /> Admin Login
            </button>
            <Link
              to="/privacy-policy"
              onClick={() => window.scrollTo(0, 0)}
              className="hover:text-[var(--gold)] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-service"
              onClick={() => window.scrollTo(0, 0)}
              className="hover:text-[var(--gold)] transition-colors"
            >
              Terms of Use
            </Link>
          </div>

          <p className="font-bold text-sm text-[var(--gold)]">
            ⭐ Hand-crafted in Vellore, India.
          </p>
        </div>
      </div>
    </footer>
  );
}
