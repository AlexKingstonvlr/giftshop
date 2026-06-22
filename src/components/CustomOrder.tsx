import { useState, useRef } from 'react';
import { useScrollFade } from '../hooks/useScrollFade';
import { Mail, Phone, MapPin, MessageCircle, Image as ImageIcon, X } from 'lucide-react';

const crafts = ['Epoxy Resin', 'Laser Cut Wood', '3D Printing', 'Mixed Material', 'Help me choose'];
const budgets = ['Under ₹5,000', '₹5,000 – ₹15,000', '₹15,000 – ₹50,000', '₹50,000+'];

export default function CustomOrder() {
  const headerRef = useScrollFade();
  const formRef = useScrollFade();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    craft: '',
    budget: '',
    message: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getEnquiryMessage = () => {
    return `Hello Gift Shop Vellore,%0A%0AMy name is ${form.name || 'Customer'}.%0A%0AI am interested in ordering a custom gift.%0A%0A*Details:*%0A- Craft Category: ${form.craft || 'Not selected'}%0A- Budget: ${form.budget || 'Not selected'}%0A%0A*My Request:*%0A${form.message || 'Please contact me to discuss further.'}%0A%0AYou can reach me at: ${form.phone || 'Not provided'}%0A%0AThank you!`;
  };

  const getEmailMessage = () => {
    return `Hello Gift Shop Vellore,\n\nMy name is ${form.name || 'Customer'}.\n\nI am interested in ordering a custom gift.\n\nDetails:\n- Craft Category: ${form.craft || 'Not selected'}\n- Budget: ${form.budget || 'Not selected'}\n\nMy Request:\n${form.message || 'Please contact me to discuss further.'}\n\nYou can reach me at: ${form.phone || 'Not provided'}\n\nThank you!`;
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (imagePreview) {
      alert("Please remember to manually attach your reference image to the email before sending!");
    }
    const subject = `Custom Gift Enquiry from ${form.name || 'Customer'}`;
    const body = getEmailMessage();
    const url = `mailto:giftshop.vlr@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  };

  const handleWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (imagePreview) {
      alert("Please remember to manually attach your reference image in your WhatsApp message after it opens!");
    }
    const text = getEnquiryMessage();
    const url = `https://wa.me/919514585959?text=${text}`;
    window.open(url, '_blank');
  };

  return (
    <section id="custom-order" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[var(--gold)]/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div ref={headerRef} className="scroll-fade text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-12 bg-[var(--gold)]/60" />
            <span className="text-xs tracking-[0.2em] uppercase text-[var(--gold)] font-sans-lux font-bold">
              Start Your Order Here
            </span>
            <div className="h-px w-12 bg-[var(--gold)]/60" />
          </div>
          <h2 className="font-serif-lux text-5xl md:text-6xl font-light text-[var(--cream)] leading-[1.1] mb-6">
            Order your <span className="italic text-gold-gradient font-normal">custom gift</span> today.
          </h2>
          <p className="font-sans-lux text-[var(--cream)]/75 max-w-xl mx-auto text-base md:text-lg">
            Tell us what you want to create. We will review your message and reply to you on the same day with price details.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-lux-light p-8 border border-[var(--gold)]/15 rounded-2xl shadow-xl bg-black/30">
              <div className="w-14 h-14 rounded-2xl border border-[var(--gold)]/30 flex items-center justify-center mb-6 bg-white/5 shadow-md">
                <Mail size={22} className="text-[var(--gold)]" />
              </div>
              <h3 className="font-serif-lux text-2xl text-[var(--cream)] mb-2 font-semibold">Email Us</h3>
              <p className="text-[var(--cream)]/60 text-xs tracking-wider uppercase mb-3 font-sans-lux font-medium">We reply very fast</p>
              <a href="mailto:giftshop.vlr@gmail.com" className="text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors font-sans-lux font-bold text-base block break-all">
                giftshop.vlr@gmail.com
              </a>
            </div>

            <div className="glass-lux-light p-8 border border-[var(--gold)]/15 rounded-2xl shadow-xl bg-black/30">
              <div className="w-14 h-14 rounded-2xl border border-[var(--gold)]/30 flex items-center justify-center mb-6 bg-white/5 shadow-md">
                <Phone size={22} className="text-[var(--gold)]" />
              </div>
              <h3 className="font-serif-lux text-2xl text-[var(--cream)] mb-2 font-semibold">Call Us</h3>
              <p className="text-[var(--cream)]/60 text-xs tracking-wider uppercase mb-3 font-sans-lux font-medium">Direct phone order</p>
              <a href="tel:9514585959" className="text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors font-sans-lux font-bold text-lg block">
                9514585959
              </a>
            </div>

            <div className="glass-lux-light p-8 border border-[var(--gold)]/15 rounded-2xl shadow-xl bg-black/30">
              <div className="w-14 h-14 rounded-2xl border border-[var(--gold)]/30 flex items-center justify-center mb-6 bg-white/5 shadow-md">
                <MapPin size={22} className="text-[var(--gold)]" />
              </div>
              <h3 className="font-serif-lux text-2xl text-[var(--cream)] mb-2 font-semibold">Our Vellore Store</h3>
              <p className="text-[var(--cream)]/75 text-base leading-relaxed font-sans-lux">
                Gift Shop Vellore<br />
                Siva Complex, 239/1, Phase 2<br />
                Sathuvachari, Vellore, Tamil Nadu 632009<br />
                <span className="text-[var(--gold)] text-xs font-semibold block mt-3">✓ Open Monday to Saturday</span>
              </p>
            </div>
          </div>

          {/* Form */}
          <div ref={formRef} className="scroll-fade lg:col-span-3">
            <div className="glass-lux-light p-8 md:p-10 border border-[var(--gold)]/20 rounded-2xl shadow-2xl relative overflow-hidden bg-black/40">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--gold)]/60 to-transparent" />

                <form onSubmit={handleSendEmail} className="space-y-6 font-sans-lux">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs text-[var(--cream)]/80 tracking-wider uppercase mb-2 block font-bold font-sans-lux">
                        Your Full Name
                      </label>
                      <input
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-3.5 text-[var(--cream)] placeholder-[var(--cream)]/30 text-sm focus:outline-none focus:border-[var(--gold)] transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[var(--cream)]/80 tracking-wider uppercase mb-2 block font-bold font-sans-lux">
                        Phone Number or Email
                      </label>
                      <input
                        name="phone"
                        type="text"
                        required
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="e.g. 9876543210 or email"
                        className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-3.5 text-[var(--cream)] placeholder-[var(--cream)]/30 text-sm focus:outline-none focus:border-[var(--gold)] transition-colors duration-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-[var(--cream)]/80 tracking-wider uppercase mb-3 block font-bold font-sans-lux">
                      Select Craft Category
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {crafts.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, craft: c }))}
                          className={`text-xs px-4 py-2.5 rounded-xl tracking-wider border transition-all duration-300 font-bold ${
                            form.craft === c
                              ? 'bg-[var(--gold)] text-[var(--obsidian)] border-[var(--gold)] shadow-md shadow-[var(--gold)]/20'
                              : 'border-white/15 text-[var(--cream)]/70 hover:border-[var(--gold)]/50 bg-white/5'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-[var(--cream)]/80 tracking-wider uppercase mb-3 block font-bold font-sans-lux">
                      Approximate Budget
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {budgets.map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, budget: b }))}
                          className={`text-xs px-4 py-2.5 rounded-xl tracking-wider border transition-all duration-300 font-bold ${
                            form.budget === b
                              ? 'bg-[var(--gold)] text-[var(--obsidian)] border-[var(--gold)] shadow-md shadow-[var(--gold)]/20'
                              : 'border-white/15 text-[var(--cream)]/70 hover:border-[var(--gold)]/50 bg-white/5'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-[var(--cream)]/80 tracking-wider uppercase mb-2 block font-bold font-sans-lux">
                      Tell Us About Your Custom Gift Idea
                    </label>
                    <textarea
                      name="message"
                      required
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="e.g. I want a beautiful blue epoxy table for my dining room... OR I want a custom nameplate for my office door..."
                      className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-3.5 text-[var(--cream)] placeholder-[var(--cream)]/30 text-sm focus:outline-none focus:border-[var(--gold)] transition-colors duration-300 resize-none"
                    />
                  </div>

                  {/* Image upload */}
                  <div>
                    <label className="text-xs text-[var(--cream)]/80 tracking-wider uppercase mb-2 block font-bold font-sans-lux">
                      Attach Reference Image (optional)
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      id="custom-order-image"
                    />
                    {imagePreview ? (
                      <div className="relative inline-flex items-center gap-3 border border-[var(--gold)]/30 rounded-xl p-3 bg-black/40">
                        <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-white/20" />
                        <span className="text-xs text-emerald-400 font-semibold">Image selected</span>
                        <button
                          type="button"
                          onClick={removeImage}
                          className="ml-auto p-1 rounded-full bg-white/10 hover:bg-red-500/30 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor="custom-order-image"
                        className="flex items-center gap-3 border border-dashed border-white/20 rounded-xl px-4 py-4 hover:border-[var(--gold)] transition-colors cursor-pointer bg-black/30"
                      >
                        <ImageIcon size={20} className="text-[var(--gold)]/60" />
                        <span className="text-xs text-[var(--cream)]/60 font-medium">Click to upload an image (photo, sketch, or reference)</span>
                      </label>
                    )}
                  </div>

                  {/* Dual action buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <button
                      type="submit"
                      className="btn-gold flex items-center justify-center gap-2.5 text-xs uppercase py-4 rounded-xl tracking-[0.2em] font-bold shadow-xl shadow-[var(--gold)]/20 hover:scale-[1.02] transition-transform"
                    >
                      <Mail size={16} />
                      Send Email
                    </button>
                    <button
                      type="button"
                      onClick={handleWhatsApp}
                      className="btn-outline-gold flex items-center justify-center gap-2.5 text-xs uppercase py-4 rounded-xl tracking-[0.2em] font-bold hover:scale-[1.02] transition-transform"
                    >
                      <MessageCircle size={16} />
                      WhatsApp Us
                    </button>
                  </div>

                  <p className="text-center text-xs text-[var(--cream)]/50 tracking-wider pt-2 font-medium">
                    ✓ Fast friendly reply · No hidden charges · Best price guaranteed
                  </p>
                </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
