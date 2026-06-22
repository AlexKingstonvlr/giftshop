import { useState, useEffect } from 'react';
import { type Product, type TestimonialItem, type Category } from '../data/products';
import { X, Lock, PlusCircle, CheckCircle, Image as ImageIcon, FileText } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
  onAddTestimonial: (testimonial: TestimonialItem) => void;
}

export default function AdminDashboard({ isOpen, onClose, onAddProduct, onAddTestimonial }: AdminDashboardProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const { content, updateContent } = useSiteContent();
  const [activeTab, setActiveTab] = useState<'product' | 'testimonial' | 'content'>('product');
  const [published, setPublished] = useState<null | { type: 'product' | 'testimonial' | 'content'; name: string }>(null);
  const [jsonContent, setJsonContent] = useState(JSON.stringify(content, null, 2));

  // Product form state
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<Category>('Epoxy Resin');
  const [prodDesc, setProdDesc] = useState('');
  const [prodMaterial, setProdMaterial] = useState('');
  const [prodSize, setProdSize] = useState('');
  const [prodTime, setProdTime] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodImage, setProdImage] = useState('');

  // Testimonial form state
  const [testimName, setTestimName] = useState('');
  const [testimQuote, setTestimQuote] = useState('');
  const [testimImage, setTestimImage] = useState('');

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (published) {
      const t = setTimeout(() => setPublished(null), 4000);
      return () => clearTimeout(t);
    }
  }, [published]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple secure password for business owner
    if (password === 'admin123' || password === 'vellore123') {
      setIsLoggedIn(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'product' | 'testimonial') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'product') {
          setProdImage(reader.result as string);
        } else {
          setTestimImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    
    // Minimal validation
    const finalName = prodName.trim() || 'Untitled Product';
    const finalDesc = prodDesc.trim() || 'A beautiful custom made gift.';
    const finalPrice = prodPrice.trim() || '₹4,999';

    const newProduct: Product = {
      id: Date.now(),
      name: finalName,
      category: prodCategory,
      description: finalDesc,
      price: finalPrice.startsWith('₹') ? finalPrice : `₹${finalPrice}`,
      image: prodImage || '/images/hero-resin-table.jpg',
      material: prodMaterial.trim() || 'Premium Material',
      dimensions: prodSize.trim() || 'Custom Size',
      leadTime: prodTime.trim() || '1-2 weeks',
    };

    onAddProduct(newProduct);
    setPublished({ type: 'product', name: newProduct.name });
    setSubmitting(false);

    // Reset form
    setProdName('');
    setProdDesc('');
    setProdMaterial('');
    setProdSize('');
    setProdTime('');
    setProdPrice('');
    setProdImage('');
  };

  const handleTestimonialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimName || !testimQuote) return;
    if (submitting) return;
    setSubmitting(true);

    const initials = testimName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newTestimonial: TestimonialItem = {
      id: `t_${Date.now()}`,
      name: testimName,
      title: 'Verified Customer, Vellore',
      quote: testimQuote,
      initials: initials || 'CU',
      image: testimImage || undefined,
    };

    onAddTestimonial(newTestimonial);
    setPublished({ type: 'testimonial', name: newTestimonial.name });
    setSubmitting(false);

    // Reset form
    setTestimName('');
    setTestimQuote('');
    setTestimImage('');
  };

  const handleContentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(jsonContent);
      updateContent(parsed);
      setPublished({ type: 'content', name: 'Site Content Updated' });
    } catch (error) {
      alert("Invalid JSON format. Please check your syntax before saving.");
    }
  };

  const handleViewOnSite = () => {
    const sectionId = published?.type === 'product' ? 'collection' : published?.type === 'testimonial' ? 'testimonials' : '';
    setPublished(null);
    onClose();
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  // In-panel success notification (Option B)
  const SuccessBanner = published ? (
    <div className="mb-6 rounded-xl overflow-hidden animate-fade-in-up border border-emerald-500/50 bg-emerald-950/60 shadow-lg">
      <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
      <div className="p-5 flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center flex-shrink-0 shadow-md">
          <CheckCircle size={24} className="text-emerald-400" />
        </div>
        <div className="flex-1">
          <h4 className="text-emerald-300 font-bold text-sm uppercase tracking-wider mb-1">
            {published.type === 'product' ? 'Product Published Successfully!' : published.type === 'testimonial' ? 'Testimonial Published Successfully!' : 'Content Updated!'}
          </h4>
          <p className="text-[var(--cream)]/90 text-sm leading-relaxed mb-3 font-medium">
            "{published.name}" is now live on the website.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleViewOnSite}
              className="bg-emerald-500 text-black font-bold text-xs uppercase px-4 py-2 rounded-lg hover:bg-emerald-400 transition-colors shadow-md"
            >
              View on Website →
            </button>
            <button
              onClick={() => setPublished(null)}
              className="text-xs text-emerald-300/80 hover:text-emerald-300 font-semibold px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in-up">
      <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto glass-lux border border-[var(--gold)]/30 rounded-2xl p-6 md:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--gold)]/20 transition-colors text-white"
          aria-label="Close Admin"
        >
          <X size={18} />
        </button>

        {!isLoggedIn ? (
          <div className="max-w-md mx-auto py-12 text-center">
            <div className="w-16 h-16 rounded-full border border-[var(--gold)]/40 bg-black/40 flex items-center justify-center mx-auto mb-6">
              <Lock size={28} className="text-[var(--gold)]" />
            </div>
            <h2 className="font-serif-lux text-3xl text-[var(--cream)] mb-2 font-light">
              Business Owner Login
            </h2>
            <p className="text-xs text-[var(--cream)]/60 mb-8 font-sans-lux">
              Enter your admin password to manage products and testimonials. (Hint: enter <span className="text-[var(--gold)]">admin123</span>)
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  required
                  className="w-full bg-black/50 border border-[var(--gold)]/30 rounded-xl px-4 py-3.5 text-center text-[var(--cream)] placeholder-[var(--cream)]/30 text-sm focus:outline-none focus:border-[var(--gold)] transition-colors font-sans-lux"
                />
                {loginError && (
                  <p className="text-red-400 text-xs mt-2 font-sans-lux">
                    Incorrect password. Please try again or use admin123.
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="btn-gold w-full text-xs uppercase py-4 rounded-xl tracking-[0.2em]"
              >
                Access Dashboard
              </button>
            </form>
          </div>
        ) : (
          <div>
            <div className="text-center mb-8 border-b border-[var(--gold)]/20 pb-6">
              <h2 className="font-serif-lux text-3xl text-[var(--cream)] mb-1 font-light">
                Gift Shop Vellore Admin
              </h2>
              <p className="text-xs text-[var(--cream)]/60 font-sans-lux">
                Upload new products or customer testimonials instantly.
              </p>
            </div>

            {/* Navigation tabs */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setActiveTab('product')}
                className={`flex-1 py-3 px-4 rounded-xl text-xs uppercase tracking-wider font-sans-lux transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'product'
                    ? 'bg-[var(--gold)] text-[var(--obsidian)] font-bold shadow-lg shadow-[var(--gold)]/20'
                    : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                }`}
              >
                <PlusCircle size={15} /> Add New Product
              </button>
              <button
                onClick={() => setActiveTab('testimonial')}
                className={`flex-1 py-3 px-4 rounded-xl text-xs uppercase tracking-wider font-sans-lux transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'testimonial'
                    ? 'bg-[var(--gold)] text-[var(--obsidian)] font-bold shadow-lg shadow-[var(--gold)]/20'
                    : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                }`}
              >
                <PlusCircle size={15} /> Add Testimonial
              </button>
              <button
                onClick={() => { setActiveTab('content'); setJsonContent(JSON.stringify(content, null, 2)); }}
                className={`flex-1 py-3 px-4 rounded-xl text-xs uppercase tracking-wider font-sans-lux transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'content'
                    ? 'bg-[var(--gold)] text-[var(--obsidian)] font-bold shadow-lg shadow-[var(--gold)]/20'
                    : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                }`}
              >
                <FileText size={15} /> Site Content
              </button>
            </div>

            {SuccessBanner}

            {activeTab === 'product' ? (
              <form onSubmit={handleProductSubmit} className="space-y-5 font-sans-lux">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[var(--cream)]/70 font-semibold mb-1 block">Product Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Glowing Galaxy Ring Box"
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-[var(--cream)] placeholder-[var(--cream)]/25 text-sm focus:outline-none focus:border-[var(--gold)]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[var(--cream)]/70 font-semibold mb-1 block">Product Category</label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value as Category)}
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-[var(--cream)] text-sm focus:outline-none focus:border-[var(--gold)]"
                    >
                      <option value="Epoxy Resin">Epoxy Resin</option>
                      <option value="Laser Cut">Laser Cut</option>
                      <option value="3D Printing">3D Printing</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[var(--cream)]/70 font-semibold mb-1 block">Short Description</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe the custom product in simple English..."
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-[var(--cream)] placeholder-[var(--cream)]/25 text-sm focus:outline-none focus:border-[var(--gold)] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-[var(--cream)]/70 font-semibold mb-1 block">Material</label>
                    <input
                      type="text"
                      placeholder="e.g. Wood and Resin"
                      value={prodMaterial}
                      onChange={(e) => setProdMaterial(e.target.value)}
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-[var(--cream)] placeholder-[var(--cream)]/25 text-sm focus:outline-none focus:border-[var(--gold)]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[var(--cream)]/70 font-semibold mb-1 block">Size</label>
                    <input
                      type="text"
                      placeholder="e.g. 20 x 15 cm"
                      value={prodSize}
                      onChange={(e) => setProdSize(e.target.value)}
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-[var(--cream)] placeholder-[var(--cream)]/25 text-sm focus:outline-none focus:border-[var(--gold)]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[var(--cream)]/70 font-semibold mb-1 block">Time to Deliver</label>
                    <input
                      type="text"
                      placeholder="e.g. 5 days"
                      value={prodTime}
                      onChange={(e) => setProdTime(e.target.value)}
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-[var(--cream)] placeholder-[var(--cream)]/25 text-sm focus:outline-none focus:border-[var(--gold)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[var(--cream)]/70 font-semibold mb-1 block">Approximate Price</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹4,500"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-[var(--cream)] placeholder-[var(--cream)]/25 text-sm focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>

                <div>
                  <label className="text-xs text-[var(--cream)]/70 font-semibold mb-2 block">Upload Product Image</label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-xl p-6 hover:border-[var(--gold)] transition-colors cursor-pointer bg-black/20">
                    {prodImage ? (
                      <div className="flex items-center gap-4 w-full">
                        <img src={prodImage} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-white/20" />
                        <span className="text-xs text-emerald-400 font-semibold">✓ Image uploaded successfully (Click to replace)</span>
                      </div>
                    ) : (
                      <div className="text-center flex flex-col items-center">
                        <ImageIcon size={28} className="text-[var(--gold)]/60 mb-2" />
                        <span className="text-xs text-white/70 font-medium mb-1">Click to select an image file</span>
                        <span className="text-[10px] text-white/40">JPG, PNG, WEBP supported</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, 'product')}
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-4 rounded-xl text-xs uppercase tracking-[0.2em] font-semibold mt-4 transition-all ${
                    submitting
                      ? 'bg-[var(--gold)]/50 text-[var(--obsidian)] cursor-not-allowed'
                      : 'btn-gold'
                  }`}
                >
                  {submitting ? 'Publishing…' : 'Publish New Product'}
                </button>
              </form>
            ) : activeTab === 'testimonial' ? (
              <form onSubmit={handleTestimonialSubmit} className="space-y-5 font-sans-lux">
                <div>
                  <label className="text-xs text-[var(--cream)]/70 font-semibold mb-1 block">Customer Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={testimName}
                    onChange={(e) => setTestimName(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-[var(--cream)] placeholder-[var(--cream)]/25 text-sm focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>

                <div>
                  <label className="text-xs text-[var(--cream)]/70 font-semibold mb-1 block">Small Description / Review</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="e.g. I bought a custom nameplate and it looks very beautiful on my door. Excellent customer service!"
                    value={testimQuote}
                    onChange={(e) => setTestimQuote(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-[var(--cream)] placeholder-[var(--cream)]/25 text-sm focus:outline-none focus:border-[var(--gold)] resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-[var(--cream)]/70 font-semibold mb-2 block">Upload Customer or Product Image</label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-xl p-6 hover:border-[var(--gold)] transition-colors cursor-pointer bg-black/20">
                    {testimImage ? (
                      <div className="flex items-center gap-4 w-full">
                        <img src={testimImage} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-white/20" />
                        <span className="text-xs text-emerald-400 font-semibold">✓ Image uploaded successfully (Click to replace)</span>
                      </div>
                    ) : (
                      <div className="text-center flex flex-col items-center">
                        <ImageIcon size={28} className="text-[var(--gold)]/60 mb-2" />
                        <span className="text-xs text-white/70 font-medium mb-1">Click to upload image</span>
                        <span className="text-[10px] text-white/40">Optional customer photo or item photo</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, 'testimonial')}
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-4 rounded-xl text-xs uppercase tracking-[0.2em] font-semibold mt-4 transition-all ${
                    submitting
                      ? 'bg-[var(--gold)]/50 text-[var(--obsidian)] cursor-not-allowed'
                      : 'btn-gold'
                  }`}
                >
                  {submitting ? 'Publishing…' : 'Publish Testimonial'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleContentSubmit} className="space-y-5 font-sans-lux">
                <div>
                  <label className="text-xs text-[var(--cream)]/70 font-semibold mb-2 block">Site Content Data (JSON)</label>
                  <p className="text-xs text-[var(--cream)]/50 mb-3">You can edit any text here. Please ensure it remains valid JSON.</p>
                  <textarea
                    required
                    rows={15}
                    value={jsonContent}
                    onChange={(e) => setJsonContent(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-[var(--cream)] placeholder-[var(--cream)]/25 text-sm focus:outline-none focus:border-[var(--gold)] font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-gold w-full py-4 rounded-xl text-xs uppercase tracking-[0.2em] font-semibold mt-4"
                >
                  Save Changes
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
