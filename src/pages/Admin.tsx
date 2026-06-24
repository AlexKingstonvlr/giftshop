import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { type Product, type TestimonialItem, type Category } from '../data/products';
import { Lock, PlusCircle, CheckCircle, Image as ImageIcon, FileText, Pencil, Trash2, ArrowLeft, ArrowLeftCircle } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface AdminPageProps {
  products: Product[];
  testimonials: TestimonialItem[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (id: number, product: Product) => void;
  onDeleteProduct: (id: number) => void;
  onAddTestimonial: (testimonial: TestimonialItem) => void;
  onUpdateTestimonial: (id: string, testimonial: TestimonialItem) => void;
  onDeleteTestimonial: (id: string) => void;
}

export default function Admin({ products, testimonials, onAddProduct, onUpdateProduct, onDeleteProduct, onAddTestimonial, onUpdateTestimonial, onDeleteTestimonial }: AdminPageProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const { content, updateContent } = useSiteContent();
  const [activeTab, setActiveTab] = useState<'product' | 'testimonial' | 'content' | 'editproduct' | 'edittestimonial'>('product');
  const [published, setPublished] = useState<null | { type: 'product' | 'testimonial' | 'content'; name: string }>(null);
  const [ct, setCt] = useState({ ...content });
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');

  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<Category>('Epoxy Resin');
  const [prodDesc, setProdDesc] = useState('');
  const [prodMaterial, setProdMaterial] = useState('');
  const [prodSize, setProdSize] = useState('');
  const [prodTime, setProdTime] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodImage, setProdImage] = useState('');

  const [testimName, setTestimName] = useState('');
  const [testimQuote, setTestimQuote] = useState('');
  const [testimImage, setTestimImage] = useState('');

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

  const SuccessBanner = published ? (
    <div className="mb-6 rounded-xl overflow-hidden border border-emerald-300 bg-emerald-50 shadow-sm">
      <div className="h-1 bg-gradient-to-r from-emerald-400 to-emerald-500" />
      <div className="p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center flex-shrink-0">
          <CheckCircle size={22} className="text-emerald-600" />
        </div>
        <div className="flex-1">
          <h4 className="text-emerald-700 font-bold text-sm uppercase tracking-wider mb-1">
            {published.type === 'product' ? 'Product Published Successfully!' : published.type === 'testimonial' ? 'Testimonial Published Successfully!' : 'Content Updated!'}
          </h4>
          <p className="text-gray-600 text-sm leading-relaxed mb-3 font-medium">
            "{published.name}" is now live on the website.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/"
              className="bg-emerald-600 text-white font-bold text-xs uppercase px-4 py-2 rounded-lg hover:bg-emerald-500 transition-colors shadow-sm"
            >
              View on Website →
            </Link>
            <button
              onClick={() => setPublished(null)}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold px-3 py-2 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="min-h-screen bg-[#f5f2ed] font-sans-lux">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-serif-lux text-gray-900 font-semibold">Gift Shop Vellore Admin</h1>
            <p className="text-xs text-gray-500 mt-0.5">Manage products, testimonials, and site content.</p>
          </div>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-500 font-semibold transition-colors"
          >
            <ArrowLeftCircle size={18} /> Back to site
          </Link>
        </div>
      </header>

      {!isLoggedIn ? (
        <div className="max-w-md mx-auto mt-24 px-6">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 rounded-full border-2 border-amber-300 bg-amber-50 flex items-center justify-center mx-auto mb-6">
              <Lock size={28} className="text-amber-500" />
            </div>
            <h2 className="font-serif-lux text-3xl text-gray-900 mb-2 font-light">
              Business Owner Login
            </h2>
            <p className="text-xs text-gray-500 mb-8">
              Enter your admin password to manage products and testimonials. (Hint: enter <span className="text-amber-600 font-semibold">admin123</span>)
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  required
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-center text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                />
                {loginError && (
                  <p className="text-red-500 text-xs mt-2">
                    Incorrect password. Please try again or use admin123.
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs uppercase py-4 rounded-xl tracking-[0.2em] transition-colors shadow-md"
              >
                Access Dashboard
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* Navigation tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={startAddProduct}
              className={`flex-1 min-w-[120px] py-3 px-3 rounded-xl text-xs uppercase tracking-wider font-sans-lux transition-all flex items-center justify-center gap-2 ${
                activeTab === 'product'
                  ? 'bg-amber-500 text-white font-bold shadow-md'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold'
              }`}
            >
              <PlusCircle size={14} /> Add Product
            </button>
            <button
              onClick={() => setActiveTab('editproduct')}
              className={`flex-1 min-w-[120px] py-3 px-3 rounded-xl text-xs uppercase tracking-wider font-sans-lux transition-all flex items-center justify-center gap-2 ${
                activeTab === 'editproduct'
                  ? 'bg-amber-500 text-white font-bold shadow-md'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold'
              }`}
            >
              <Pencil size={14} /> Edit Products
            </button>
            <button
              onClick={startAddTestimonial}
              className={`flex-1 min-w-[120px] py-3 px-3 rounded-xl text-xs uppercase tracking-wider font-sans-lux transition-all flex items-center justify-center gap-2 ${
                activeTab === 'testimonial'
                  ? 'bg-amber-500 text-white font-bold shadow-md'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold'
              }`}
            >
              <PlusCircle size={14} /> Add Testimonial
            </button>
            <button
              onClick={() => setActiveTab('edittestimonial')}
              className={`flex-1 min-w-[120px] py-3 px-3 rounded-xl text-xs uppercase tracking-wider font-sans-lux transition-all flex items-center justify-center gap-2 ${
                activeTab === 'edittestimonial'
                  ? 'bg-amber-500 text-white font-bold shadow-md'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold'
              }`}
            >
              <Pencil size={14} /> Edit Testimonials
            </button>
            <button
              onClick={startContentEdit}
              className={`flex-1 min-w-[120px] py-3 px-3 rounded-xl text-xs uppercase tracking-wider font-sans-lux transition-all flex items-center justify-center gap-2 ${
                activeTab === 'content'
                  ? 'bg-amber-500 text-white font-bold shadow-md'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold'
              }`}
            >
              <FileText size={14} /> Site Content
            </button>
          </div>

          {SuccessBanner}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
            {activeTab === 'product' ? (
              <form onSubmit={handleProductSubmit} className="space-y-5">
                {editingProductId && (
                  <div className="flex items-center gap-2 mb-2">
                    <button type="button" onClick={resetProductForm} className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
                      <ArrowLeft size={14} /> Back to Add New
                    </button>
                    <span className="text-xs text-amber-600 font-semibold">Editing: {prodName || 'Product'}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-700 font-semibold mb-1 block">Product Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Glowing Galaxy Ring Box"
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-700 font-semibold mb-1 block">Product Category</label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value as Category)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                    >
                      <option value="Epoxy Resin">Epoxy Resin</option>
                      <option value="Laser Cut">Laser Cut</option>
                      <option value="3D Printing">3D Printing</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-700 font-semibold mb-1 block">Short Description</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe the custom product in simple English..."
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-gray-700 font-semibold mb-1 block">Material</label>
                    <input
                      type="text"
                      placeholder="e.g. Wood and Resin"
                      value={prodMaterial}
                      onChange={(e) => setProdMaterial(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-700 font-semibold mb-1 block">Size</label>
                    <input
                      type="text"
                      placeholder="e.g. 20 x 15 cm"
                      value={prodSize}
                      onChange={(e) => setProdSize(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-700 font-semibold mb-1 block">Time to Deliver</label>
                    <input
                      type="text"
                      placeholder="e.g. 5 days"
                      value={prodTime}
                      onChange={(e) => setProdTime(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-700 font-semibold mb-1 block">Approximate Price</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹4,500"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-700 font-semibold mb-2 block">Upload Product Image</label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-amber-400 transition-colors cursor-pointer bg-gray-50">
                    {prodImage ? (
                      <div className="flex items-center gap-4 w-full">
                        <img src={prodImage} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                        <span className="text-xs text-emerald-600 font-semibold">✓ Image uploaded successfully (Click to replace)</span>
                      </div>
                    ) : (
                      <div className="text-center flex flex-col items-center">
                        <ImageIcon size={28} className="text-gray-400 mb-2" />
                        <span className="text-xs text-gray-500 font-medium mb-1">Click to select an image file</span>
                        <span className="text-[10px] text-gray-400">JPG, PNG, WEBP supported</span>
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
                  className={`w-full py-4 rounded-xl text-xs uppercase tracking-[0.2em] font-semibold mt-4 transition-all shadow-sm ${
                    submitting
                      ? 'bg-amber-300 text-white cursor-not-allowed'
                      : 'bg-amber-500 hover:bg-amber-400 text-white'
                  }`}
                >
                  {submitting ? 'Saving…' : editingProductId ? 'Update Product' : 'Publish New Product'}
                </button>
              </form>
            ) : activeTab === 'testimonial' ? (
              <form onSubmit={handleTestimonialSubmit} className="space-y-5">
                {editingTestimonialId && (
                  <div className="flex items-center gap-2 mb-2">
                    <button type="button" onClick={resetTestimonialForm} className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
                      <ArrowLeft size={14} /> Back to Add New
                    </button>
                    <span className="text-xs text-amber-600 font-semibold">Editing: {testimName || 'Testimonial'}</span>
                  </div>
                )}
                <div>
                  <label className="text-xs text-gray-700 font-semibold mb-1 block">Customer Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={testimName}
                    onChange={(e) => setTestimName(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-700 font-semibold mb-1 block">Small Description / Review</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="e.g. I bought a custom nameplate and it looks very beautiful on my door. Excellent customer service!"
                    value={testimQuote}
                    onChange={(e) => setTestimQuote(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-700 font-semibold mb-2 block">Upload Customer or Product Image</label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-amber-400 transition-colors cursor-pointer bg-gray-50">
                    {testimImage ? (
                      <div className="flex items-center gap-4 w-full">
                        <img src={testimImage} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                        <span className="text-xs text-emerald-600 font-semibold">✓ Image uploaded successfully (Click to replace)</span>
                      </div>
                    ) : (
                      <div className="text-center flex flex-col items-center">
                        <ImageIcon size={28} className="text-gray-400 mb-2" />
                        <span className="text-xs text-gray-500 font-medium mb-1">Click to upload image</span>
                        <span className="text-[10px] text-gray-400">Optional customer photo or item photo</span>
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
                  className={`w-full py-4 rounded-xl text-xs uppercase tracking-[0.2em] font-semibold mt-4 transition-all shadow-sm ${
                    submitting
                      ? 'bg-amber-300 text-white cursor-not-allowed'
                      : 'bg-amber-500 hover:bg-amber-400 text-white'
                  }`}
                >
                  {submitting ? 'Saving…' : editingTestimonialId ? 'Update Testimonial' : 'Publish Testimonial'}
                </button>
              </form>
            ) : activeTab === 'editproduct' ? (
              <div className="space-y-3">
                <h3 className="text-gray-800 font-bold text-sm uppercase tracking-wider mb-4">All Products ({products.length})</h3>
                {products.length === 0 ? (
                  <p className="text-gray-400 text-sm">No products yet.</p>
                ) : (
                  products.map((product) => (
                    <div key={product.id} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3 hover:bg-gray-50 transition-colors">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 text-sm font-semibold truncate">{product.name}</p>
                        <p className="text-gray-500 text-xs">{product.price}</p>
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
              <div className="space-y-3">
                <h3 className="text-gray-800 font-bold text-sm uppercase tracking-wider mb-4">All Testimonials ({testimonials.length})</h3>
                {testimonials.length === 0 ? (
                  <p className="text-gray-400 text-sm">No testimonials yet.</p>
                ) : (
                  testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3 hover:bg-gray-50 transition-colors">
                      <div className="w-12 h-12 rounded-lg bg-amber-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                        {testimonial.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 text-sm font-semibold truncate">{testimonial.name}</p>
                        <p className="text-gray-500 text-xs truncate">{testimonial.quote}</p>
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
              <form onSubmit={handleContentSubmit} className="space-y-6">
                <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                  <h3 className="text-gray-800 font-bold text-xs uppercase tracking-wider">Hero Section</h3>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Title (HTML allowed)</label>
                    <input type="text" value={ct.hero.title} onChange={(e) => setCt({ ...ct, hero: { ...ct.hero, title: e.target.value } })} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Subtitle</label>
                    <input type="text" value={ct.hero.subtitle} onChange={(e) => setCt({ ...ct, hero: { ...ct.hero, subtitle: e.target.value } })} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Description</label>
                    <textarea rows={3} value={ct.hero.description} onChange={(e) => setCt({ ...ct, hero: { ...ct.hero, description: e.target.value } })} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 resize-none" />
                  </div>
                </div>

                <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                  <h3 className="text-gray-800 font-bold text-xs uppercase tracking-wider">About Us</h3>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Title</label>
                    <input type="text" value={ct.about.title} onChange={(e) => setCt({ ...ct, about: { ...ct.about, title: e.target.value } })} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Content</label>
                    <textarea rows={6} value={ct.about.content} onChange={(e) => setCt({ ...ct, about: { ...ct.about, content: e.target.value } })} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 resize-none" />
                  </div>
                </div>

                <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                  <h3 className="text-gray-800 font-bold text-xs uppercase tracking-wider">FAQ</h3>
                  {ct.faq.map((item, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <div className="flex-1 space-y-1">
                        <input type="text" value={item.question} onChange={(e) => { const f = [...ct.faq]; f[i] = { ...f[i], question: e.target.value }; setCt({ ...ct, faq: f }); }} placeholder="Question" className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
                        <input type="text" value={item.answer} onChange={(e) => { const f = [...ct.faq]; f[i] = { ...f[i], answer: e.target.value }; setCt({ ...ct, faq: f }); }} placeholder="Answer" className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
                      </div>
                      <button type="button" onClick={() => setCt({ ...ct, faq: ct.faq.filter((_, j) => j !== i) })} className="text-red-500 hover:text-red-400 text-sm px-2 py-1 mt-1">✕</button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input type="text" value={newFaqQ} onChange={(e) => setNewFaqQ(e.target.value)} placeholder="New question" className="flex-1 bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
                    <input type="text" value={newFaqA} onChange={(e) => setNewFaqA(e.target.value)} placeholder="New answer" className="flex-1 bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
                    <button type="button" onClick={() => { if (newFaqQ.trim() && newFaqA.trim()) { setCt({ ...ct, faq: [...ct.faq, { question: newFaqQ.trim(), answer: newFaqA.trim() }] }); setNewFaqQ(''); setNewFaqA(''); } }} className="text-amber-600 hover:text-amber-500 text-sm px-3 py-1 font-bold">+ Add</button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                  <h3 className="text-gray-800 font-bold text-xs uppercase tracking-wider">Return &amp; Refund Policy</h3>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Title</label>
                    <input type="text" value={ct.refundPolicy.title} onChange={(e) => setCt({ ...ct, refundPolicy: { ...ct.refundPolicy, title: e.target.value } })} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Content</label>
                    <textarea rows={6} value={ct.refundPolicy.content} onChange={(e) => setCt({ ...ct, refundPolicy: { ...ct.refundPolicy, content: e.target.value } })} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 resize-none" />
                  </div>
                </div>

                <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                  <h3 className="text-gray-800 font-bold text-xs uppercase tracking-wider">Privacy Policy</h3>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Title</label>
                    <input type="text" value={ct.privacyPolicy.title} onChange={(e) => setCt({ ...ct, privacyPolicy: { ...ct.privacyPolicy, title: e.target.value } })} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Content</label>
                    <textarea rows={6} value={ct.privacyPolicy.content} onChange={(e) => setCt({ ...ct, privacyPolicy: { ...ct.privacyPolicy, content: e.target.value } })} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 resize-none" />
                  </div>
                </div>

                <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                  <h3 className="text-gray-800 font-bold text-xs uppercase tracking-wider">Terms of Service</h3>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Title</label>
                    <input type="text" value={ct.termsOfService.title} onChange={(e) => setCt({ ...ct, termsOfService: { ...ct.termsOfService, title: e.target.value } })} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Content</label>
                    <textarea rows={6} value={ct.termsOfService.content} onChange={(e) => setCt({ ...ct, termsOfService: { ...ct.termsOfService, content: e.target.value } })} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 resize-none" />
                  </div>
                </div>

                <button type="submit" className="w-full py-4 rounded-xl text-xs uppercase tracking-[0.2em] font-semibold bg-amber-500 hover:bg-amber-400 text-white transition-all shadow-sm">
                  Save All Changes
                </button>
              </form>
            )}
          </div>

          {/* Delete confirmation modal */}
          {confirmDelete && (
            <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-sm w-full shadow-xl">
                <h3 className="text-gray-900 font-bold text-sm uppercase tracking-wider mb-2">Confirm Delete</h3>
                <p className="text-gray-600 text-sm mb-6">
                  Are you sure you want to delete <span className="text-gray-900 font-semibold">"{confirmDelete.name}"</span>? This cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 text-xs uppercase tracking-wider font-semibold hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="flex-1 py-3 rounded-xl bg-red-500 text-white text-xs uppercase tracking-wider font-semibold hover:bg-red-400 transition-all"
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
  );
}
