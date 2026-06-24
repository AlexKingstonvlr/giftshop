import { useState } from 'react';
import { useScrollFade } from '../hooks/useScrollFade';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { STORE_MAPS_URL } from '../constants';

const crafts = ['Epoxy Resin', 'Laser Cut Wood', '3D Printing', 'Mixed Material', 'Help me choose'];
const budgets = ['Under ₹5,000', '₹5,000 – ₹15,000', '₹15,000 – ₹50,000', '₹50,000+'];

type FormFields = {
  name: string; phone: string; email: string; craft: string; budget: string; message: string;
};
type FormErrors = Partial<Record<keyof FormFields, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form: FormFields): FormErrors {
  const e: FormErrors = {};
  const name = form.name.trim();
  if (!name) e.name = 'Name is required';
  else if (name.length < 2) e.name = 'Name must be at least 2 characters';
  else if (/^[\d\s]+$/.test(name)) e.name = 'Please enter a valid name';

  const phone = form.phone.replace(/\D/g, '');
  if (!phone) e.phone = 'Phone number is required';
  else if (phone.length !== 10) e.phone = 'Phone must be exactly 10 digits';
  else if (!/^[6-9]/.test(phone)) e.phone = 'Phone must start with 6, 7, 8, or 9';

  if (form.email && !EMAIL_RE.test(form.email)) e.email = 'Please enter a valid email address';

  if (!form.craft) e.craft = 'Please select a craft category';
  if (!form.budget) e.budget = 'Please select a budget range';

  const msg = form.message.trim();
  if (!msg) e.message = 'Please tell us about your gift idea';
  else if (msg.length < 10) e.message = 'Please provide at least 10 characters';

  return e;
}

export default function CustomOrder() {
  const headerRef = useScrollFade();
  const formRef = useScrollFade();
  const [form, setForm] = useState<FormFields>({
    name: '', phone: '', email: '', craft: '', budget: '', message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [botField, setBotField] = useState('');

  const updateField = (name: keyof FormFields, value: string) => {
    const next = { ...form, [name]: value };
    setForm(next);
    if (touched[name]) setErrors(validate(next));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      updateField('phone', value.replace(/\D/g, ''));
    } else {
      updateField(name as keyof FormFields, value);
    }
  };

  const handleBlur = (name: keyof FormFields) => {
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors(validate(form));
  };

  const errorsList = validate(form);
  const valid = Object.keys(errorsList).length === 0;

  const getEnquiryMessage = () => {
    const contact = form.email || form.phone || 'Not provided';
    return `Hello Gift Shop Vellore,%0A%0AMy name is ${form.name || 'Customer'}.%0A%0AI am interested in ordering a custom gift.%0A%0A*Details:*%0A- Craft Category: ${form.craft || 'Not selected'}%0A- Budget: ${form.budget || 'Not selected'}%0A%0A*My Request:*%0A${form.message || 'Please contact me to discuss further.'}%0A%0AYou can reach me at: ${contact}%0A%0AThank you!`;
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || botField) return;
    setSubmitting(true);

    const subject = `Custom Gift Enquiry from ${form.name || 'Customer'}`;
    const contactInfo = `Phone: ${form.phone}\nEmail: ${form.email || 'Not provided'}`;
    const body = `Hello Gift Shop Vellore,\n\nMy name is ${form.name || 'Customer'}.\n\nI am interested in ordering a custom gift.\n\nDetails:\n- Craft Category: ${form.craft || 'Not selected'}\n- Budget: ${form.budget || 'Not selected'}\n- ${contactInfo}\n\nMy Request:\n${form.message || 'Please contact me to discuss further.'}\n\nThank you!`;

    const payload = new FormData();
    payload.append('access_key', '7dba30b9-e27c-4c29-9603-ca6195ab5d79');
    payload.append('subject', subject);
    payload.append('from_name', form.name || 'Customer');
    payload.append('email', 'giftshop.vlr@gmail.com');
    payload.append('message', body);

    try {
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: payload });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        alert('Something went wrong. Please email us directly at giftshop.vlr@gmail.com or try again.');
      }
    } catch {
      alert('Network error. Please email us directly at giftshop.vlr@gmail.com or try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
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
            <span className="text-sm tracking-[0.2em] uppercase text-[var(--gold)] font-sans-lux font-bold">
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
            <div className="glass-lux-light p-8 border border-[var(--border)] rounded-2xl shadow-lg">
              <div className="w-14 h-14 rounded-2xl border border-[var(--gold)]/30 flex items-center justify-center mb-6 bg-white shadow-md">
                <Mail size={22} className="text-[var(--gold)]" />
              </div>
              <h3 className="font-serif-lux text-2xl text-[var(--cream)] mb-2 font-semibold">Email Us</h3>
              <p className="text-[var(--cream)]/60 text-xs tracking-wider uppercase mb-3 font-sans-lux font-medium">We reply very fast</p>
              <a href="mailto:giftshop.vlr@gmail.com" className="text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors font-sans-lux font-bold text-base block break-all">
                giftshop.vlr@gmail.com
              </a>
            </div>

            <div className="glass-lux-light p-8 border border-[var(--border)] rounded-2xl shadow-lg">
              <div className="w-14 h-14 rounded-2xl border border-[var(--gold)]/30 flex items-center justify-center mb-6 bg-white shadow-md">
                <Phone size={22} className="text-[var(--gold)]" />
              </div>
              <h3 className="font-serif-lux text-2xl text-[var(--cream)] mb-2 font-semibold">Call Us</h3>
              <p className="text-[var(--cream)]/60 text-xs tracking-wider uppercase mb-3 font-sans-lux font-medium">Direct phone order</p>
              <a href="tel:9514585959" className="text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors font-sans-lux font-bold text-lg block">
                9514585959
              </a>
            </div>

            <a
              href={STORE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-lux-light p-8 border border-[var(--border)] rounded-2xl shadow-lg block group cursor-pointer hover:border-[var(--gold)]/40 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl border border-[var(--gold)]/30 flex items-center justify-center mb-6 bg-white shadow-md group-hover:border-[var(--gold)]/60 transition-colors">
                <MapPin size={22} className="text-[var(--gold)]" />
              </div>
              <h3 className="font-serif-lux text-2xl text-[var(--cream)] mb-2 font-semibold">Our Vellore Store</h3>
              <p className="text-[var(--cream)]/75 text-base leading-relaxed font-sans-lux">
                Gift Shop Vellore<br />
                Siva Complex, 239/1, Phase 2<br />
                Sathuvachari, Vellore, Tamil Nadu 632009<br />
                <span className="text-[var(--primary)] text-xs font-semibold block mt-3">✓ Open Monday to Saturday</span>
              </p>
            </a>
          </div>

          {/* Form */}
          <div ref={formRef} className="scroll-fade lg:col-span-3">
            <div className="bg-white border border-[var(--border)] rounded-2xl shadow-xl relative overflow-hidden">
              <div className="p-8 md:p-10">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--primary)]/60 to-transparent" />

                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-[var(--primary)]/20 flex items-center justify-center mb-6">
                      <Mail size={28} className="text-[var(--primary)]" />
                    </div>
                    <h3 className="font-serif-lux text-3xl text-[var(--cream)] mb-3 font-semibold">Thank you, {form.name || 'friend'}!</h3>
                    <p className="text-[var(--cream)]/70 font-sans-lux max-w-md leading-relaxed">
                      We&apos;ve received your custom gift enquiry. Our team will review it and get back to you on the same day with pricing and details.
                    </p>
                  </div>
                ) : (
                <form onSubmit={handleSendEmail} className="space-y-6 font-sans-lux">
                  {/* Honeypot */}
                  <div className="absolute -left-[9999px]" aria-hidden="true">
                    <input name="bot-field" value={botField} onChange={(e) => setBotField(e.target.value)} tabIndex={-1} autoComplete="off" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs text-[var(--cream)]/80 tracking-wider uppercase mb-2 block font-bold font-sans-lux">
                        Your Full Name *
                      </label>
                      <input
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        onBlur={() => handleBlur('name')}
                        placeholder="e.g. Ramesh Kumar"
                        className={`w-full bg-[var(--charcoal)] border rounded-xl px-4 py-3.5 text-[var(--cream)] placeholder-[var(--cream-muted)] text-sm focus:outline-none transition-colors duration-300 ${
                          touched.name && errors.name ? 'border-red-400 focus:border-red-400' : 'border-[var(--border)] focus:border-[var(--primary)]'
                        }`}
                      />
                      {touched.name && errors.name && <p className="text-red-400 text-[11px] mt-1.5 font-medium">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="text-xs text-[var(--cream)]/80 tracking-wider uppercase mb-2 block font-bold font-sans-lux">
                        Phone Number *
                      </label>
                      <input
                        name="phone"
                        type="text"
                        inputMode="numeric"
                        value={form.phone}
                        onChange={handleChange}
                        onBlur={() => handleBlur('phone')}
                        placeholder="e.g. 9876543210"
                        maxLength={10}
                        className={`w-full bg-[var(--charcoal)] border rounded-xl px-4 py-3.5 text-[var(--cream)] placeholder-[var(--cream-muted)] text-sm focus:outline-none transition-colors duration-300 ${
                          touched.phone && errors.phone ? 'border-red-400 focus:border-red-400' : 'border-[var(--border)] focus:border-[var(--primary)]'
                        }`}
                      />
                      {touched.phone && errors.phone && <p className="text-red-400 text-[11px] mt-1.5 font-medium">{errors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-[var(--cream)]/80 tracking-wider uppercase mb-2 block font-bold font-sans-lux">
                      Email <span className="font-normal lowercase">(optional)</span>
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={() => handleBlur('email')}
                      placeholder="e.g. name@example.com"
                      className={`w-full bg-[var(--charcoal)] border rounded-xl px-4 py-3.5 text-[var(--cream)] placeholder-[var(--cream-muted)] text-sm focus:outline-none transition-colors duration-300 ${
                        touched.email && errors.email ? 'border-red-400 focus:border-red-400' : 'border-[var(--border)] focus:border-[var(--primary)]'
                      }`}
                    />
                    {touched.email && errors.email && <p className="text-red-400 text-[11px] mt-1.5 font-medium">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="text-xs text-[var(--cream)]/80 tracking-wider uppercase mb-3 block font-bold font-sans-lux">
                      Select Craft Category *
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {crafts.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => { updateField('craft', c); setTouched((t) => ({ ...t, craft: true })); }}
                          className={`text-xs px-4 py-2.5 rounded-xl tracking-wider border transition-all duration-300 font-bold ${
                            form.craft === c
                              ? 'bg-[var(--gold)] text-[#1a1a24] border-[var(--gold)] shadow-md shadow-[var(--gold)]/20'
                              : 'border-[var(--border)] text-[var(--cream)]/70 hover:border-[var(--gold)]/50 bg-white'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                    {touched.craft && errors.craft && <p className="text-red-400 text-[11px] mt-1.5 font-medium">{errors.craft}</p>}
                  </div>

                  <div>
                    <label className="text-xs text-[var(--cream)]/80 tracking-wider uppercase mb-3 block font-bold font-sans-lux">
                      Approximate Budget *
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {budgets.map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => { updateField('budget', b); setTouched((t) => ({ ...t, budget: true })); }}
                          className={`text-xs px-4 py-2.5 rounded-xl tracking-wider border transition-all duration-300 font-bold ${
                            form.budget === b
                              ? 'bg-[var(--gold)] text-[#1a1a24] border-[var(--gold)] shadow-md shadow-[var(--gold)]/20'
                              : 'border-[var(--border)] text-[var(--cream)]/70 hover:border-[var(--gold)]/50 bg-white'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                    {touched.budget && errors.budget && <p className="text-red-400 text-[11px] mt-1.5 font-medium">{errors.budget}</p>}
                  </div>

                  <div>
                    <label className="text-xs text-[var(--cream)]/80 tracking-wider uppercase mb-2 block font-bold font-sans-lux">
                      Tell Us About Your Custom Gift Idea *
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      onBlur={() => handleBlur('message')}
                      rows={5}
                      placeholder="e.g. I want a beautiful blue epoxy table for my dining room... OR I want a custom nameplate for my office door..."
                      className={`w-full bg-[var(--charcoal)] border rounded-xl px-4 py-3.5 text-[var(--cream)] placeholder-[var(--cream-muted)] text-sm focus:outline-none transition-colors duration-300 resize-none ${
                        touched.message && errors.message ? 'border-red-400 focus:border-red-400' : 'border-[var(--border)] focus:border-[var(--primary)]'
                      }`}
                    />
                    {touched.message && errors.message && <p className="text-red-400 text-[11px] mt-1.5 font-medium">{errors.message}</p>}
                  </div>

                  <p className="text-xs text-[var(--cream-muted)]/80 text-center -mt-2">
                    Have a reference photo? Send it to us on <strong>WhatsApp</strong> after submitting this form.
                  </p>

                  {/* Dual action buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <button
                      type="submit"
                      disabled={submitting || !valid}
                      className="btn-gold flex items-center justify-center gap-2.5 text-xs uppercase py-4 rounded-xl tracking-[0.2em] font-bold shadow-xl shadow-[var(--gold)]/20 hover:scale-[1.02] transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>Sending...</>
                      ) : (
                        <><Mail size={16} /> Send Email</>
                      )}
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
                )}
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
