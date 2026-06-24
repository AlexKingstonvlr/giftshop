import { useState, useMemo, useRef } from 'react';
import { useScrollFade } from '../hooks/useScrollFade';
import { categories, type Category, type Product } from '../data/products';
import { ArrowUpRight, X, Ruler, Clock, Layers, MessageCircle } from 'lucide-react';

function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const handleScrollToOrder = () => {
    onClose();
    const el = document.getElementById('custom-order');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in-up"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full max-h-[90vh] overflow-auto glass-lux border border-[var(--gold)]/30 rounded-2xl grid grid-cols-1 md:grid-cols-2 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--gold)]/20 transition-colors"
          aria-label="Close"
        >
          <X size={18} className="text-[var(--cream)]" />
        </button>

        <div className="relative aspect-square md:aspect-auto overflow-hidden bg-[var(--charcoal)] rounded-t-2xl md:rounded-tr-none md:rounded-l-2xl">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:hidden" />
        </div>

        <div className="p-8 md:p-10 flex flex-col justify-center font-sans-lux">
          <span className="text-xs tracking-[0.2em] uppercase text-[var(--primary)] mb-2 font-bold font-sans-lux">
            {product.category}
          </span>
          <h3 className="font-serif-lux text-3xl md:text-4xl text-[var(--cream)] mb-4 font-semibold leading-tight">
            {product.name}
          </h3>
          <p className="text-[var(--cream)]/80 leading-relaxed mb-8 text-sm md:text-base">
            {product.description}
          </p>

          <div className="space-y-4 mb-8 pb-8 border-b border-[var(--border)] text-sm">
            {product.material && (
              <div className="flex items-center gap-3">
                <Layers size={16} className="text-[var(--primary)] flex-shrink-0" />
                <span className="text-xs text-[var(--cream)]/60 uppercase tracking-wider min-w-[80px] font-semibold">Material</span>
                <span className="text-[var(--cream)] font-medium">{product.material}</span>
              </div>
            )}
            {product.dimensions && (
              <div className="flex items-center gap-3">
                <Ruler size={16} className="text-[var(--primary)] flex-shrink-0" />
                <span className="text-xs text-[var(--cream)]/60 uppercase tracking-wider min-w-[80px] font-semibold">Size</span>
                <span className="text-[var(--cream)] font-medium">{product.dimensions}</span>
              </div>
            )}
            {product.leadTime && (
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-[var(--primary)] flex-shrink-0" />
                <span className="text-xs text-[var(--cream)]/60 uppercase tracking-wider min-w-[80px] font-semibold">Delivery</span>
                <span className="text-[var(--cream)] font-medium">{product.leadTime}</span>
              </div>
            )}
          </div>

          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--cream)]/50 mb-1 font-semibold">Approximate Price</p>
              <p className="font-serif-lux text-4xl font-bold text-[var(--primary)]">{product.price}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleScrollToOrder}
              className="btn-gold text-xs uppercase px-7 py-4 rounded-xl tracking-[0.2em] font-bold flex-1 text-center"
            >
              Order Custom Gift
            </button>
            <button
              onClick={() => {
                const text = `Hi, I'm interested in the ${product.name} priced at ${product.price}. Can we discuss further?`;
                window.open(`https://wa.me/919514585959?text=${encodeURIComponent(text)}`, '_blank');
              }}
              className="btn-outline-gold text-xs uppercase px-7 py-4 rounded-xl tracking-[0.2em] font-bold text-center flex items-center justify-center gap-2"
            >
              <MessageCircle size={16} /> WhatsApp Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, index, onClick }: { product: Product; index: number; onClick: () => void }) {
  const ref = useScrollFade();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    }
  };

  return (
    <div
      ref={ref}
      className="scroll-fade group cursor-pointer"
      style={{ transitionDelay: `${(index % 6) * 60}ms` }}
      onClick={onClick}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative aspect-[4/5] overflow-hidden bg-[var(--charcoal)] border border-[var(--gold)]/15 hover:border-[var(--gold)]/50 transition-all duration-500 rounded-2xl shadow-xl"
        style={{ transformStyle: 'preserve-3d', transition: 'transform 0.3s ease-out, border-color 0.5s, box-shadow 0.5s' }}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover product-image-zoom"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-75 group-hover:opacity-90 transition-opacity duration-500" />

        {/* Category badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--gold)] font-sans-lux font-bold px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg border border-[var(--gold)]/30">
            {product.category}
          </span>
        </div>

        {/* Arrow */}
        <div className="absolute top-4 right-4 w-10 h-10 rounded-xl border border-[var(--gold)]/30 flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-400 bg-black/70 backdrop-blur-md z-10">
          <ArrowUpRight size={16} className="text-[var(--gold)]" />
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10 font-sans-lux">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--cream)]/50 mb-2 font-bold font-sans-lux">
            Item #{String(product.id).length > 3 ? 'NEW' : String(product.id).padStart(2, '0')}
          </p>
          <h3 className="font-serif-lux text-2xl text-[var(--cream)] mb-3 font-semibold leading-tight group-hover:text-[var(--gold)] transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between pt-3 border-t border-[var(--gold)]/20">
            <span className="font-serif-lux text-xl font-bold text-gold-static">{product.price}</span>
            <span className="text-[11px] tracking-wider text-[var(--gold)] uppercase font-bold group-hover:translate-x-1 transition-transform duration-300">
              View Details →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ProductsGridProps {
  products: Product[];
}

export default function ProductsGrid({ products }: ProductsGridProps) {
  const [filter, setFilter] = useState<Category | 'All'>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const headerRef = useScrollFade();

  const filteredProducts = useMemo(
    () => (filter === 'All' ? products : products.filter((p) => p.category === filter)),
    [filter, products]
  );

  const filterButtons: (Category | 'All')[] = ['All', ...categories];

  return (
    <section id="collection" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div ref={headerRef} className="scroll-fade text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-12 bg-[var(--gold)]/60" />
            <span className="text-sm tracking-[0.2em] uppercase text-[var(--gold)] font-sans-lux font-bold">
              Our Complete Collection
            </span>
            <div className="h-px w-12 bg-[var(--gold)]/60" />
          </div>
          <h2 className="font-serif-lux text-5xl md:text-6xl font-light text-[var(--cream)] leading-[1.1] mb-6">
            Beautiful <span className="italic text-gold-gradient font-normal">custom made</span> gifts.
          </h2>
          <p className="font-sans-lux text-[var(--cream)]/70 max-w-xl mx-auto text-base md:text-lg">
            Click on any item to view details, size, and approximate price.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {filterButtons.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`text-xs tracking-[0.15em] uppercase px-6 py-3 rounded-xl border transition-all duration-300 font-sans-lux font-bold ${
                filter === cat
                  ? 'bg-[var(--gold)] text-[var(--obsidian)] border-[var(--gold)] shadow-lg shadow-[var(--gold)]/20'
                  : 'border-[var(--gold)]/20 text-[var(--cream)]/70 hover:border-[var(--gold)]/50 hover:text-[var(--gold)] bg-white/5'
              }`}
            >
              {cat === 'All' ? `All Items (${products.length})` : `${cat} (${products.filter((p) => p.category === cat).length})`}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              onClick={() => setSelectedProduct(product)}
            />
          ))}
        </div>

        {selectedProduct && (
          <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        )}
      </div>
    </section>
  );
}
