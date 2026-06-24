import { useState, useEffect } from 'react';
import { type Product, type TestimonialItem, type Category } from '../data/products';
import { X, Lock, PlusCircle, CheckCircle, Image as ImageIcon, FileText, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  testimonials: TestimonialItem[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (id: number, product: Product) => void;
  onDeleteProduct: (id: number) => void;
  onAddTestimonial: (testimonial: TestimonialItem) => void;
  onUpdateTestimonial: (id: string, testimonial: TestimonialItem) => void;
  onDeleteTestimonial: (id: string) => void;
}

export default function AdminDashboard({ isOpen, onClose, products, testimonials, onAddProduct, onUpdateProduct, onDeleteProduct, onAddTestimonial, onUpdateTestimonial, onDeleteTestimonial }: AdminDashboardProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const { content, updateContent } = useSiteContent();
  const [activeTab, setActiveTab] = useState<'product' | 'testimonial' | 'content' | 'editproduct' | 'edittestimonial'>('product');
  const [published, setPublished] = useState<null | { type: 'product' | 'testimonial' | 'content'; name: string }>(null);
  const [ct, setCt] = useState({ ...content });
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');

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

  // Edit state
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'product' | 'testimonial'; id: number | string; name: string } | null>(null);

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

  const resetProductForm = () => {
    setProdName('');
    setProdDesc('');
    setProdMaterial('');
    setProdSize('');
    setProdTime('');
    setProdPrice('');
    setProdImage('');
    setEditingProductId(null);
  };

  const resetTestimonialForm = () => {
    setTestimName('');
    setTestimQuote('');
    setTestimImage('');
    setEditingTestimonialId(null);
  };

  const startAddProduct = () => {
    resetProductForm();
    setActiveTab('product');
  };

  const startAddTestimonial = () => {
    resetTestimonialForm();
    setActiveTab('testimonial');
  };

  const startEditProduct = (product: Product) => {
    setProdName(product.name);
    setProdCategory(product.category);
    setProdDesc(product.description);
    setProdMaterial(product.material || '');
    setProdSize(product.dimensions || '');
    setProdTime(product.leadTime || '');
    setProdPrice(product.price.replace('₹', ''));
    setProdImage(product.image);
    setEditingProductId(product.id);
    setActiveTab('product');
  };

  const startEditTestimonial = (testimonial: TestimonialItem) => {
    setTestimName(testimonial.name);
    setTestimQuote(testimonial.quote);
    setTestimImage(testimonial.image || '');
    setEditingTestimonialId(testimonial.id);
    setActiveTab('testimonial');
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const finalName = prodName.trim() || 'Untitled Product';
    const finalDesc = prodDesc.trim() || 'A beautiful custom made gift.';
    const finalPrice = prodPrice.trim() || '₹4,999';

    const product: Product = {
      id: editingProductId || Date.now(),
      name: finalName,
      category: prodCategory,
      description: finalDesc,
      price: finalPrice.startsWith('₹') ? finalPrice : `₹${finalPrice}`,
      image: prodImage || '/images/hero-resin-table.jpg',
      material: prodMaterial.trim() || 'Premium Material',
      dimensions: prodSize.trim() || 'Custom Size',
      leadTime: prodTime.trim() || '1-2 weeks',
    };

    if (editingProductId) {
      onUpdateProduct(editingProductId, product);
      setPublished({ type: 'product', name: product.name });
      resetProductForm();
    } else {
      onAddProduct(product);
      setPublished({ type: 'product', name: product.name });
      resetProductForm();
    }

    setSubmitting(false);
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

    const testimonial: TestimonialItem = {
      id: editingTestimonialId || `t_${Date.now()}`,
      name: testimName,
      title: 'Verified Customer, Vellore',
      quote: testimQuote,
      initials: initials || 'CU',
      image: testimImage || undefined,
    };

    if (editingTestimonialId) {
      onUpdateTestimonial(editingTestimonialId, testimonial);
      setPublished({ type: 'testimonial', name: testimonial.name });
      resetTestimonialForm();
    } else {
      onAddTestimonial(testimonial);
      setPublished({ type: 'testimonial', name: testimonial.name });
      resetTestimonialForm();
    }

    setSubmitting(false);
  };

  const handleContentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateContent(ct);
    setPublished({ type: 'content', name: 'Site Content Updated' });
  };

  const startContentEdit = () => {
    setCt({ ...content });
    setActiveTab('content');
  };

  const handleDeleteConfirm = () => {
    if (!confirmDelete) return;
    if (confirmDelete.type === 'product') {
      onDeleteProduct(confirmDelete.id as number);
    } else {
      onDeleteTestimonial(confirmDelete.id as string);
    }
    setConfirmDelete(null);
    setPublished({ type: confirmDelete.type, name: confirmDelete.name });
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
          <p className="text-gray-100 text-sm leading-relaxed mb-3 font-medium">
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
              className="text-xs text-emerald-300 hover:text-emerald-300 font-semibold px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
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
            <h2 className="font-serif-lux text-3xl text-white mb-2 font-light">
              Business Owner Login
            </h2>
            <p className="text-xs text-white/70 mb-8 font-sans-lux">
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
                  className="w-full bg-black/50 border border-[var(--gold)]/30 rounded-xl px-4 py-3.5 text-center text-white placeholder-white/30 text-sm focus:outline-none focus:border-[var(--gold)] transition-colors font-sans-lux"
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
              <h2 className="font-serif-lux text-3xl text-white mb-1 font-light">
                Gift Shop Vellore Admin
              </h2>
              <p className="text-xs text-white/70 font-sans-lux">
                Manage products, testimonials, and site content.
              </p>
            </div>

            {/* Navigation tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
              <button
                onClick={startAddProduct}
                className={`flex-1 min-w-[120px] py-3 px-3 rounded-xl text-xs uppercase tracking-wider font-sans-lux transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'product'
                    ? 'bg-[var(--gold)] text-[#1a1a24] font-bold shadow-lg shadow-[var(--gold)]/20'
                    : 'bg-white/20 border border-white/30 text-white hover:bg-white/30'
                }`}
              >
                <PlusCircle size={14} /> Add Product
              </button>
              <button
                onClick={() => setActiveTab('editproduct')}
                className={`flex-1 min-w-[120px] py-3 px-3 rounded-xl text-xs uppercase tracking-wider font-sans-lux transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'editproduct'
                    ? 'bg-[var(--gold)] text-[#1a1a24] font-bold shadow-lg shadow-[var(--gold)]/20'
                    : 'bg-white/20 border border-white/30 text-white hover:bg-white/30'
                }`}
              >
                <Pencil size={14} /> Edit Products
              </button>
              <button
                onClick={startAddTestimonial}
                className={`flex-1 min-w-[120px] py-3 px-3 rounded-xl text-xs uppercase tracking-wider font-sans-lux transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'testimonial'
                    ? 'bg-[var(--gold)] text-[#1a1a24] font-bold shadow-lg shadow-[var(--gold)]/20'
                    : 'bg-white/20 border border-white/30 text-white hover:bg-white/30'
                }`}
              >
                <PlusCircle size={14} /> Add Testimonial
              </button>
              <button
                onClick={() => setActiveTab('edittestimonial')}
                className={`flex-1 min-w-[120px] py-3 px-3 rounded-xl text-xs uppercase tracking-wider font-sans-lux transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'edittestimonial'
                    ? 'bg-[var(--gold)] text-[#1a1a24] font-bold shadow-lg shadow-[var(--gold)]/20'
                    : 'bg-white/20 border border-white/30 text-white hover:bg-white/30'
                }`}
              >
                <Pencil size={14} /> Edit Testimonials
              </button>
              <button
                onClick={startContentEdit}
                className={`flex-1 min-w-[120px] py-3 px-3 rounded-xl text-xs uppercase tracking-wider font-sans-lux transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'content'
                    ? 'bg-[var(--gold)] text-[#1a1a24] font-bold shadow-lg shadow-[var(--gold)]/20'
                    : 'bg-white/20 border border-white/30 text-white hover:bg-white/30'
                }`}
              >
                <FileText size={14} /> Site Content
              </button>
            </div>

            {SuccessBanner}

            {activeTab === 'product' ? (
              <form onSubmit={handleProductSubmit} className="space-y-5 font-sans-lux">
                {editingProductId && (
                  <div className="flex items-center gap-2 mb-2">
                    <button type="button" onClick={resetProductForm} className="text-xs text-white/60 hover:text-white flex items-center gap-1">
                      <ArrowLeft size={14} /> Back to Add New
                    </button>
                    <span className="text-xs text-[var(--gold)] font-semibold">Editing: {prodName || 'Product'}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white font-semibold mb-1 block">Product Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Glowing Galaxy Ring Box"
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[var(--gold)]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white font-semibold mb-1 block">Product Category</label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value as Category)}
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--gold)]"
                    >
                      <option value="Epoxy Resin">Epoxy Resin</option>
                      <option value="Laser Cut">Laser Cut</option>
                      <option value="3D Printing">3D Printing</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white font-semibold mb-1 block">Short Description</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe the custom product in simple English..."
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[var(--gold)] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-white font-semibold mb-1 block">Material</label>
                    <input
                      type="text"
                      placeholder="e.g. Wood and Resin"
                      value={prodMaterial}
                      onChange={(e) => setProdMaterial(e.target.value)}
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[var(--gold)]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white font-semibold mb-1 block">Size</label>
                    <input
                      type="text"
                      placeholder="e.g. 20 x 15 cm"
                      value={prodSize}
                      onChange={(e) => setProdSize(e.target.value)}
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[var(--gold)]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white font-semibold mb-1 block">Time to Deliver</label>
                    <input
                      type="text"
                      placeholder="e.g. 5 days"
                      value={prodTime}
                      onChange={(e) => setProdTime(e.target.value)}
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[var(--gold)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white font-semibold mb-1 block">Approximate Price</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹4,500"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>

                <div>
                  <label className="text-xs text-white font-semibold mb-2 block">Upload Product Image</label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-xl p-6 hover:border-[var(--gold)] transition-colors cursor-pointer bg-black/20">
                    {prodImage ? (
                      <div className="flex items-center gap-4 w-full">
                        <img src={prodImage} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-white/20" />
                        <span className="text-xs text-emerald-400 font-semibold">✓ Image uploaded successfully (Click to replace)</span>
                      </div>
                    ) : (
                      <div className="text-center flex flex-col items-center">
                        <ImageIcon size={28} className="text-amber-400/80 mb-2" />
                        <span className="text-xs text-white/80 font-medium mb-1">Click to select an image file</span>
                        <span className="text-[10px] text-slate-500">JPG, PNG, WEBP supported</span>
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
                      ? 'bg-[var(--gold)]/50 text-[#1a1a24] cursor-not-allowed'
                      : 'btn-gold'
                  }`}
                >
                  {submitting ? 'Saving…' : editingProductId ? 'Update Product' : 'Publish New Product'}
                </button>
              </form>
            ) : activeTab === 'testimonial' ? (
              <form onSubmit={handleTestimonialSubmit} className="space-y-5 font-sans-lux">
                {editingTestimonialId && (
                  <div className="flex items-center gap-2 mb-2">
                    <button type="button" onClick={resetTestimonialForm} className="text-xs text-white/60 hover:text-white flex items-center gap-1">
                      <ArrowLeft size={14} /> Back to Add New
                    </button>
                    <span className="text-xs text-[var(--gold)] font-semibold">Editing: {testimName || 'Testimonial'}</span>
                  </div>
                )}
                <div>
                  <label className="text-xs text-white font-semibold mb-1 block">Customer Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={testimName}
                    onChange={(e) => setTestimName(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>

                <div>
                  <label className="text-xs text-white font-semibold mb-1 block">Small Description / Review</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="e.g. I bought a custom nameplate and it looks very beautiful on my door. Excellent customer service!"
                    value={testimQuote}
                    onChange={(e) => setTestimQuote(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[var(--gold)] resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-white font-semibold mb-2 block">Upload Customer or Product Image</label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-xl p-6 hover:border-[var(--gold)] transition-colors cursor-pointer bg-black/20">
                    {testimImage ? (
                      <div className="flex items-center gap-4 w-full">
                        <img src={testimImage} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-white/20" />
                        <span className="text-xs text-emerald-400 font-semibold">✓ Image uploaded successfully (Click to replace)</span>
                      </div>
                    ) : (
                      <div className="text-center flex flex-col items-center">
                        <ImageIcon size={28} className="text-amber-400/80 mb-2" />
                        <span className="text-xs text-white/80 font-medium mb-1">Click to upload image</span>
                        <span className="text-[10px] text-slate-500">Optional customer photo or item photo</span>
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
                      ? 'bg-[var(--gold)]/50 text-[#1a1a24] cursor-not-allowed'
                      : 'btn-gold'
                  }`}
                >
                  {submitting ? 'Saving…' : editingTestimonialId ? 'Update Testimonial' : 'Publish Testimonial'}
                </button>
              </form>
            ) : activeTab === 'editproduct' ? (
              <div className="space-y-3 font-sans-lux">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">All Products ({products.length})</h3>
                {products.length === 0 ? (
                  <p className="text-white/50 text-sm">No products yet.</p>
                ) : (
                  products.map((product) => (
                    <div key={product.id} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-colors">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover border border-white/10 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold truncate">{product.name}</p>
                        <p className="text-white/70 text-xs">{product.price}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => startEditProduct(product)}
                        className="text-xs text-white font-semibold px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 transition-all flex items-center gap-1 shadow-sm"
                      >
                        <Pencil size={12} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete({ type: 'product', id: product.id, name: product.name })}
                        className="text-xs text-white font-semibold px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-400 transition-all flex items-center gap-1 shadow-sm"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            ) : activeTab === 'edittestimonial' ? (
              <div className="space-y-3 font-sans-lux">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">All Testimonials ({testimonials.length})</h3>
                {testimonials.length === 0 ? (
                  <p className="text-white/50 text-sm">No testimonials yet.</p>
                ) : (
                  testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-colors">
                      <div className="w-12 h-12 rounded-lg bg-[var(--gold)]/20 border border-[var(--gold)]/30 flex items-center justify-center flex-shrink-0 text-[var(--gold)] font-bold text-sm">
                        {testimonial.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold truncate">{testimonial.name}</p>
                        <p className="text-white/60 text-xs truncate">{testimonial.quote}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => startEditTestimonial(testimonial)}
                        className="text-xs text-white font-semibold px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 transition-all flex items-center gap-1 shadow-sm"
                      >
                        <Pencil size={12} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete({ type: 'testimonial', id: testimonial.id, name: testimonial.name })}
                        className="text-xs text-white font-semibold px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-400 transition-all flex items-center gap-1 shadow-sm"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <form onSubmit={handleContentSubmit} className="space-y-6 font-sans-lux">
                {/* Hero Section */}
                <div className="border border-white/10 rounded-xl p-4 space-y-3">
                  <h3 className="text-white font-bold text-xs uppercase tracking-wider">Hero Section</h3>
                  <div>
                    <label className="text-xs text-white/70 mb-1 block">Title (HTML allowed)</label>
                    <input type="text" value={ct.hero.title} onChange={(e) => setCt({ ...ct, hero: { ...ct.hero, title: e.target.value } })} className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--gold)]" />
                  </div>
                  <div>
                    <label className="text-xs text-white/70 mb-1 block">Subtitle</label>
                    <input type="text" value={ct.hero.subtitle} onChange={(e) => setCt({ ...ct, hero: { ...ct.hero, subtitle: e.target.value } })} className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--gold)]" />
                  </div>
                  <div>
                    <label className="text-xs text-white/70 mb-1 block">Description</label>
                    <textarea rows={3} value={ct.hero.description} onChange={(e) => setCt({ ...ct, hero: { ...ct.hero, description: e.target.value } })} className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--gold)] resize-none" />
                  </div>
                </div>

                {/* About Section */}
                <div className="border border-white/10 rounded-xl p-4 space-y-3">
                  <h3 className="text-white font-bold text-xs uppercase tracking-wider">About Us</h3>
                  <div>
                    <label className="text-xs text-white/70 mb-1 block">Title</label>
                    <input type="text" value={ct.about.title} onChange={(e) => setCt({ ...ct, about: { ...ct.about, title: e.target.value } })} className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--gold)]" />
                  </div>
                  <div>
                    <label className="text-xs text-white/70 mb-1 block">Content</label>
                    <textarea rows={6} value={ct.about.content} onChange={(e) => setCt({ ...ct, about: { ...ct.about, content: e.target.value } })} className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--gold)] resize-none" />
                  </div>
                </div>

                {/* FAQ Section */}
                <div className="border border-white/10 rounded-xl p-4 space-y-3">
                  <h3 className="text-white font-bold text-xs uppercase tracking-wider">FAQ</h3>
                  {ct.faq.map((item, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <div className="flex-1 space-y-1">
                        <input type="text" value={item.question} onChange={(e) => { const f = [...ct.faq]; f[i] = { ...f[i], question: e.target.value }; setCt({ ...ct, faq: f }); }} placeholder="Question" className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[var(--gold)]" />
                        <input type="text" value={item.answer} onChange={(e) => { const f = [...ct.faq]; f[i] = { ...f[i], answer: e.target.value }; setCt({ ...ct, faq: f }); }} placeholder="Answer" className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[var(--gold)]" />
                      </div>
                      <button type="button" onClick={() => setCt({ ...ct, faq: ct.faq.filter((_, j) => j !== i) })} className="text-red-400 hover:text-red-300 text-sm px-2 py-1 mt-1">✕</button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input type="text" value={newFaqQ} onChange={(e) => setNewFaqQ(e.target.value)} placeholder="New question" className="flex-1 bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[var(--gold)]" />
                    <input type="text" value={newFaqA} onChange={(e) => setNewFaqA(e.target.value)} placeholder="New answer" className="flex-1 bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[var(--gold)]" />
                    <button type="button" onClick={() => { if (newFaqQ.trim() && newFaqA.trim()) { setCt({ ...ct, faq: [...ct.faq, { question: newFaqQ.trim(), answer: newFaqA.trim() }] }); setNewFaqQ(''); setNewFaqA(''); } }} className="text-[var(--gold)] hover:text-[var(--gold-light)] text-sm px-3 py-1 font-bold">+ Add</button>
                  </div>
                </div>

                {/* Refund Policy */}
                <div className="border border-white/10 rounded-xl p-4 space-y-3">
                  <h3 className="text-white font-bold text-xs uppercase tracking-wider">Return &amp; Refund Policy</h3>
                  <div>
                    <label className="text-xs text-white/70 mb-1 block">Title</label>
                    <input type="text" value={ct.refundPolicy.title} onChange={(e) => setCt({ ...ct, refundPolicy: { ...ct.refundPolicy, title: e.target.value } })} className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--gold)]" />
                  </div>
                  <div>
                    <label className="text-xs text-white/70 mb-1 block">Content</label>
                    <textarea rows={6} value={ct.refundPolicy.content} onChange={(e) => setCt({ ...ct, refundPolicy: { ...ct.refundPolicy, content: e.target.value } })} className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--gold)] resize-none" />
                  </div>
                </div>

                {/* Privacy Policy */}
                <div className="border border-white/10 rounded-xl p-4 space-y-3">
                  <h3 className="text-white font-bold text-xs uppercase tracking-wider">Privacy Policy</h3>
                  <div>
                    <label className="text-xs text-white/70 mb-1 block">Title</label>
                    <input type="text" value={ct.privacyPolicy.title} onChange={(e) => setCt({ ...ct, privacyPolicy: { ...ct.privacyPolicy, title: e.target.value } })} className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--gold)]" />
                  </div>
                  <div>
                    <label className="text-xs text-white/70 mb-1 block">Content</label>
                    <textarea rows={6} value={ct.privacyPolicy.content} onChange={(e) => setCt({ ...ct, privacyPolicy: { ...ct.privacyPolicy, content: e.target.value } })} className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--gold)] resize-none" />
                  </div>
                </div>

                {/* Terms of Service */}
                <div className="border border-white/10 rounded-xl p-4 space-y-3">
                  <h3 className="text-white font-bold text-xs uppercase tracking-wider">Terms of Service</h3>
                  <div>
                    <label className="text-xs text-white/70 mb-1 block">Title</label>
                    <input type="text" value={ct.termsOfService.title} onChange={(e) => setCt({ ...ct, termsOfService: { ...ct.termsOfService, title: e.target.value } })} className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--gold)]" />
                  </div>
                  <div>
                    <label className="text-xs text-white/70 mb-1 block">Content</label>
                    <textarea rows={6} value={ct.termsOfService.content} onChange={(e) => setCt({ ...ct, termsOfService: { ...ct.termsOfService, content: e.target.value } })} className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--gold)] resize-none" />
                  </div>
                </div>

                <button type="submit" className="btn-gold w-full py-4 rounded-xl text-xs uppercase tracking-[0.2em] font-semibold">
                  Save All Changes
                </button>
              </form>
            )}

            {/* Delete confirmation modal */}
            {confirmDelete && (
              <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                <div className="bg-[#1a1a24] border border-red-400/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                  <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-2">Confirm Delete</h3>
                  <p className="text-white/70 text-sm mb-6">
                    Are you sure you want to delete <span className="text-white font-semibold">"{confirmDelete.name}"</span>? This cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="flex-1 py-3 rounded-xl border border-white/20 text-white/70 text-xs uppercase tracking-wider font-semibold hover:bg-white/5 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteConfirm}
                      className="flex-1 py-3 rounded-xl bg-red-500/90 text-white text-xs uppercase tracking-wider font-semibold hover:bg-red-500 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
