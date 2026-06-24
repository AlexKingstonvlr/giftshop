import { useState } from 'react';
import Navbar from './components/Navbar';
import Preloader from './components/Preloader';
import { Routes, Route } from 'react-router-dom';
import { SiteContentProvider } from './context/SiteContentContext';
import Home from './pages/Home';
import About from './pages/About';
import FAQ from './pages/FAQ';
import RefundPolicy from './pages/RefundPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import AdminDashboard from './components/AdminDashboard';
import ParticleBackground from './components/ParticleBackground';
import { initialProducts, initialTestimonials, type Product, type TestimonialItem } from './data/products';
import { CheckCircle, X } from 'lucide-react';

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'product' | 'testimonial' } | null>(null);
  
  // State synchronized with localStorage
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('vellore_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialProducts;
      }
    }
    return initialProducts;
  });

  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(() => {
    const saved = localStorage.getItem('vellore_testimonials');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialTestimonials;
      }
    }
    return initialTestimonials;
  });

  const handleAddProduct = (newProduct: Product) => {
    const updated = [newProduct, ...products];
    setProducts(updated);
    localStorage.setItem('vellore_products', JSON.stringify(updated));
    setToast({
      message: `New Product "${newProduct.name}" successfully published to the live website!`,
      type: 'product'
    });
    setTimeout(() => setToast(null), 7000);
  };

  const handleAddTestimonial = (newTestimonial: TestimonialItem) => {
    const updated = [newTestimonial, ...testimonials];
    setTestimonials(updated);
    localStorage.setItem('vellore_testimonials', JSON.stringify(updated));
    setToast({
      message: `New Testimonial by "${newTestimonial.name}" successfully published to the live website!`,
      type: 'testimonial'
    });
    setTimeout(() => setToast(null), 7000);
  };

  const handleToastClick = (type: 'product' | 'testimonial') => {
    setToast(null);
    const id = type === 'product' ? 'collection' : 'testimonials';
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <SiteContentProvider>
      <div className="relative min-h-screen text-[var(--cream)] overflow-x-hidden">
      <ParticleBackground />
      <Preloader />
      <Navbar onOpenAdmin={() => setIsAdminOpen(true)} />
      
      {/* Floating Global Success Notification Toast */}
      {toast && (
        <div className="fixed top-24 right-6 z-[200] max-w-md bg-white border-2 border-emerald-500/80 rounded-2xl p-5 shadow-[0_0_40px_rgba(16,185,129,0.3)] animate-fade-in-up flex items-start gap-4 backdrop-blur-xl">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center flex-shrink-0 mt-0.5">
            <CheckCircle size={22} className="text-emerald-400" />
          </div>
          <div className="flex-1 font-sans-lux">
            <h4 className="text-emerald-400 font-bold text-sm uppercase tracking-wider mb-1">
              {toast.type === 'product' ? 'Product Published' : 'Testimonial Published'}
            </h4>
            <p className="text-[var(--cream)] text-sm leading-relaxed mb-3 font-medium">
              {toast.message}
            </p>
            <button
              onClick={() => handleToastClick(toast.type)}
              className="bg-emerald-500 text-black font-bold text-xs uppercase px-4 py-2 rounded-lg hover:bg-emerald-400 transition-colors shadow-lg"
            >
              View on Website →
            </button>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-black/30 hover:text-black/60 transition-colors p-1"
            aria-label="Close notification"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <main>
        <Routes>
          <Route path="/" element={<Home products={products} testimonials={testimonials} />} />
          <Route path="/about" element={<About />} />
          <Route path="/faqs" element={<FAQ />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
        </Routes>
      </main>

      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      <BackToTop />

      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onAddProduct={handleAddProduct}
        onAddTestimonial={handleAddTestimonial}
      />
    </div>
    </SiteContentProvider>
  );
}
